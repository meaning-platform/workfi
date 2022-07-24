import { task } from "hardhat/config";
import { whitelistAdd } from "./utils";

task("whitelistAdd", "Add a stablecoin to the whitelist")
    .addPositionalParam("address")
    .setAction(async (taskArgs, hre) => {
        await whitelistAdd(hre, taskArgs.address);
    });