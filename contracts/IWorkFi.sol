//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IWorkFi {

    struct BountyMetadata {

        uint128 stablePay; // Amount of stablecoin to pay worker
        uint128 nativePay; // Amount of NT to pay worker
        uint96 exchangeRate; // Amount of NT 1 DAI can buy
        address nativeToken; // NT contract address

        address worker;
        address recruiter;
        bool isCompleted; // Whether bounty is considered completed by the recruiter, unlocking withdrawal.
        uint256 deadline; // In seconds since Unix Epoch
        bool hasWorkerBeenPaid;
        
        // TODO: Apr and calculate apr pool for investors and transfer it as well
    }

    /////////////////
    // WRITE FUNCTIONS
    /////////////////

    /// Called by the recruiter to accept an address as a valid worker.
    function acceptWorker(uint256 bountyId, address worker) external;

    /// Called by recruiter in creation of a bounty.
    /// @return Id of created bounty 
    function createBounty(
        uint128 stablePay, // Initial amount of stable coin
        uint128 nativePay, // Amount of native coin
        uint96 exchangeRate, // Amount of native token 1 DAI can buy
        address nativeToken, // Address of native token
        uint256 deadline // Deadline of bounty (in seconds after UNIX epoch)
    ) external returns (uint256);

    /// Called by the investor to invest in bounty.
    function invest(uint256 bountyId, uint128 stableAmount) external;

    // TODO: Would be better for each worker and investor to withdraw individually, especially for security reasons if an investor address would be a contract
    /// Called by the worker to receive payment. Investors will receive their NT accordingly.
    function acceptPayment(uint256 bountyId) external;

    ///  Marks the bounty as completed by the recruiter, unlocking withdrawal.
    function markBountyAsCompleted(uint256 bountyId) external;

    /////////////////
    // VIEW FUNCTIONS
    /////////////////

    /// Get information of a bounty.
    function getBounty(uint256 bountyId) external view returns (BountyMetadata memory);

    /// Gets the investment the sender has put in the bounty
    function getInvestment(uint256 bountyId) external view returns(uint256);
}