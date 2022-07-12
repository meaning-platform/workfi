/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env:{
    LENS_POLYGON_MUMBAI_TESTNET_URI : process.env.LENS_POLYGON_MUMBAI_TESTNET_URI,
    LENS_POLYGON_MAINNET_URI : process.env.LENS_POLYGON_MAINNET_URI,
    ETH_MAINNET_RPC_URI : process.env.ETH_MAINNET_RPC_URI,
    ETH_ROPSTEN_RPC_URI : process.env.ETH_ROPSTEN_RPC_URI, 
    ETH_RINKEBY_RPC_URI : process.env.ETH_RINKEBY_RPC_URI,
    POLYGON_MAINNET_URI : process.env.POLYGON_MAINNET_URI,
    POLYGON_MUMBAI_URI : process.env.POLYGON_MUMBAI_URI,
    INFURA_KEY : process.env.INFURA_KEY,
  }
}
