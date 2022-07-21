//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './IWorkFi.sol';
import './Bounty.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Address.sol';

// TODO: What ifa  worker has not been found, how tdo investors recover their funds and recruiter doenst loose theirs ?
contract WorkFi is IWorkFi, ReentrancyGuard, Ownable {
	using Address for address payable;
	using BountyUtils for BountyMetadata;

	BountyMetadata[] bounties;
	mapping(uint256 => mapping(address => InvestmentMetadata[])) investments;

	mapping(address => bool) whitelistedStablecoins;

	address constant ETH_ADDRESS = address(0);

	event BountyCreated(uint256 indexed bountyId, address indexed recruiter);
	event WorkerAccepted(uint256 indexed bountyId, address indexed worker);
	event Invested(uint256 indexed bountyId, address indexed investor, uint128 amount);
	event StablecoinAddedToWhitelist(address indexed stablecoin);
	event StablecoinRemovedFromWhitelist(address indexed stablecoin);
	event InvestmentsWithdrawn(uint256 indexed bountyId);
	event BountyCancelled(uint256 indexed bountyId);
	event BountyCompleted(uint256 indexed bountyId);
	event InvestorPaymentAccepted(uint256 indexed bountyId, uint128 payment);
	event WorkerPaymentAccepted(uint256 indexed bountyId, uint128 nativePay, uint128 stablePay);

	error BountyDoesNotExist();
	error WorkerCannotBeZero();
	error NotRecruiter();
	error WorkerCannotInvest();
	error RecruiterCannotInvest();
	error WorkerHasBeenPaid();
	error NotTheWorker();
	error NotAnInvestor();
	error AWorkerWasAlreadyAccepted();
	error ThisAmountOfEthIsRequired(uint128 required);
	error ValueShouldBeZeroIfNotPayingWithEth();
	error NotAWhitelistedStablecoin();
	error MaxInvestmentExceeded(uint128 maxPossibleAmount);
	error DateIsInThePast();
	error InvestmentOpportunityIsStillOpen();
	error InvestmentOpportunityIsClosed();
	error WorkerDeadlineExpired();
	error BountyIsNotOngoing();
	error BountyIsNotCancelled();

	function addStablecoinToWhitelist(address stablecoin) external onlyOwner {
		whitelistedStablecoins[stablecoin] = true;
		emit StablecoinAddedToWhitelist(stablecoin);
	}

	function removeStablecoinFromWhitelist(address stablecoin) external onlyOwner {
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
		if (isWorkerDeadlineExpired(bountyId)) {
			revert WorkerDeadlineExpired();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
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
		if (nativeToken == ETH_ADDRESS) {
			if (workerNativePay != msg.value) {
				uint128 yieldPool = calculateYieldPool(workerNativePay, dailyYieldPercentage, block.timestamp, workerDeadline);
				revert ThisAmountOfEthIsRequired(workerNativePay + yieldPool);
			}
		} else {
			if (msg.value > 0) {
				revert ValueShouldBeZeroIfNotPayingWithEth();
			}
		}

		if (!whitelistedStablecoins[stablecoin]) {
			revert NotAWhitelistedStablecoin();
		}

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
			workerDeadline: workerDeadline
		});

		bounties.push(bounty);

		emit BountyCreated(bounties.length, msg.sender);

		if (nativeToken != ETH_ADDRESS) {
			// TODO: Check if supports interface
			IERC20 token = IERC20(nativeToken);
			// TODO: Use Escrow or other Payment contract ? https://docs.openzeppelin.com/contracts/2.x/api/payment
			token.transferFrom(msg.sender, address(this), workerNativePay);
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
		if (isInvestmentOpportunityClosed(bountyId)) {
			revert InvestmentOpportunityIsClosed();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (msg.sender == bounty.worker) {
			revert WorkerCannotInvest();
		}
		if (msg.sender == bounty.recruiter) {
			revert RecruiterCannotInvest();
		}
		uint128 maxPossibleInvestment = bounty.workerNativePay / bounty.exchangeRate;
		if (stableAmount > maxPossibleInvestment) {
			revert MaxInvestmentExceeded(maxPossibleInvestment);
		}

		uint128 workerNativePayGoingToTheInvestor = stableAmount * bounty.exchangeRate;
		bounty.workerNativePay -= workerNativePayGoingToTheInvestor;
		bounty.workerStablePay += stableAmount;

		investments[bountyId][msg.sender].push(
			InvestmentMetadata({
				stableAmount: stableAmount,
				nativeTokenPayment: workerNativePayGoingToTheInvestor +
					calculateTotalYield(
						stableAmount,
						bounty.dailyYieldPercentage,
						getDaysBeforeDate(block.timestamp, getInvestorDeadline(bounty.workerDeadline))
					)
			})
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
		if (!isInvestmentOpportunityClosed(bountyId)) {
			revert InvestmentOpportunityIsStillOpen();
		}
		if (investments[bountyId][msg.sender].length == 0) {
			revert NotAnInvestor();
		}

		// TODO: Max amount of investments to prevent large loops ? Only blocks the investor itself though
		uint128 payment = 0;
		for (uint256 i = 0; i < investments[bountyId][msg.sender].length; i++) {
			payment += investments[bountyId][msg.sender][i].reward;
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

		bounty.status = BountyStatus.Completed;
		
		emit BountyCompleted(bountyId);
	}

	function cancelBounty(uint256 bountyId) external override {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}

		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (msg.sender != bounty.recruiter) {
			revert NotRecruiter();
		}
		if (bounty.status != BountyStatus.Ongoing) {
			revert BountyIsNotOngoing();
		}

		// get stable the recruiter has put on the bounty
		// get native token the recruiret has put on the bounty
		// refund that
		bounty.status = BountyStatus.Cancelled;
		bounty.setWorkerPayToZero();

		uint128 yieldPool = calculateYieldPool(
			bounty.initialWorkerNativePay,
			bounty.dailyYieldPercentage,
			block.timestamp,
			bounty.workerDeadline
		);

		emit BountyCancelled(bountyId);

		sendNativeToken(bounty.nativeToken + yieldPool, bounty.recruiter, bounty.initialWorkerNativePay);
		IERC20 stablecoin = IERC20(bounty.stablecoin);
		stablecoin.transfer(bounty.recruiter, bounty.initialWorkerStablePay);
	}

	function withdrawInvestments(uint256 bountyId) external override {
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (bounty.status != BountyStatus.Cancelled) {
			revert BountyIsNotCancelled();
		}
		if (investments[bountyId][msg.sender].length == 0) {
			revert NotAnInvestor();
		}

		// TODO: Max amount of investments to prevent large loops ? Only blocks the investor itself though
		uint128 stableInvestment = 0;
		for (uint256 i = 0; i < investments[bountyId][msg.sender].length; i++) {
			stableInvestment += investments[bountyId][msg.sender][i].stableAmount;
		}
		delete investments[bountyId][msg.sender];

		emit InvestmentsWithdrawn(bountyId);

		IERC20 stablecoinContract = IERC20(bounty.stablecoin);
		stablecoinContract.transfer(msg.sender, stableInvestment);
	}

	/////////////////
	// VIEW FUNCTIONS
	/////////////////

	function isWorkerDeadlineExpired(uint256 bountyId) private view returns (bool) {
		// TODO: Double check if ok to check it like this
		return bounties[bountyId - 1].deadline < block.timestamp;
	}

	function getBounty(uint256 bountyId) external view override returns (BountyMetadata memory) {
		return bounties[bountyId - 1];
	}

	function getAmountOfInvestments(uint256 bountyId) external view returns (uint256) {
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
		return investments[bountyId][msg.sender][investmentId];
	}

	/////////////////
	// PURE FUNCTIONS
	/////////////////

	function getDaysBeforeDate(uint256 nowAsUnixSeconds, uint256 dateAsUnixSeconds) public pure returns (uint128) {
		if (dateAsUnixSeconds < nowAsUnixSeconds) {
			revert DateIsInThePast();
		}
		return uint128((dateAsUnixSeconds - nowAsUnixSeconds) / 1 days);
	}

	function calculateYieldPool(
		uint128 workerNativePay,
		uint128 dailyYieldPercentage,
		uint256 bountyCreationDate,
		uint256 workerDeadline
	) public pure returns (uint128) {
		// TODO
		uint128 investmentOpportunityDays = getDaysBeforeDate(bountyCreationDate, getInvestorDeadline(workerDeadline));
	}

	function calculateTotalYield(
		uint128 stableAmount,
		uint128 dailyYieldPercentage,
		uint128 daysBeforeInvestmentOpportunityCloses
	) private pure returns (uint128) {
		return calculatePercentage(stableAmount, dailyYieldPercentage) * daysBeforeInvestmentOpportunityCloses;
	}

	function calculatePercentage(uint128 value, uint128 percentage) private pure returns (uint128) {
		return (value * percentage) / 10000;
	}
}
