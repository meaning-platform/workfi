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
        bool isClosed; // Whether bounty has been paid out
        uint256 deadline; // In seconds since Unix Epoch
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

    /// Called by the worker to receive payment. Investors will receive their NT accordingly.
    function acceptPayment(uint256 bountyId) external;

    /// Closes an expired bounty.
    function closeBounty(uint256 bountyId) external;

    /////////////////
    // VIEW FUNCTIONS
    /////////////////

    /// Get user's current investment of a given bounty (in stablecoin)
    function getInvestment(uint256 bountyId) external view returns (uint128);

    /// Get information of a bounty.
    function getBounty(uint256 bountyId) external view returns (BountyMetadata memory);

    /// Get IDs of all bounties investor has invested in.
    function getInvestedBounties() external view returns (uint256[] memory);

    function getBountiesCreatedByRecruiter(address recruiter) external view returns (uint256[] memory);
}