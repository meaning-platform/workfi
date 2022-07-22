import { expect } from "chai";
import { BigNumber, BigNumberish, Contract, Signer } from "ethers";
import * as hre from "hardhat";
import { days, deployWorkFi } from "../scripts/utils";
import { ERC20, MockERC20, WorkFi } from "../typechain-types";

describe("WorkFi", function () {
   const stablePay = BigNumber.from(0);
   const nativePay = BigNumber.from('1');
   const exchangeRate = BigNumber.from('2');

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
      const dailyYield = 100_00; // 100%

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         dailyYield,
         deadline
      )).wait();

      const bountyId = 1;
      const bounty = await workFi.getBounty(bountyId);
      const yieldPool = await workFi.calculateYieldPool(
         nativePay,
         exchangeRate,
         dailyYield,
         bounty.creationDate,
         deadline
      );
      const expectedAmountOfNtTransferredToWorkFi = nativePay.add(yieldPool);
      const nativeBalanceAfter = await nativeToken.balanceOf(recruiterAddress);
      expect(nativeBalanceAfter).to.eq(nativeBalanceBefore.sub(expectedAmountOfNtTransferredToWorkFi));
      const filter = workFi.filters.BountyCreated(bountyId, recruiterAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      expect(bounty.workerStablePay).to.eq(stablePay);
      expect(bounty.workerNativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(hre.ethers.constants.AddressZero);
      expect(bounty.recruiter).to.eq(recruiterAddress);
      expect(bounty.status).to.eq(0);
      expect(bounty.workerDeadline).to.eq(deadline);
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
         27,
         deadline
      )).wait();

      await (await workFi.acceptWorker(1, workerAddresses[0])).wait();

      const bountyId = 1;
      const filter = workFi.filters.WorkerAccepted(bountyId, workerAddresses[0]);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.workerStablePay).to.eq(stablePay);
      expect(bounty.workerNativePay).to.eq(nativePay);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(workerAddresses[0]);
      expect(bounty.recruiter).to.eq(recruiterAddress);
      expect(bounty.status).to.eq(0);
      expect(bounty.workerDeadline).to.eq(deadline);
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
         27,
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
      const maxPossibleStableInvestment = nativePay.mul(exchangeRate);
      await stablecoin.transfer(investorAddress, maxPossibleStableInvestment); // transfer some stable to the investor since it doesn't have any for now
      await stablecoin.connect(investor).approve(workFi.address, maxPossibleStableInvestment);
      const investorStableBalanceBefore = await stablecoin.balanceOf(investorAddress);
      const workFiStableBalanceBefore = await stablecoin.balanceOf(workFi.address);
      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         27,
         deadline
      )).wait();

      const workFiWithInvestorSigner = workFi.connect(investor);
      await (await workFiWithInvestorSigner.invest(1, maxPossibleStableInvestment)).wait();

      const bountyId = 1;

      const filter = workFi.filters.Invested(1, investorAddress);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(bountyId);
      const [event] = events;
      expect(event.args.amount).to.eq(maxPossibleStableInvestment);
      const stableBalanceAfter = await stablecoin.balanceOf(investorAddress);
      expect(stableBalanceAfter).to.eq(investorStableBalanceBefore.sub(maxPossibleStableInvestment));
      const workFiStableBalanceAfter = await stablecoin.balanceOf(workFi.address);
      expect(workFiStableBalanceAfter).to.eq(workFiStableBalanceBefore.add(maxPossibleStableInvestment));
      const bounty = await workFi.getBounty(events[0].args.bountyId);
      expect(bounty.workerStablePay).to.eq(stablePay.add(maxPossibleStableInvestment));
      expect(bounty.workerNativePay).to.eq(0);
      expect(bounty.exchangeRate).to.eq(exchangeRate);
      expect(bounty.nativeToken).to.eq(nativeToken.address);
      expect(bounty.worker).to.eq(hre.ethers.constants.AddressZero);
      expect(bounty.recruiter).to.eq(recruiterAddress);
      expect(bounty.status).to.eq(0);
      expect(bounty.workerDeadline).to.eq(deadline);

      const investment = await workFiWithInvestorSigner.getInvestment(bountyId, 1);
      expect(investment.stableAmount).to.eq(maxPossibleStableInvestment);
   });

   it('is not possible to invest more than the remaining amount', async () => {
      const { stablecoin,
         nativeToken,
         workFi,
         deadline,
         contractDeployerAndRecruiter,
         recruiterAddress,
         investor,
         investorAddress,
         workerAddresses } = await prepare();
      const maxStableInvestmentPossible = nativePay.mul(exchangeRate);
      const stableInvestment = maxStableInvestmentPossible.add(1);
      await stablecoin.transfer(investorAddress, stableInvestment); // transfer some stable to the investor since it doesn't have any for now
      await stablecoin.connect(investor).approve(workFi.address, stableInvestment);

      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         27,
         deadline
      )).wait();

      const workFiWithInvestorSigner = workFi.connect(investor);
      await expect(workFiWithInvestorSigner.invest(1, stableInvestment)).to.be.revertedWith(`MaxInvestmentExceeded(${maxStableInvestmentPossible})`);
   });

   it('calculates the yield pool correctly', async () => {
      const workFi = await deployWorkFi();
      const dailyYield = 100_00; // 100%
      const bountyCreationDate = Date.now() / 1000;
      const deadline = bountyCreationDate + days(30);
      const yieldPool = await workFi.calculateYieldPool(
         nativePay,
         exchangeRate,
         dailyYield,
         bountyCreationDate,
         deadline
      );
      expect(yieldPool).to.eq(7800);
   });

   // TODO: Case where stablePay > 0
   it('pays the worker when the recruiter marked the task as completed and the worker calls acceptWorkerPayment()', async () => {
      const { stablecoin,
         nativeToken,
         workFi,
         deadline,
         contractDeployerAndRecruiter,
         recruiterAddress,
         investor,
         investorAddress,
         workerAddresses,
         workers } = await prepare();
      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         27,
         deadline
      )).wait();
      const bountyId = 1;
      await (await workFi.acceptWorker(bountyId, workerAddresses[0])).wait();
      await (await workFi.markBountyAsCompleted(bountyId)).wait();
      const nativeWorkerBalanceBefore = await nativeToken.balanceOf(workerAddresses[0]);
      const stableWorkerBalanceBefore = await stablecoin.balanceOf(workerAddresses[0]);

      await (await workFi.connect(workers[0]).acceptWorkerPayment(bountyId)).wait();

      const nativeWorkerBalanceAfter = await nativeToken.balanceOf(workerAddresses[0]);
      const stableWorkerBalanceAfter = await stablecoin.balanceOf(workerAddresses[0]);
      expect(nativeWorkerBalanceAfter).to.eq(nativeWorkerBalanceBefore.add(nativePay));
      expect(stableWorkerBalanceAfter).to.eq(stableWorkerBalanceBefore.add(stablePay));
      const filter = workFi.filters.WorkerPaymentAccepted(bountyId);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const event = events[0];
      expect(event.args.nativePay).to.eq(nativePay);
      expect(event.args.stablePay).to.eq(stablePay);
   });

   // TODO: Case where initial stablePay > 0
   it('pays the investor when the worker has accepted the payment when calling acceptInvestorPayment', async () => {
      const { stablecoin,
         nativeToken,
         workFi,
         deadline,
         contractDeployerAndRecruiter,
         recruiterAddress,
         investor,
         investorAddress,
         workerAddresses,
         workers } = await prepare();
      // TODO: Small numbers with small nativeToken / exchangeRate
      const dailyYield = 100_00; // 100% daily yield
      await (await workFi.createBounty(
         stablePay,
         nativePay,
         exchangeRate,
         nativeToken.address,
         stablecoin.address,
         dailyYield,
         deadline
      )).wait();
      const bountyId = 1;
      const bounty = await workFi.getBounty(bountyId);
      const yieldPool = await workFi.calculateYieldPool(
         nativePay,
         exchangeRate,
         dailyYield,
         bounty.creationDate,
         deadline
      );
      const maxPossibleStableInvestment = nativePay.mul(exchangeRate);
      const workfiWithInvestorSigner = workFi.connect(investor);
      await stablecoin.connect(investor).approve(workFi.address, maxPossibleStableInvestment);
      await stablecoin.transfer(investorAddress, maxPossibleStableInvestment); // transfer some stable to the investor since it doesn't have any for now
      await (await workfiWithInvestorSigner.invest(bountyId, maxPossibleStableInvestment)).wait();
      await (await workFi.acceptWorker(bountyId, workerAddresses[0])).wait();
      await (await workFi.markBountyAsCompleted(bountyId)).wait();
      await hre.ethers.provider.send('evm_increaseTime', [days(30 * 1.3)]); // investment opportunity closed
      const investorNativeBalanceBefore = await stablecoin.balanceOf(investorAddress);

      await (await workfiWithInvestorSigner.acceptInvestorPayment(bountyId)).wait();

      const investorBalanceAfter = await stablecoin.balanceOf(investorAddress);
      const expectedInvestorPayment = nativePay.add(yieldPool);
      expect(investorBalanceAfter).to.eq(investorNativeBalanceBefore.add(expectedInvestorPayment));
      const filter = workFi.filters.InvestorPaymentAccepted(bountyId);
      const events = await workFi.queryFilter(filter);
      expect(events.length).to.eq(1);
      const event = events[0];
      expect(event.args.payment).to.eq(expectedInvestorPayment);
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
   const deadline = await createDeadline(days(30));
   const signers = await hre.ethers.getSigners();
   const contractDeployerAndRecruiter = signers[0];
   const recruiterAddress = await contractDeployerAndRecruiter.getAddress();
   const investor = signers[1];
   const investorAddress = await investor.getAddress();
   const workers = signers.slice(2);
   const workerAddresses = await Promise.all(workers.map(s => s.getAddress()));

   return {
      nativeToken,
      stablecoin,
      workFi,
      deadline,
      contractDeployerAndRecruiter,
      recruiterAddress,
      investor,
      investorAddress,
      workers,
      workerAddresses,
   }
}

async function approveForManyTokens(tokenContracts: ERC20[], address: string, amount: BigNumberish): Promise<void> {
   for (let i = 0; i < tokenContracts.length; i++) {
      await (await tokenContracts[i].approve(address, amount)).wait();
   }
}

async function createDeadline(msFromCurrentBlock: number): Promise<number> {
   const blockNumber = await hre.ethers.provider.getBlockNumber();
   const block = await hre.ethers.provider.getBlock(blockNumber);
   return block.timestamp + msFromCurrentBlock;
}