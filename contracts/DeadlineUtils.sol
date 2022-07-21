// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './MathUtils.sol';

library DeadlineUtils {
	error WorkerDeadlineMustBeAfterCreationDate();
	error DateIsInThePast();

	function revertIfWorkerDeadlineIsInvalid(uint256 bountyCreationDate, uint256 workerDeadline) public pure {
		if (workerDeadline <= bountyCreationDate) {
			revert WorkerDeadlineMustBeAfterCreationDate();
		}
	}

	/// Calculates the deadline for the investment opportunity
	/// @param bountyCreationDate the time the bounty was created
	/// @param workerDeadline the deadline where the worker should be completed
	/// @return investmentOpportunityPercentage added to to the workerDeadline to calculate the investment opportunity deadline
	function getInvestmentOpportunityDeadline(
		uint256 bountyCreationDate,
		uint256 workerDeadline,
		uint256 investmentOpportunityPercentage
	) public pure returns (uint256) {
		revertIfWorkerDeadlineIsInvalid(bountyCreationDate, workerDeadline);

		uint256 duration = workerDeadline - bountyCreationDate;
		uint256 additionalDuration = MathUtils.calculatePercentage(duration, investmentOpportunityPercentage);
		uint256 investmentOpportunityDuration = duration + additionalDuration;

		return bountyCreationDate + investmentOpportunityDuration;
	}

	function getDaysBeforeDate(uint256 nowAsUnixSeconds, uint256 dateAsUnixSeconds) public pure returns (uint128) {
		if (dateAsUnixSeconds < nowAsUnixSeconds) {
			revert DateIsInThePast();
		}
		return uint128((dateAsUnixSeconds - nowAsUnixSeconds) / 1 days);
	}

	function getDaysBeforeInvestmentOpportunityDeadline(
		uint256 bountyCreationDate,
		uint256 nowAsUnixSeconds,
		uint256 workerDeadline,
		uint256 investmentOpportunityPercentage
	) external pure returns (uint128) {
		uint256 investmentOpportunityDeadline = getInvestmentOpportunityDeadline(
			bountyCreationDate,
			workerDeadline,
			investmentOpportunityPercentage
		);
		return getDaysBeforeDate(nowAsUnixSeconds, investmentOpportunityDeadline);
	}

	function isWorkerDeadlineExpired(uint256 workerDeadline) external view returns (bool) {
		// TODO: Double check if ok to check it like this
		return workerDeadline < block.timestamp;
	}
}
