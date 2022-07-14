//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import './IWorkFi.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// TODO: Error checking
// TODO: events
contract WorkFi is IWorkFi {
	BountyMetadata[] bounties;
	mapping(uint256 => mapping(address => uint256)) investments;

	IERC20 stablecoinContract;

	event BountyCreated(uint256 indexed bountyId, address indexed recruiter);
	event WorkerAccepted(uint256 indexed bountyId, address indexed worker);
	event Invested(uint256 indexed bountyId, address indexed investor, uint256 amount);

	error TokenAddressMissing();
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

	// TODO: accept different stables in whitelist
	constructor(address _stablecoin) {
		stablecoinContract = IERC20(_stablecoin);
	}

	function acceptWorker(uint256 bountyId, address worker) external override {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		if (worker == address(0)) {
			revert WorkerCannotBeZero();
		}
		if (bounties[bountyId - 1].isCompleted) {
			revert BountyIsCompleted();
		}
		if (isDeadlineExpired(bountyId)) {
			revert DeadlineExpired();
		}

		// TODO: Do we allow changing worker mid-task ?
		bounties[bountyId - 1].worker = worker;
		emit WorkerAccepted(bountyId, worker);
	}

	function createBounty(
		uint128 stablePay,
		uint128 nativePay,
		uint96 exchangeRate,
		address nativeToken,
		uint256 deadline
	) external override returns (uint256) {
		BountyMetadata memory bounty = BountyMetadata({
			stablePay: stablePay,
			nativePay: nativePay,
			exchangeRate: exchangeRate,
			nativeToken: nativeToken,
			worker: address(0),
			recruiter: msg.sender,
			isCompleted: false,
			deadline: deadline,
            hasWorkerBeenPaid: false
		});

		bounties.push(bounty);

		emit BountyCreated(bounties.length, msg.sender);

		// TODO: Do we allow using no erc20 ?
		if (nativeToken != address(0)) {
			if (nativePay == 0) {
				revert TokenAddressMissing();
			}
			IERC20 token = IERC20(nativeToken);
			// TODO: Use Escrow or other Payment contract ? https://docs.openzeppelin.com/contracts/2.x/api/payment
			token.transferFrom(msg.sender, address(this), nativePay);
		}

		if (stablePay > 0) {
			stablecoinContract.transferFrom(msg.sender, address(this), stablePay);
		}

		return bounties.length;
	}

	// TODO: Investing more than what the bounty covers ? We dont allow that don't we ?
	// TODO: Calculate native token reduction from pay ? I think we dont want that since that calculatiuon is done on payment for workers / investors
	function invest(uint256 bountyId, uint128 stableAmount) external override {
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		if (bounties[bountyId - 1].isCompleted) {
			revert BountyIsCompleted();
		}
		if (isDeadlineExpired(bountyId)) {
			revert DeadlineExpired();
		}
        if (msg.sender == bounties[bountyId-1].worker) {
            revert WorkerCannotInvest();
        }
        if (msg.sender == bounties[bountyId-1].recruiter) {
            revert RecruiterCannotInvest();
        }

		bounties[bountyId - 1].stablePay += stableAmount;
		investments[bountyId][msg.sender] += stableAmount;

		emit Invested(bountyId, msg.sender, stableAmount);
		// TODO: Use Escrow or other Payment contract ? https://docs.openzeppelin.com/contracts/2.x/api/payment
		stablecoinContract.transferFrom(msg.sender, address(this), stableAmount);
	}

	function acceptPayment(uint256 bountyId) external override {
		// TODO: Investors shoudl withdraw separetely and we should keep track of who withdrew their payment (the worker, each investor)
		// TODO: Also make sure you cannot accept payment twice as an exploit to get more funds
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
        BountyMetadata storage bounty = bounties[bountyId-1];
		if (!bounty.isCompleted) {
			revert BountyIsNotCompleted();
		}
        if (msg.sender == bounty.worker) {
            if (bounty.hasWorkerBeenPaid) {
                revert WorkerHasBeenPaid();
            }
            // TODO: Pay worker in stable and I guess NT ?
        } else if (investments[bountyId][msg.sender] > 0) {
            uint256 investmentAmount = investments[bountyId][msg.sender];
            investments[bountyId][msg.sender] = 0;
            // TODO calculate investor NT, including share from APR pool, the pay the investor
        } else {
            revert NotAnInvestorOrWorker();
        }
	}

	function markBountyAsCompleted(uint256 bountyId) external override {
		// TODO: Security checks
		if (bountyId > bounties.length) {
			revert BountyDoesNotExist();
		}
		if (bounties[bountyId - 1].isCompleted) {
			revert BountyIsCompleted();
		}
        if (msg.sender != bounties[bountyId-1].recruiter) {
            revert NotRecruiter();
        }

		bounties[bountyId - 1].isCompleted = true;
	}

	function isDeadlineExpired(uint256 bountyId) private view returns (bool) {
		// TODO: Double check if ok to check it like this
		return bounties[bountyId - 1].deadline < block.timestamp;
	}

	/////////////////
	// VIEW FUNCTIONS
	/////////////////

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
