import { ethers } from 'ethers';
import { ERC20 } from './classes/erc20';
import { Pair } from './classes/pair';

export interface IZapPool {
  active: boolean;
  name: string;
  token0: ERC20;
  token1: ERC20;
  // zapInWithPath parameters
  tokenInAddress: string;
  pairAddress: string;
  tokenInAmount: number;
  tokenInAmountBN: ethers.BigNumber;
  routerAddress: string;
  path: string[];

  // UI helpers
  pair?: Pair;
  userBalanceToken0?: number;
  userBalanceToken1?: number;
}
