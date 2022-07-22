import { expect } from "chai";
import { BigNumber, BigNumberish, Contract, Signer } from "ethers";
import * as hre from "hardhat";
import { days, deployWithoutArguments, deployWorkFi, seconds } from "../scripts/utils";
import { ERC20, MockERC20, WorkFi } from "../typechain-types";

describe("DeadlineUtils", function () {
   
    it('returns the correct value when calling getDaysBeforeDate', async () => {
        const deadlineUtils = await deployDeadlineUtils();
        const today = Date.now() / seconds(1);
        const expectedDays = 30;
        const futureDate = today + days(expectedDays);
        
        expect(await deadlineUtils.getDaysBeforeDate(today, futureDate)).to.eq(expectedDays);
    });
});

async function deployDeadlineUtils() {
    const mathUtils = await deployWithoutArguments('MathUtils');
	return deployWithoutArguments('DeadlineUtils', { MathUtils: mathUtils.address });
}