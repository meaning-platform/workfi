import { ethers } from 'ethers'

export interface Account {
    address: string
    ens: { name?: string; avatar?: string }
    balance: Record<string, string> | null
  }


  export type Web3ContextType = {
    Account: Account | null;
    Provider: ethers.providers.Web3Provider | null | undefined;
    Signer: ethers.Signer;
  };
  