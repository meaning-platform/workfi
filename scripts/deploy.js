const hre = require('hardhat');
const fs = require('fs');

async function main() {

	const WorkFi = await hre.ethers.getContractFactory('WorkFi');
	// TODO Deploy mock ERC20
	const workfi = await WorkFi.deploy(hre.ethers.constants.AddressZero);

	await workfi.deployed();

	console.log('Workfi deployed to:', workfi.address);
	fs.writeFileSync(
		'./config.js',
		`
		export const contractAddress = "${workfi.address}"
		export const ownerAddress = "${workfi.signer.address}"
`
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
