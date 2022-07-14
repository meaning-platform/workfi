import { expect } from "chai";
import * as hre from "hardhat";

function seconds(amount: number): number {
   return amount * 1e3;
}

function minutes(amount: number): number {
   return seconds(60) * amount;
}

function hours(amount: number): number {
   return minutes(60) * amount;
}

describe("WorkFi", function () {

   it('Creates a bounty when calling createBounty with enough ERC20', async () => {
      const MockErc20 = await hre.ethers.getContractFactory('MockERC20');
      const nativeToken = await MockErc20.deploy('NativeToken', 'NT');
      await nativeToken.deployed();
      const stablecoin = await MockErc20.deploy('StableCoin', 'SC');
      await stablecoin.deployed();
      const WorkFi = await hre.ethers.getContractFactory('WorkFi');
      const workFi = await WorkFi.deploy(stablecoin.address);
      await (await nativeToken.approve(workFi.address, hre.ethers.utils.parseEther('100'))).wait();
      const stablePay = hre.ethers.utils.parseEther('0');
      const nativePay = hre.ethers.utils.parseEther('1');
      const exchangeRate = hre.ethers.utils.parseEther('2');
      const blockNumber = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNumber);
      const deadline = block.timestamp + hours(1);
      const [signer] = await hre.ethers.getSigners();
      const recruiterAddress = await signer.getAddress();
      const nativeBalanceBefore = await nativeToken.balanceOf(recruiterAddress);

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
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
      const MockErc20 = await hre.ethers.getContractFactory('MockERC20');
      const nativeToken = await MockErc20.deploy('NativeToken', 'NT');
      await nativeToken.deployed();
      const stablecoin = await MockErc20.deploy('StableCoin', 'SC');
      await stablecoin.deployed();
      const WorkFi = await hre.ethers.getContractFactory('WorkFi');
      const workFi = await WorkFi.deploy(stablecoin.address);
      await (await nativeToken.approve(workFi.address, hre.ethers.utils.parseEther('100'))).wait();
      const stablePay = hre.ethers.utils.parseEther('0');
      const nativePay = hre.ethers.utils.parseEther('1');
      const exchangeRate = hre.ethers.utils.parseEther('2');
      const blockNumber = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNumber);
      const deadline = block.timestamp + hours(1);
      const [recruiterAddress, workerAddress] = await Promise.all((await hre.ethers.getSigners()).map(s => s.getAddress()));

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         deadline
      )).wait();

      await (await workFi.acceptWorker(1, workerAddress)).wait();

      const bountyId = 1;
      const filter = workFi.filters.WorkerAccepted(bountyId, workerAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.stablePay).to.eq(stablePay);
      expect(bounty.nativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(workerAddress); 
      expect(bounty.recruiter).to.eq(recruiterAddress);
      expect(bounty.isCompleted).to.be.false;
      expect(bounty.deadline).to.eq(deadline);
      expect(bounty.hasWorkerBeenPaid).to.be.false;
   });

   it('changes the worker when calling acceptWorker if there is already a worker. Only the worker address is changed.', async () => {
      const MockErc20 = await hre.ethers.getContractFactory('MockERC20');
      const nativeToken = await MockErc20.deploy('NativeToken', 'NT');
      await nativeToken.deployed();
      const stablecoin = await MockErc20.deploy('StableCoin', 'SC');
      await stablecoin.deployed();
      const WorkFi = await hre.ethers.getContractFactory('WorkFi');
      const workFi = await WorkFi.deploy(stablecoin.address);
      await (await nativeToken.approve(workFi.address, hre.ethers.utils.parseEther('100'))).wait();
      const stablePay = hre.ethers.utils.parseEther('0');
      const nativePay = hre.ethers.utils.parseEther('1');
      const exchangeRate = hre.ethers.utils.parseEther('2');
      const blockNumber = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNumber);
      const deadline = block.timestamp + hours(1);
      const [recruiterAddress, firstWorkerAddress, secondWorkerAddress] = await Promise.all((await hre.ethers.getSigners()).map(s => s.getAddress()));

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         deadline
      )).wait();

      await (await workFi.acceptWorker(1, firstWorkerAddress)).wait();
      await (await workFi.acceptWorker(1, secondWorkerAddress)).wait();

      const bountyId = 1;
      const filter = workFi.filters.WorkerAccepted(bountyId, secondWorkerAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.stablePay).to.eq(stablePay);
      expect(bounty.nativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(secondWorkerAddress); 
      expect(bounty.recruiter).to.eq(recruiterAddress);
      expect(bounty.isCompleted).to.be.false;
      expect(bounty.deadline).to.eq(deadline);
      expect(bounty.hasWorkerBeenPaid).to.be.false;
   });

   it('Creates an investment, transferring the stablecoin to the contract when calling invest', async () => {
      const MockErc20 = await hre.ethers.getContractFactory('MockERC20');
      const nativeToken = await MockErc20.deploy('NativeToken', 'NT');
      await nativeToken.deployed();
      const stablecoin = await MockErc20.deploy('StableCoin', 'SC');
      await stablecoin.deployed();
      const WorkFi = await hre.ethers.getContractFactory('WorkFi');
      const workFi = await WorkFi.deploy(stablecoin.address);
      await (await nativeToken.approve(workFi.address, hre.ethers.utils.parseEther('100'))).wait();
      const stablePay = hre.ethers.utils.parseEther('0');
      const nativePay = hre.ethers.utils.parseEther('1');
      const exchangeRate = hre.ethers.utils.parseEther('2');
      const blockNumber = await hre.ethers.provider.getBlockNumber();
      const block = await hre.ethers.provider.getBlock(blockNumber);
      const deadline = block.timestamp + hours(1);
      const [recruiter, investor] = await hre.ethers.getSigners();
      const [recruiterAddress, investorAddress] = await Promise.all([recruiter, investor].map(s => s.getAddress()));
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

