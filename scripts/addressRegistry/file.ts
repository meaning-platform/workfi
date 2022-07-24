import { writeFileSync } from "fs";
import { AddressRegistry } from "./types";

const ADDRESS_REGISTRY_FILE = './addresses.ts';

export function writeAddressRegistryFile(registry: AddressRegistry) {
	const content = generateAddressRegistryFileContent(registry);
	writeFileSync(ADDRESS_REGISTRY_FILE, content);
}

function generateAddressRegistryFileContent(registry: AddressRegistry): string {
	return `import { AddressRegistry } from './scripts/addressRegistry/types';
	
	/// Contains deployed addresses of all smart contracts
	export const ADDRESS_REGISTRY: AddressRegistry = ${JSON.stringify(registry, null, 1)};`;
}
