//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './IWorkFi.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Address.sol';

// TODO: Revert on all failed transfer or transferFrom!!!
contract WorkFi is IWorkFi, ReentrancyGuard, Ownable {
	using Address for address payable;

	BountyMetadata[] bounties;
	mapping(uint256 => mapping(address => uint256)) investments;

	mapping(address => bool) whitelistedStablecoins;

	address constant ETH_ADDRESS = address(0);

	event BountyCreated(uint256 indexed bountyId, address indexed recruiter);
	event WorkerAccepted(uint256 indexed bountyId, address indexed worker);
	event Invested(uint256 indexed bountyId, address indexed investor, uint256 amount);
	event StablecoinAddedToWhitelist(address indexed stablecoin);
	event StablecoinRemovedFromWhitelist(address indexed stablecoin);

	error BountyDoesNotExist();
	error WorkerCannotBeZero();
	error BountyIsCompleted();
	error BountyIsNotCompleted();
	error DeadlineExpired();
	error NotRecruiter();
	error WorkerCannotInvest();
	error RecruiterCannotInvest();
	error WorkerHasBeenPaid();
	error NotAnInvestorOrWorker();
	error AWorkerWasAlreadyAccepted();
	error ValueMustBeEqualToNativePayIfPayingWithEth();
	error ValueShouldBeZeroIfNotPayingWithEth();
	error NotAWhitelistedStablecoin();
	error MaxInvestmentExceeded(uint256 maxPossibleAmount);
	error TransferFailed();

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
		if (isDeadlineExpired(bountyId)) {
			revert DeadlineExpired();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (bounty.isCompleted) {
			revert BountyIsCompleted();
		}
		if (bounty.worker != address(0)) {
			revert AWorkerWasAlreadyAccepted();
		}

		bounty.worker = worker;
		emit WorkerAccepted(bountyId, worker);
	}

	function createBounty(
		uint128 stablePay,
		uint128 nativePay,
		uint96 exchangeRate,
		address nativeToken,
		address stablecoin,
		uint256 deadline
	) external payable override nonReentrant returns (uint256) {
		if (nativeToken == ETH_ADDRESS) {
			if (nativePay != msg.value) {
				revert ValueMustBeEqualToNativePayIfPayingWithEth();
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
			stablePay: stablePay,
			nativePay: nativePay,
			exchangeRate: exchangeRate,
			stablecoin: stablecoin,
			nativeToken: nativeToken,
			worker: address(0),
			recruiter: msg.sender,
			isCompleted: false,
			deadline: deadline,
			hasWorkerBeenPaid: false
		});

		bounties.push(bounty);

		emit BountyCreated(bounties.length, msg.sender);

		if (nativeToken != ETH_ADDRESS) {
			// TODO: Check if supports interface
			IERC20 token = IERC20(nativeToken);
			// TODO: Use Escrow or other Payment contract ? https://docs.openzeppelin.com/contracts/2.x/api/payment
			token.transferFrom(msg.sender, address(this), nativePay);
		}

		if (stablePay > 0) {
			IERC20 stablecoinContract = IERC20(bounty.stablecoin);
			stablecoinContract.transferFrom(msg.sender, address(this), stablePay);
		}

		return bounties.length;
	}

	// TODO: Calculate native token reduction from pay ? I think we dont want that since that calculatiuon is done on payment for workers / investors
	function invest(uint256 bountyId, uint128 stableAmount) external override {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		if (isDeadlineExpired(bountyId)) {
			revert DeadlineExpired();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (bounty.isCompleted) {
			revert BountyIsCompleted();
		}
		if (msg.sender == bounty.worker) {
			revert WorkerCannotInvest();
		}
		if (msg.sender == bounty.recruiter) {
			revert RecruiterCannotInvest();
		}
		uint256 maxPossibleInvestment = bounty.nativePay * bounty.exchangeRate;
		if (stableAmount > maxPossibleInvestment) {
			revert MaxInvestmentExceeded(maxPossibleInvestment);
		}

		// TODO: Reduce nativePay by the investor's share and put it ona n escrow account or something for them

		bounty.stablePay += stableAmount;
		investments[bountyId][msg.sender] += stableAmount;

		emit Invested(bountyId, msg.sender, stableAmount);
		// TODO: Use Escrow or other Payment contract ? https://docs.openzeppelin.com/contracts/2.x/api/payment
		// TODO: What happens if a stable gets removed from the whitelist while a task is using it as stable ?
		IERC20 stablecoinContract = IERC20(bounty.stablecoin);
		stablecoinContract.transferFrom(msg.sender, address(this), stableAmount);
	}

	function acceptPayment(uint256 bountyId) external override nonReentrant {
		// TODO: Investors shoudl withdraw separetely and we should keep track of who withdrew their payment (the worker, each investor)
		// TODO: Also make sure you cannot accept payment twice as an exploit to get more funds
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		BountyMetadata storage bounty = bounties[bountyId - 1];
		if (!bounty.isCompleted) {
			revert BountyIsNotCompleted();
		}
		if (msg.sender == bounty.worker) {
			if (bounty.hasWorkerBeenPaid) {
				revert WorkerHasBeenPaid();
			}
			// TODO: Pay worker in stable and I guess remaining NT (not investor base payment or APR) ? 
			// TODO: Carefull, dont loop through investors, otherwise this function can be made unusuable with a lot of investors
			bounty.hasWorkerBeenPaid = true;
		} else if (investments[bountyId][msg.sender] > 0) {
			uint256 investmentAmount = investments[bountyId][msg.sender];
			investments[bountyId][msg.sender] = 0;
			uint256 baseInvestorNtPayment = investmentAmount / bounty.exchangeRate;
			// TODO pay APR as well
			uint256 ntPayment = baseInvestorNtPayment;
			if (bounty.nativeToken != ETH_ADDRESS) {
				IERC20 token = IERC20(bounty.nativeToken);
				if (!token.transfer(msg.sender, ntPayment)) {
					revert TransferFailed();
				}
			} else {
				payable(msg.sender).sendValue(ntPayment);
			}
		} else {
			revert NotAnInvestorOrWorker();
		}
	}

	function markBountyAsCompleted(uint256 bountyId) external override {
		// TODO: Security checks
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}

		BountyMetadata storage bounty = bounties[bountyId - 1];

		if (bounty.isCompleted) {
			revert BountyIsCompleted();
		}
		if (msg.sender != bounty.recruiter) {
			revert NotRecruiter();
		}

		bounty.isCompleted = true;
	}

	function closeBounty(uint256 bountyId) external override {
		// TODO: Refund investments
		// TODO: Refund recruiter
		// TODO: Remove bounty from storage
	}

	/////////////////
	// VIEW FUNCTIONS
	/////////////////

	function isDeadlineExpired(uint256 bountyId) private view returns (bool) {
		// TODO: Double check if ok to check it like this
		return bounties[bountyId - 1].deadline < block.timestamp;
	}

	function getBounty(uint256 bountyId) external view override returns (BountyMetadata memory) {
		return bounties[bountyId - 1];
	}

	function getInvestment(uint256 bountyId) external view override returns (uint256) {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		return investments[bountyId][msg.sender];
	}
}
