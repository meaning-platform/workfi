import React, { useState, useEffect } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import Web3Provider from '../context/web3Context';






import Layout from '../components/Layout'



function MyApp({ Component, pageProps }: AppProps) {


  return (
    //Bundle wallet and provider to add as context to the app
    <Web3Provider>
      <NextHead>
        <title>WorkFi</title>
      </NextHead>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3Provider>
  )
}
export default MyApp
