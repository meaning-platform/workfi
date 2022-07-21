//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './Bounty.sol';

interface IWorkFi {

	struct InvestmentMetadata {
		uint128 stableAmount;
		uint128 nativeTokenPayment;
	}

	/////////////////
	// WRITE FUNCTIONS
	/////////////////

	/// Called by the recruiter to accept an address as a valid worker.
	function acceptWorker(uint256 bountyId, address worker) external;

	/// Called by recruiter in creation of a bounty.
	/// @return Id of created bounty
	function createBounty(
		uint128 workerStablePay, // Initial amount of stable coin
		uint128 workerNativePay, // Amount of native coin
		uint96 exchangeRate, // Amount of native token 1 DAI can buy
		address nativeToken, // Address of native token
		address stablecoin, // Address of stablecoin
		uint128 dailyYieldPercentage, // APR/365. Basis point, the first two integers are the decimals. E.g: 0,27%=27
		uint256 deadline // Deadline of bounty (in seconds after UNIX epoch)
	) external payable returns (uint256);

	/// Called by the investor to invest in bounty.
	function invest(uint256 bountyId, uint128 stableAmount) external;

	/// Called by the worker to receive payment. This also closes the investment opportunity.
	function acceptWorkerPayment(uint256 bountyId) external;

	/// Called by am investor to receive payment. Can only be called once the investment opportunity has been closed.
	function acceptInvestorPayment(uint256 bountyId) external;

	///  Marks the bounty as completed by the recruiter, unlocking withdrawal.
	function markBountyAsCompleted(uint256 bountyId) external;

	// Cancel the bounty, returning to everyone the tokens they invested
	function cancelBounty(uint256 bountyId) external;

    // Withdraw investments from a cancelled bounty
    function withdrawInvestments(uint256 bountyId) external;

	/////////////////
	// VIEW FUNCTIONS
	/////////////////

	/// Get information of a bounty.
	function getBounty(uint256 bountyId) external view returns (BountyMetadata memory);

	function getAmountOfInvestments(uint256 bountyId) external view returns (uint256);

	/// Gets an investment the sender has put in the bounty
	function getInvestment(uint256 bountyId, uint256 investmentId) external view returns (InvestmentMetadata memory);
}
