// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './DeadlineUtils.sol';

enum BountyStatus {
	Ongoing,
	Completed, // Worker can withdraw their pay,
	WorkerHasBeenPaid, // Worker has withdrawn their pair, ending the investment opportunity
	Cancelled // Investors can withdraw their investment
}

struct BountyMetadata {
	uint128 workerStablePay; // Amount of stablecoin to pay worker
	uint128 workerNativePay; // Amount of NT to pay worker
	uint96 exchangeRate; // Amount of NT 1 DAI can buy
	address stablecoin; // stable contract address
	address nativeToken; // NT contract address
	uint128 dailyYieldPercentage; // APR/365 in basis point, e.g 0.27% = 27
	address worker;
	address recruiter;
	BountyStatus status;
	uint256 workerDeadline; // In seconds since Unix Epoch
	uint128 initialWorkerStablePay;
	uint128 initialWorkerNativePay;
	uint256 creationDate;
}

library BountyUtils {
	function setWorkerPayToZero(BountyMetadata storage bounty) external {
		bounty.workerStablePay = 0;
		bounty.workerNativePay = 0;
	}

	function isInvestmentOpportunityClosed(BountyMetadata storage bounty, uint256 investmentOpportunityPercentage) external view returns (bool) {
		return
			bounty.status == BountyStatus.WorkerHasBeenPaid ||
			(bounty.status == BountyStatus.Completed &&
				block.timestamp >= DeadlineUtils.getInvestmentOpportunityDeadline(bounty.creationDate, bounty.workerDeadline, investmentOpportunityPercentage));
	}
}
