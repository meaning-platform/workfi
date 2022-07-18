import * as hre from "hardhat";

export async function deployWorkFi() {
	const WorkFi = await hre.ethers.getContractFactory('WorkFi');
	const workfi = await WorkFi.deploy();
	await workfi.deployed();
	return workfi;
}