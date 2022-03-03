import { ethers } from 'ethers';
import { IERC20, IPair } from './token.types';

export interface IZapPool {
  name: string;
  token0: IERC20;
  token1: IERC20;
  // zapInWithPath parameters
  tokenInAddress: string;
  pairAddress: string;
  tokenInAmount: number;
  tokenInAmountBN: ethers.BigNumber;
  routerAddress: string;
  path: string[];

  // UI helpers
  pair?: IPair;
}
