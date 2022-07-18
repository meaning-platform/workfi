import { expect } from "chai";
import { BigNumberish, Contract, Signer } from "ethers";
import * as hre from "hardhat";
import { deployWorkFi } from "../scripts/utils";
import { ERC20, MockERC20, WorkFi } from "../typechain-types";



describe("WorkFi", function () {
   const stablePay = hre.ethers.utils.parseEther('0');
   const nativePay = hre.ethers.utils.parseEther('1');
   const exchangeRate = hre.ethers.utils.parseEther('2');

   it('Creates a bounty when calling createBounty with enough ERC20', async () => {
      const { stablecoin,
         nativeToken,
         workFi,
         deadline,
         contractDeployerAndRecruiter,
         recruiterAddress,
         investor,
         investorAddress,
         workerAddresses } = await prepare();
      const nativeBalanceBefore = await nativeToken.balanceOf(recruiterAddress);

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         deadline
      )).wait();

      const nativeBalanceAfter = await nativeToken.balanceOf(recruiterAddress);
      expect(nativeBalanceAfter).to.eq(nativeBalanceBefore.sub(nativePay));
      const bountyId = 1;
      const filter = workFi.filters.BountyCreated(bountyId, recruiterAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.stablePay).to.eq(stablePay);
      expect(bounty.nativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(hre.ethers.constants.AddressZero);
      expect(bounty.recruiter).to.eq(recruiterAddress);
      expect(bounty.isCompleted).to.be.false;
      expect(bounty.deadline).to.eq(deadline);
      expect(bounty.hasWorkerBeenPaid).to.be.false;
   });

   it('accepts a worker when calling acceptWorker if there is no worker yet. Only the worker address is changed.', async () => {
      const { stablecoin,
         nativeToken,
         workFi,
         deadline,
         contractDeployerAndRecruiter,
         recruiterAddress,
         investor,
         investorAddress,
         workerAddresses } = await prepare();

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         deadline
      )).wait();

      await (await workFi.acceptWorker(1, workerAddresses[0])).wait();

      const bountyId = 1;
      const filter = workFi.filters.WorkerAccepted(bountyId, workerAddresses[0]);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.stablePay).to.eq(stablePay);
      expect(bounty.nativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(workerAddresses[0]);
      expect(bounty.recruiter).to.eq(recruiterAddress);
      expect(bounty.isCompleted).to.be.false;
      expect(bounty.deadline).to.eq(deadline);
      expect(bounty.hasWorkerBeenPaid).to.be.false;
   });

   it('cannot change a worker if one has already been accepted', async () => {
      const { stablecoin,
         nativeToken,
         workFi,
         deadline,
         contractDeployerAndRecruiter,
         recruiterAddress,
         investor,
         investorAddress,
         workerAddresses } = await prepare();

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         deadline
      )).wait();

      await (await workFi.acceptWorker(1, workerAddresses[0])).wait();
      await expect(workFi.acceptWorker(1, workerAddresses[1])).to.be.revertedWith('AWorkerWasAlreadyAccepted()');
   });


   it('Creates an investment, transferring the stablecoin to the contract when calling invest', async () => {
      const { stablecoin,
         nativeToken,
         workFi,
         deadline,
         contractDeployerAndRecruiter,
         recruiterAddress,
         investor,
         investorAddress,
         workerAddresses } = await prepare();   
      const stableInvestment = 100;
      await stablecoin.transfer(investorAddress, stableInvestment); // transfer some stable to the investor since it doesn't have any for now
      await stablecoin.connect(investor).approve(workFi.address, stableInvestment);
      const investorStableBalanceBefore = await stablecoin.balanceOf(investorAddress);
      const workFiStableBalanceBefore = await stablecoin.balanceOf(workFi.address);

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         deadline
      )).wait();

      const workFiWithInvestorSigner = workFi.connect(investor);

      await (await workFiWithInvestorSigner.invest(1, stableInvestment)).wait();

      const bountyId = 1;

      const filter = workFi.filters.Invested(1, investorAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(bountyId);
      const [event] = events;
      expect(event.args.amount).to.eq(stableInvestment);
      const stableBalanceAfter = await stablecoin.balanceOf(investorAddress);
      expect(stableBalanceAfter).to.eq(investorStableBalanceBefore.sub(stableInvestment));
      const workFiStableBalanceAfter = await stablecoin.balanceOf(workFi.address);
      expect(workFiStableBalanceAfter).to.eq(workFiStableBalanceBefore.add(stableInvestment));
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.stablePay).to.eq(stablePay.add(stableInvestment));
      expect(bounty.nativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(hre.ethers.constants.AddressZero);
      expect(bounty.recruiter).to.eq(recruiterAddress);
      expect(bounty.isCompleted).to.be.false;
      expect(bounty.deadline).to.eq(deadline);
      expect(bounty.hasWorkerBeenPaid).to.be.false;

      const investment = await workFiWithInvestorSigner.getInvestment(bountyId);
      expect(investment).to.eq(stableInvestment);
   });

  
});


async function prepare() {
   const MockErc20 = await hre.ethers.getContractFactory('MockERC20');
   const nativeToken = await MockErc20.deploy('NativeToken', 'NT');
   await nativeToken.deployed();
   const stablecoin = await MockErc20.deploy('StableCoin', 'SC');
   await stablecoin.deployed();

   const workFi = await deployWorkFi();
   await approveForManyTokens([nativeToken, stablecoin], workFi.address, hre.ethers.utils.parseEther('100'));
   await (await workFi.addStablecoinToWhitelist(stablecoin.address)).wait();
   const deadline = await createDeadline(hours(1));
   const signers = await hre.ethers.getSigners();
   const contractDeployerAndRecruiter = signers[0];
   const recruiterAddress = await contractDeployerAndRecruiter.getAddress();
   const investor = signers[1];
   const investorAddress = await investor.getAddress();
   const workerAddresses = await Promise.all(signers.slice(2).map(s => s.getAddress()));

   return {
      nativeToken,
      stablecoin,
      workFi,
      deadline,
      contractDeployerAndRecruiter,
      recruiterAddress,
      investor,
      investorAddress,
      workerAddresses
   }
}

async function approveForManyTokens(tokenContracts: ERC20[], address: string, amount: BigNumberish): Promise<void> {
   for (let i = 0; i < tokenContracts.length; i++) {
      await (await tokenContracts[i].approve(address, amount)).wait();
   }
}

function seconds(amount: number): number {
   return amount * 1e3;
}

function minutes(amount: number): number {
   return seconds(60) * amount;
}

function hours(amount: number): number {
   return minutes(60) * amount;
}

async function createDeadline(msFromCurrentBlock: number): Promise<number> {
   const blockNumber = await hre.ethers.provider.getBlockNumber();
   const block = await hre.ethers.provider.getBlock(blockNumber);
   return block.timestamp + hours(1);
}