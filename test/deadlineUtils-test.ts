import { expect } from "chai";
import { BigNumber, BigNumberish, Contract, Signer } from "ethers";
import * as hre from "hardhat";
import { UnixTime } from "../scripts/time";
import { deployWithoutArguments, deployWorkFi } from "../scripts/utils";
import { ERC20, MockERC20, WorkFi } from "../typechain-types";

describe("DeadlineUtils", function () {
   
    it('returns the correct value when calling getDaysBeforeDate', async () => {
        const deadlineUtils = await deployDeadlineUtils();
        const today = UnixTime.now();
        const expectedDays = 30;
        const futureDate = today + UnixTime.days(expectedDays);
        
        expect(await deadlineUtils.getDaysBeforeDate(today, futureDate)).to.eq(expectedDays);
    });
});

async function deployDeadlineUtils() {
    const mathUtils = await deployWithoutArguments('MathUtils');
	return deployWithoutArguments('DeadlineUtils', { MathUtils: mathUtils.address });
}