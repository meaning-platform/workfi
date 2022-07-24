import { task } from "hardhat/config";
import { deployMockErc20, whitelistAdd } from "./utils";

task("populateWithTokens", "Deploys a stablecoin and another ERC20 and add the stablecoin to the whitelist")
    .setAction(async (taskArgs, hre) => {
        const stablecoin = await deployMockErc20(hre, 'StableCoin', 'SC');
        await deployMockErc20(hre, 'NativeToken', 'NT');
        await whitelistAdd(hre, stablecoin.address);
    });