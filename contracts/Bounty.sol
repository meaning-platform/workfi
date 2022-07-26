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
	uint96 exchangeRate; // How much stable is required to buy 1 NT
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
	uint256 workerPaidAt; // 0 if not paid
}
