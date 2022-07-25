//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './Bounty.sol';

interface IWorkFi {
	struct InvestmentMetadata {
		uint128 stableAmount;
		uint256 creationDate;
	}

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
	error InvestmentOpportunityIsStillOpen();
	error InvestmentOpportunityIsClosed();
	error WorkerDeadlineExpired();
	error BountyIsNotOngoing();
	error BountyIsNotCancelled();

	/////////////////
	// WRITE FUNCTIONS
	/////////////////

	/// Called by the owner to add a stablecoin to the whitelist. Only whitelisted stablecoins can be used in bounties.
	function addStablecoinToWhitelist(address stablecoin) external;

	/// Called by the owner to remove a stablecoin to the whitelist. Only whitelisted stablecoins can be used in bounties.
	function removeStablecoinFromWhitelist(address stablecoin) external;

	/// Called by the recruiter to accept an address as a valid worker.
	function acceptWorker(uint256 bountyId, address worker) external;

	/// Called by recruiter in creation of a bounty.
	/// @param workerStablePay amount of stable coin
	/// @param workerNativePay Amount of native coin
	/// @param exchangeRate Amount of native token 1 DAI can buy
	/// @param nativeToken Address of native token
	/// @param stablecoin Address of stablecoin
	/// @param dailyYieldPercentage APR/365. Basis point, the first two integers are the decimals. E.g: 0,27%=27, 30%=3000
	/// @param workerDeadline When the worker should have completed thetask (in seconds after UNIX epoch)
	/// @return Id of created bounty
	function createBounty(
		uint128 workerStablePay,
		uint128 workerNativePay,
		uint96 exchangeRate,
		address nativeToken,
		address stablecoin,
		uint128 dailyYieldPercentage,
		uint256 workerDeadline
	) external payable returns (uint256);

	/// Called by the investor to invest in bounty.
	function invest(uint256 bountyId, uint128 stableAmount) external;

	/// Called by the worker to receive payment. This also closes the investment opportunity.
	function acceptWorkerPayment(uint256 bountyId) external;

	/// Called by am investor to receive payment. 
	/// Can only be called once the investment opportunity has been closed.
	/// An investment opportunity is closed when one of the following happened:
	/// - the worker has been paid
	/// - the investment deadline has passed
	/// - the bounty has been cancelled
	function acceptInvestorPayment(uint256 bountyId) external;

	///  Marks the bounty as completed by the recruiter, unlocking withdrawal.
	function markBountyAsCompleted(uint256 bountyId) external;

	// Cancel the bounty, returning to everyone the tokens they invested
	function cancelBounty(uint256 bountyId) external;

	/////////////////
	// VIEW FUNCTIONS
	/////////////////

	/// Get information of a bounty.
	function getBounty(uint256 bountyId) external view returns (BountyMetadata memory);

	function getAmountOfInvestments(uint256 bountyId) external view returns (uint256);

	/// Gets an investment the sender has put in the bounty
	/// @param bountyId the id of the bounty
	/// @param investmentId the id of the investment, starting at 1, in the same order as they were created for this bounty.
	function getInvestment(uint256 bountyId, uint256 investmentId) external view returns (InvestmentMetadata memory);

	// TODO: double check with Fwoued: is the yield pool calculated on the total bounty amount or just what is in native token ?
	/// Calculates the yield pool in native token
	/// @param workerNativePay the amount of native tokens initially on the bounty
	/// @param dailyYieldPercentage: in basis point as an integer. E.g 30%=3000
	/// @param bountyCreationDate the block timestamp when the bounty was created
	/// @param workerDeadline When the worker should have completed the task (in seconds after UNIX epoch)
	function calculateYieldPool(
		uint128 workerNativePay,
		uint128 dailyYieldPercentage,
		uint256 bountyCreationDate,
		uint256 workerDeadline
	) external pure returns (uint128);

	/// Calculates the total yield earned on an investment
	/// @param initialValue the value we started with
	/// @param dailyYieldPercentage: in basis point as an integer. E.g 30%=3000
	/// @param daysBeforeInvestmentOpportunityCloses how many days before it is no longer possible to invest
	function calculateTotalYield(
		uint128 initialValue,
		uint128 dailyYieldPercentage,
		uint128 daysBeforeInvestmentOpportunityCloses
	) external pure returns (uint128);
}
