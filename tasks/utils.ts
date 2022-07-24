import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ADDRESS_REGISTRY } from '../addressRegistry';
import IWorkFiArtifact from '../artifacts/contracts/IWorkFi.sol/IWorkFi.json';
import { WorkFi } from "../typechain-types";
import { MockERC20 } from "../typechain-types";

export async function deployMockErc20(hre: HardhatRuntimeEnvironment, name: string, symbol: string): Promise<MockERC20> {
    const MockErc20 = await hre.ethers.getContractFactory('MockERC20');
    const mockErc20 = await MockErc20.deploy(name, symbol);
    await mockErc20.deployed();
    return mockErc20;
}

export async function whitelistAdd(hre: HardhatRuntimeEnvironment, address: string): Promise<void> {
    const networkName = hre.ethers.provider.network.name;
    const contractAddress = ADDRESS_REGISTRY.networks[networkName].workFi;
    const workFi = new hre.ethers.Contract(contractAddress, IWorkFiArtifact.abi, hre.ethers.provider.getSigner()) as WorkFi;
    await (await workFi.addStablecoinToWhitelist(address)).wait();
}

export async function whitelistRemove(hre: HardhatRuntimeEnvironment, address: string): Promise<void> {
    const networkName = hre.ethers.provider.network.name;
    const contractAddress = ADDRESS_REGISTRY.networks[networkName].workFi;
    const workFi = new hre.ethers.Contract(contractAddress, IWorkFiArtifact.abi, hre.ethers.provider.getSigner()) as WorkFi;
    await (await workFi.removeStablecoinFromWhitelist(address)).wait();
}
