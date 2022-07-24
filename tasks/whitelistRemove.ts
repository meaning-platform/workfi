import { task } from "hardhat/config";
import { whitelistRemove } from "./utils";

task("whitelistRemove", "Remove a stablecoin from the whitelist")
    .addPositionalParam("address")
    .setAction(async (taskArgs, hre) => {
        await whitelistRemove(hre, taskArgs.address);
    });