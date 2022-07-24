// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './DeadlineUtils.sol';
import './Bounty.sol';

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
