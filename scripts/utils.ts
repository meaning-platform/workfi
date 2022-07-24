import { BaseContract, Contract } from "ethers";
import * as hre from "hardhat";
import { DeadlineUtils, MathUtils, WorkFi } from "../typechain-types";

export async function deployWorkFiWithDependencies(): Promise<WorkFiDeploymentResult> {
	const mathUtils = await deployWithoutArguments<MathUtils>('MathUtils');
	const deadlineUtils = await deployWithoutArguments<DeadlineUtils>('DeadlineUtils', { MathUtils: mathUtils.address });
	const bountyUtils = await deployWithoutArguments<BaseContract>('BountyUtils', { DeadlineUtils: deadlineUtils.address });
	const WorkFi = await hre.ethers.getContractFactory('WorkFi', {
		libraries: {
			MathUtils: mathUtils.address,
			DeadlineUtils: deadlineUtils.address,
			BountyUtils: bountyUtils.address,
		}
	});
	const workFi = await WorkFi.deploy();
	await workFi.deployed();
	return {
		workFi,
		dependencies: {
			mathUtils,
			deadlineUtils,
			bountyUtils
		}
	};
}

export async function deployWithoutArguments<T extends BaseContract>(name: string, libraries?: any): Promise<T> {
	const Factory = await hre.ethers.getContractFactory(name, {
		libraries
	});
	const contract = await Factory.deploy() as T;
	await contract.deployed();
	return contract;
}

export interface WorkFiDeploymentResult {
	workFi: WorkFi
	dependencies: WorkFiDependencies
}

export interface WorkFiDependencies {
	mathUtils: MathUtils
	deadlineUtils: DeadlineUtils
	bountyUtils: Contract
}
