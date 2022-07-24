# Local setup
create a file named .env.local with 
```
ENVIRONMENT="local"
NEXT_PUBLIC_ENVIRONMENT="local"
```

then you need to run local hardhat node:
```
npx hardhat node
```
and deploy a smartcontract to it:
```
npx hardhat run scripts/deploy.ts --network localhost
```

To start with two ERC20 tokens, one being a whitelisted stablecoin, run
```
npx hardhat populateWithTokens
```

Feel free to take a look at the other hardhat tasks as well.