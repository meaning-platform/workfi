import { expect } from "chai";
import * as hre from "hardhat";

describe("MathUtils", function () {
   
    it('returns the correct value when calling calculatePercentage()', async () => {
        const MathUtils = await hre.ethers.getContractFactory('MathUtils');
        const mathUtils = await MathUtils.deploy();
        await mathUtils.deployed();

        expect(await mathUtils.calculatePercentage(100, 30_00)).to.eq(30);
    });
});

