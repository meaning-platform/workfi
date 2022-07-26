import { task } from "hardhat/config";
import { getWhitelistedStablecoins } from "../utils/workFiUtils";
import { deployMockErc20, whitelistAdd } from "./utils";
import IWorkFiArtifact from '../artifacts/contracts/IWorkFi.sol/IWorkFi.json';
import { WorkFi } from "../typechain-types";

task("getWhitelistedStablecoins", "Returns the whitelist of stablecoins")
    .addPositionalParam('address')
    .setAction(async (taskArgs, hre) => {
        const workfi = new hre.ethers.Contract(taskArgs.address, IWorkFiArtifact.abi, hre.ethers.provider) as WorkFi;
        const stablecoins = await getWhitelistedStablecoins(workfi);
        console.log(Array.from(stablecoins));
    });