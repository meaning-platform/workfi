import React, { useEffect, useState } from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { gql } from '@apollo/client'
import { lensContextType, Web3ContextType } from '../types';
import { Web3Context } from './web3Context';

export const LensContext = React.createContext<lensContextType | null>(null);



const GET_CHALLENGE = `
    query($request: ChallengeRequest!) {
        challenge(request: $request) { text }
    }
    `

const AUTHENTICATION = `
    mutation($request: SignedAuthChallenge!) { 
        authenticate(request: $request) {
        accessToken
        refreshToken
        }
    }
`





  const LensProvider: React.FC<React.ReactNode> = ({ children }) => {
    const [client, setClient] = useState<ApolloClient<any> | null>()
    const lensURL = process.env.LENS_POLYGON_MAINNET_URI || process.env.LENS_POLYGON_MUMBAI_TESTNET_URI

    const Web3 = React.useContext(Web3Context) as Web3ContextType;

     function init() {

        setClient(new ApolloClient({
            uri: lensURL,
            cache: new InMemoryCache(),
          })) 
          console.log('client',client)





    }


    // create the client on mount
    useEffect(() => {

         // create a instance of the wallet
        init();



    }, []);


        const generateChallenge = (address: string) => {
            return client?.query({
                query: gql(GET_CHALLENGE),
                variables: {
                request: {
                    address,
                },
                },
            })
            }

        const authenticate = async (address: string, signature: string) => {
            return client?.mutate({
             mutation: gql(AUTHENTICATION),
             variables: {
               request: {
                 address,
                 signature,
               },
             },
           })
         }

         const signText = (text: string) => {
            return Web3.Provider?.signMessage(text);
          }

         const login  = async (address: string) => {
            console.log('login')
            // we request a challenge from the server
            const challengeResponse = await generateChallenge(address);
            console.log('challengeResponse',challengeResponse)
            // sign the text with the wallet
            const signature = await signText(challengeResponse?.data.challenge.text)

            const accessTokens = await authenticate(address, signature);
            console.log(accessTokens);


         }


 

  return (
    <LensContext.Provider value={{ Client: client, login }}>
      {children}
    </LensContext.Provider>
  );
};






export default LensProvider;