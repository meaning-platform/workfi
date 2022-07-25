import React, { useState, useEffect } from 'react'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import Web3Provider from '../context/web3Context';
import LensProvider from '../context/lensContext';






import Layout from '../components/Layout'



function MyApp({ Component, pageProps }: AppProps) {


  return (
    //Bundle wallet and provider to add as context to the app
    <Web3Provider>
      <LensProvider>
        <NextHead>
          <title>WorkFi</title>
        </NextHead>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LensProvider>
    </Web3Provider>
  )
}
export default MyApp
