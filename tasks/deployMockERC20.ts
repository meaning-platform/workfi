import { task } from "hardhat/config";
import { deployMockErc20 } from "./utils";


task("deployMockERC20", "Deploys a MockERC20 contract")
    .addPositionalParam("name")
    .addPositionalParam("symbol")
    .setAction(async (taskArgs, hre) => {
        const mockErc20 = await deployMockErc20(hre, taskArgs.name, taskArgs.symbol);
        console.log(`${taskArgs.name} MockERC20 contract deployed at ${mockErc20.address}`);
    });