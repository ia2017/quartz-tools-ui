import { ethers } from 'ethers';
import { TokenBaseConfig } from './token.types';

export type ChainName = 'Harmony' | 'Avalance';

export interface ChainBaseConfig {
  name: string;
  chainId?: number;
  provider?: ethers.providers.JsonRpcProvider;
  rpcURL?: string;
  blockExplorer?: string;
  nativeToken?: TokenBaseConfig;
  evmCompatible?: boolean;
  blockTimeSeconds?: number;
  blocksPerYear?: number;
  compoundsGuessimate?: number;
}
