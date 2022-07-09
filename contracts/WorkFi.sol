//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./IWorkFi.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// TODO: Error checking
// TODO: events
contract WorkFi is IWorkFi {

    BountyMetadata[] bounties;
    mapping(address => uint256[]) bountiesByRecruiter; 
    mapping(address => uint256[]) bountiesByInvestor;
    mapping(address => mapping(uint256 => uint128)) investmentsByBountyByInvestor;

    function acceptWorker(uint256 bountyId, address worker) external override {
        bounties[bountyId-1].worker = worker;
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
            isClosed: false,
            deadline: deadline
        });
        bounties.push(bounty);
        bountiesByRecruiter[bounty.recruiter].push(bounties.length);
        return bounties.length;
    }

    function invest(uint256 bountyId, uint128 stableAmount) external override {
        bounties[bountyId-1].stablePay += stableAmount;
        investmentsByBountyByInvestor[msg.sender][bountyId] += stableAmount;
        
        for (uint256 i = 0; i < bountiesByInvestor[msg.sender].length; i++) {
            if (bountiesByInvestor[msg.sender][i] == bountyId) {
                return; // bountyId already there, we don't need to add it again
            }
        }
        bountiesByInvestor[msg.sender].push(bountyId);

        // TODO: Transfer stable securely to contract / escrow
    }

    function acceptPayment(uint256 bountyId) external override {
        // TODO
        // TODO: Also make sure you cannot accept payment twice as an exploit to get more funds
    }

    function closeBounty(uint256 bountyId) external override { 
        bounties[bountyId-1].isClosed = true;
    }

    /////////////////
    // VIEW FUNCTIONS
    /////////////////

    function getInvestment(uint256 bountyId) external view override returns (uint128) { 
        return investmentsByBountyByInvestor[msg.sender][bountyId];
     }

    function getBounty(uint256 bountyId) external view override returns (BountyMetadata memory) {
        return bounties[bountyId-1];
    }

    function getBountiesCreatedByRecruiter(address recruiter) external view override returns (uint256[] memory) {
        return bountiesByRecruiter[recruiter];
    }

    function getInvestedBounties() external view override returns (uint256[] memory) {
        return bountiesByInvestor[msg.sender];
    }

}