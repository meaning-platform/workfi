//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './IWorkFi.sol';
import './Bounty.sol';
import './BountyUtils.sol';
import './MathUtils.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Address.sol';

// TODO: Switch to a yield per second model.
// That way, whenever an investor invests, we can update a secodns yield for the entire gorup of investors
// and use that to calculate how much of the yield pool has been earned by investors and how much the 
// recruiter can get back.
// This makes it possible because everyone earns a yield at the same time: every second.
// TODO: If worker not found after worker deadline, everyone egts refunded but yield goes to investors because of the risk
// TODO: tests for unhappy paths (errors etc)
// TODO: Check arithmetic operations
// TODO Security: double check all type conversions
contract WorkFi is IWorkFi, ReentrancyGuard, Ownable {
	using Address for address payable;
	using BountyUtils for BountyMetadata;

	BountyMetadata[] bounties;
	mapping(uint256 => mapping(address => InvestmentMetadata[])) investments;

	mapping(address => bool) whitelistedStablecoins;

	address constant ETH_ADDRESS = address(0);
	uint256 public constant INVESTMENT_OPPORTUNITY_DURATION_PERCENTAGE_IN_BASIS_POINT = 30_00; // 30%

	function addStablecoinToWhitelist(address stablecoin) external override onlyOwner {
		whitelistedStablecoins[stablecoin] = true;
		emit StablecoinAddedToWhitelist(stablecoin);
	}

	function removeStablecoinFromWhitelist(address stablecoin) external override onlyOwner {
		whitelistedStablecoins[stablecoin] = false;
		emit StablecoinRemovedFromWhitelist(stablecoin);
	}

	function acceptWorker(uint256 bountyId, address worker) external override {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		if (worker == address(0)) {
			revert WorkerCannotBeZero();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (DeadlineUtils.isWorkerDeadlineExpired(bounty.workerDeadline)) {
			revert WorkerDeadlineExpired();
		}
		if (bounty.status != BountyStatus.Ongoing) {
			revert BountyIsNotOngoing();
		}
		if (bounty.worker != address(0)) {
			revert AWorkerWasAlreadyAccepted();
		}

		bounty.worker = worker;
		emit WorkerAccepted(bountyId, worker);
	}

	function createBounty(
		uint128 workerStablePay,
		uint128 workerNativePay,
		uint96 exchangeRate,
		address nativeToken,
		address stablecoin,
		uint128 dailyYieldPercentage,
		uint256 workerDeadline
	) external payable override nonReentrant returns (uint256) {
		uint128 yieldPool = _calculateYieldPool(workerNativePay, dailyYieldPercentage, block.timestamp, workerDeadline);
		uint128 amountOfNtOnBounty = workerNativePay + yieldPool;
		if (nativeToken == ETH_ADDRESS) {
			if (msg.value != amountOfNtOnBounty) {
				revert ThisAmountOfEthIsRequired(amountOfNtOnBounty);
			}
		} else {
			if (msg.value > 0) {
				revert ValueShouldBeZeroIfNotPayingWithEth();
			}
		}

		if (!whitelistedStablecoins[stablecoin]) {
			revert NotAWhitelistedStablecoin();
		}
		DeadlineUtils.revertIfWorkerDeadlineIsInvalid(block.timestamp, workerDeadline);

		BountyMetadata memory bounty = BountyMetadata({
			workerStablePay: workerStablePay,
			workerNativePay: workerNativePay,
			exchangeRate: exchangeRate,
			stablecoin: stablecoin,
			nativeToken: nativeToken,
			dailyYieldPercentage: dailyYieldPercentage,
			worker: address(0),
			recruiter: msg.sender,
			status: BountyStatus.Ongoing,
			workerDeadline: workerDeadline,
			initialWorkerStablePay: workerStablePay,
			initialWorkerNativePay: workerNativePay,
			creationDate: block.timestamp,
			workerPaidAt: 0
		});

		bounties.push(bounty);

		emit BountyCreated(bounties.length, msg.sender);

		if (nativeToken != ETH_ADDRESS) {
			// TODO: Check if supports interface for security ?
			IERC20 token = IERC20(nativeToken);
			// TODO: Use Escrow or other Payment contract ? https://docs.openzeppelin.com/contracts/2.x/api/payment
			token.transferFrom(msg.sender, address(this), amountOfNtOnBounty);
		}

		if (workerStablePay > 0) {
			IERC20 stablecoinContract = IERC20(bounty.stablecoin);
			stablecoinContract.transferFrom(msg.sender, address(this), workerStablePay);
		}

		return bounties.length;
	}

	function invest(uint256 bountyId, uint128 stableAmount) external override {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (bounty.isInvestmentOpportunityClosed(INVESTMENT_OPPORTUNITY_DURATION_PERCENTAGE_IN_BASIS_POINT)) {
			revert InvestmentOpportunityIsClosed();
		}
		if (msg.sender == bounty.worker) {
			revert WorkerCannotInvest();
		}
		if (msg.sender == bounty.recruiter) {
			revert RecruiterCannotInvest();
		}
		uint128 maxPossibleInvestment = getStableNeeded(bounty.workerNativePay, bounty.exchangeRate);
		if (stableAmount > maxPossibleInvestment) {
			revert MaxInvestmentExceeded(maxPossibleInvestment);
		}
		uint128 workerNativePayGoingToTheInvestor = getNativePayFromStable(stableAmount, bounty.exchangeRate);
		bounty.workerNativePay -= workerNativePayGoingToTheInvestor;
		bounty.workerStablePay += stableAmount;

		investments[bountyId][msg.sender].push(
			InvestmentMetadata({stableAmount: stableAmount, creationDate: block.timestamp})
		);

		emit Invested(bountyId, msg.sender, stableAmount);
		// TODO: Use Escrow or other Payment contract ? https://docs.openzeppelin.com/contracts/2.x/api/payment
		// TODO: What happens if a stable gets removed from the whitelist while a task is using it as stable ?
		IERC20 stablecoinContract = IERC20(bounty.stablecoin);
		stablecoinContract.transferFrom(msg.sender, address(this), stableAmount);
	}

	function acceptWorkerPayment(uint256 bountyId) external override nonReentrant {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (bounty.status == BountyStatus.WorkerHasBeenPaid) {
			revert WorkerHasBeenPaid();
		}
		if (msg.sender != bounty.worker) {
			revert NotTheWorker();
		}

		uint128 workerNativePay = bounty.workerNativePay;
		uint128 workerStablePay = bounty.workerStablePay;

		bounty.status = BountyStatus.WorkerHasBeenPaid;
		bounty.setWorkerPayToZero();
		bounty.workerPaidAt = block.timestamp;

		emit WorkerPaymentAccepted(bountyId, workerNativePay, workerStablePay);

		sendNativeToken(bounty.nativeToken, bounty.worker, workerNativePay);
		IERC20 stablecoin = IERC20(bounty.stablecoin);
		stablecoin.transfer(bounty.worker, workerStablePay);
	}

	function acceptInvestorPayment(uint256 bountyId) external override nonReentrant {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (!bounty.isInvestmentOpportunityClosed(INVESTMENT_OPPORTUNITY_DURATION_PERCENTAGE_IN_BASIS_POINT)) {
			revert InvestmentOpportunityIsStillOpen();
		}
		if (investments[bountyId][msg.sender].length == 0) {
			revert NotAnInvestor();
		}

		// TODO: Max amount of investments to prevent large loops ? Only blocks the investor itself though. Or maybe allow interacting with 1 investment at a time or batches of them. Or maybe allow interacting with 1 investment at a time or batches of them. Or maybe allow interacting with 1 investment at a time or batches of them
		uint128 payment = 0;
		uint256 investmentOpportunityEndDate = bounty.workerPaidAt > 0
			? bounty.workerPaidAt
			: DeadlineUtils.getInvestmentOpportunityDeadline(
				bounty.creationDate,
				bounty.workerDeadline,
				INVESTMENT_OPPORTUNITY_DURATION_PERCENTAGE_IN_BASIS_POINT
			);
		for (uint256 i = 0; i < investments[bountyId][msg.sender].length; i++) {
			uint128 stableAmount = investments[bountyId][msg.sender][i].stableAmount;
			uint256 creationDate = investments[bountyId][msg.sender][i].creationDate;
			uint128 workerNativePayGoingToTheInvestor = bounty.status == BountyStatus.Completed
				? getNativePayFromStable(stableAmount, bounty.exchangeRate)
				: 0;
			uint128 daysInvested = DeadlineUtils.getDaysBeforeDate(creationDate, investmentOpportunityEndDate);
			payment +=
				workerNativePayGoingToTheInvestor +
				_calculateTotalYield(workerNativePayGoingToTheInvestor, bounty.dailyYieldPercentage, daysInvested);
		}
		delete investments[bountyId][msg.sender];

		emit InvestorPaymentAccepted(bountyId, payment);

		sendNativeToken(bounty.nativeToken, msg.sender, payment);
	}

	function sendNativeToken(
		address tokenAddress,
		address to,
		uint256 amount
	) private {
		if (tokenAddress != ETH_ADDRESS) {
			IERC20 token = IERC20(tokenAddress);
			token.transfer(to, amount);
		} else {
			payable(to).sendValue(amount);
		}
	}

	function markBountyAsCompleted(uint256 bountyId) external override {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}

		BountyMetadata storage bounty = bounties[bountyId - 1];

		if (msg.sender != bounty.recruiter) {
			revert NotRecruiter();
		}
		if (bounty.worker == address(0)) {
			revert WorkerCannotBeZero();
		}
		if (bounty.status != BountyStatus.Ongoing) {
			revert BountyIsNotOngoing();
		}
		if (bounty.workerDeadline < block.timestamp) {
			revert WorkerDeadlineExpired();
		}

		bounty.status = BountyStatus.Completed;

		emit BountyCompleted(bountyId);
	}

	// TODO: Write tests
	// TODO Fwoued: How do we prevent recruiters from cancelling bounties when the worker completed worker and get their money refunded ?
	function cancelBounty(uint256 bountyId) external override {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}

		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (msg.sender != bounty.recruiter) {
			revert NotRecruiter();
		}

		// get stable the recruiter has put on the bounty
		// get native token the recruiret has put on the bounty
		// refund that
		bounty.status = BountyStatus.Cancelled;
		bounty.setWorkerPayToZero();
		// TODO: Only take yield that investors do not win. How do we make that safe and performant gas-wise ?
		uint128 yieldPool = _calculateYieldPool(
			bounty.initialWorkerNativePay,
			bounty.dailyYieldPercentage,
			block.timestamp,
			bounty.workerDeadline
		);

		emit BountyCancelled(bountyId);

		sendNativeToken(bounty.nativeToken, bounty.recruiter, bounty.initialWorkerNativePay + yieldPool);
		IERC20 stablecoin = IERC20(bounty.stablecoin);
		stablecoin.transfer(bounty.recruiter, bounty.initialWorkerStablePay);
	}

	/////////////////
	// VIEW FUNCTIONS
	/////////////////

	function getBounty(uint256 bountyId) external view override returns (BountyMetadata memory) {
		return bounties[bountyId - 1];
	}

	function getAmountOfInvestments(uint256 bountyId) external view override returns (uint256) {
		return investments[bountyId][msg.sender].length;
	}

	function getInvestment(uint256 bountyId, uint256 investmentId)
		external
		view
		override
		returns (InvestmentMetadata memory)
	{
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		return investments[bountyId][msg.sender][investmentId - 1];
	}

	/////////////////
	// PURE FUNCTIONS
	/////////////////

	function calculateYieldPool(
		uint128 workerNativePay,
		uint128 dailyYieldPercentage,
		uint256 bountyCreationDate,
		uint256 workerDeadline
	) external pure override returns (uint128) {
		return _calculateYieldPool(workerNativePay, dailyYieldPercentage, bountyCreationDate, workerDeadline);
	}

	function _calculateYieldPool(
		uint128 workerNativePay,
		uint128 dailyYieldPercentage,
		uint256 bountyCreationDate,
		uint256 workerDeadline
	) private pure returns (uint128) {
		uint128 investmentOpportunityDays = DeadlineUtils.getDaysBeforeInvestmentOpportunityDeadline(
			bountyCreationDate,
			bountyCreationDate,
			workerDeadline,
			INVESTMENT_OPPORTUNITY_DURATION_PERCENTAGE_IN_BASIS_POINT
		);
		return _calculateTotalYield(workerNativePay, dailyYieldPercentage, investmentOpportunityDays);
	}

	function calculateTotalYield(
		uint128 initialValue,
		uint128 dailyYieldPercentage,
		uint128 daysBeforeInvestmentOpportunityCloses
	) external pure override returns (uint128) {
		return _calculateTotalYield(initialValue, dailyYieldPercentage, daysBeforeInvestmentOpportunityCloses);
	}

	// TODO: Dont we want it to compound ?
	function _calculateTotalYield(
		uint128 initialValue,
		uint128 dailyYieldPercentage,
		uint128 daysBeforeInvestmentOpportunityCloses
	) private pure returns (uint128) {
		return
			uint128(
				MathUtils.calculatePercentage(initialValue, dailyYieldPercentage) * daysBeforeInvestmentOpportunityCloses
			);
	}

	function getStableNeeded(uint128 nativePay, uint128 exchangeRate) private pure returns (uint128) {
		return nativePay * exchangeRate;
	}

	function getNativePayFromStable(uint128 stableAmount, uint128 exchangeRate) private pure returns (uint128) {
		return stableAmount / exchangeRate;
	}
}
