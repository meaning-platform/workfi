import '../styles/globals.css'
import type { AppProps } from 'next/app'
// import { providers } from 'ethers'
import NextHead from 'next/head'

// import { Provider, chain, createClient, defaultChains } from 'wagmi'
import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'

const injected = injectedModule()

const infuraKey =  process.env.INFURA_KEY as string
const rpcUrl = `https://mainnet.infura.io/v3/${infuraKey}`

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl
    }
  ]
})


import Layout from '../components/Layout'



function MyApp({ Component, pageProps }: AppProps) {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  // create an ethers provider
  let ethersProvider

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
  }
  return (
    <div>
      <NextHead>
        <title>WorkFi</title>
      </NextHead>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}
export default MyApp
