import { deployWorkFiWithDependencies } from './utils';
import * as hre from 'hardhat';
import { writeAddressRegistryFile } from './addressRegistry/file';
import { ADDRESS_REGISTRY } from './addressRegistry/addressRegistry';
import { NetworkAddressRegistry } from './addressRegistry/types';

async function main() {
	const result = await deployWorkFiWithDependencies();

	const networkName = hre.ethers.provider.network.name;
	const networkAddressRegistry: NetworkAddressRegistry = {
		mathUtils: result.dependencies.mathUtils.address,
		deadlineUtils: result.dependencies.deadlineUtils.address,
		bountyUtils: result.dependencies.bountyUtils.address,
		workFi: result.workFi.address
	};
	ADDRESS_REGISTRY.networks[networkName] = networkAddressRegistry;

	writeAddressRegistryFile(ADDRESS_REGISTRY);

	console.log(`Deployed the following contracts on ${networkName}:\n${JSON.stringify(networkAddressRegistry)}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
