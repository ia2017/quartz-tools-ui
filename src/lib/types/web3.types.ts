import { ethers } from 'ethers';
import { ChainBaseConfig } from './chain.types';

export interface Web3AppInfo {
  signer: ethers.providers.JsonRpcSigner;
  provider: ethers.providers.JsonRpcProvider;
  chainId?: number;
  currentChain?: ChainBaseConfig;
  userAddress?: string;
  wallet?: ethers.Wallet;
}
