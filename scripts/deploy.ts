import { writeFileSync } from 'fs';
import { deployWorkFi } from './utils';

async function main() {
	const workFi = await deployWorkFi();

	console.log('Workfi deployed to:', workFi.address);
	writeFileSync(
		'./config.js',
		`
		export const contractAddress = "${workFi.address}"
		export const ownerAddress = "${await workFi.signer.getAddress()}"
`
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
