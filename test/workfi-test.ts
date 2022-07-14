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
      const signerAddress = await signer.getAddress();
      const nativeBalanceBefore = await nativeToken.balanceOf(signerAddress);

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         deadline
      )).wait();

      const nativeBalanceAfter = await nativeToken.balanceOf(signerAddress);
      expect(nativeBalanceAfter).to.eq(nativeBalanceBefore.sub(nativePay));
      const filter = workFi.filters.BountyCreated(1, signerAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.stablePay).to.eq(stablePay);
      expect(bounty.nativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(hre.ethers.constants.AddressZero);
      expect(bounty.recruiter).to.eq(signerAddress);
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
      const [signerAddress, workerAddress] = await Promise.all((await hre.ethers.getSigners()).map(s => s.getAddress()));

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         deadline
      )).wait();

      await (await workFi.acceptWorker(1, workerAddress)).wait();

      const filter = workFi.filters.WorkerAccepted(1, workerAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.stablePay).to.eq(stablePay);
      expect(bounty.nativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(workerAddress); 
      expect(bounty.recruiter).to.eq(signerAddress);
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
      const [signerAddress, firstWorkerAddress, secondWorkerAddress] = await Promise.all((await hre.ethers.getSigners()).map(s => s.getAddress()));

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         deadline
      )).wait();

      await (await workFi.acceptWorker(1, firstWorkerAddress)).wait();
      await (await workFi.acceptWorker(1, secondWorkerAddress)).wait();

      const filter = workFi.filters.WorkerAccepted(1, secondWorkerAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.stablePay).to.eq(stablePay);
      expect(bounty.nativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(secondWorkerAddress); 
      expect(bounty.recruiter).to.eq(signerAddress);
      expect(bounty.isCompleted).to.be.false;
      expect(bounty.deadline).to.eq(deadline);
      expect(bounty.hasWorkerBeenPaid).to.be.false;
   });
});

