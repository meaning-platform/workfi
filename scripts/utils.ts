import * as hre from "hardhat";

export async function deployWithoutArguments(name: string, libraries?: any) {
	const Factory = await hre.ethers.getContractFactory(name, {
		libraries
	});
	const contract = await Factory.deploy();
	await contract.deployed();
	return contract;
}

export async function deployWorkFi() {
	const mathUtils = await deployWithoutArguments('MathUtils');
	const deadlineUtils = await deployWithoutArguments('DeadlineUtils', { MathUtils: mathUtils.address });
	const bountyUtils = await deployWithoutArguments('BountyUtils', { DeadlineUtils: deadlineUtils.address });
	const WorkFi = await hre.ethers.getContractFactory('WorkFi', {
		libraries: {
			MathUtils: mathUtils.address,
			DeadlineUtils: deadlineUtils.address,
			BountyUtils: bountyUtils.address,
		}
	});
	const workfi = await WorkFi.deploy();
	await workfi.deployed();
	return workfi;
}
