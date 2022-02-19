import { BigNumber, ethers } from 'ethers';
import { QUARTZ_UST_DFK_LP_ADDRESS } from './contracts';

export interface IVault {
  name: string;
  tokenName?: string;
  poolId: number;
  vaultAddress: string;
  lpAddress: string;
  userLpWalletBalance: number;
  walletBalanceBN: BigNumber;
  userLpDepositBalance: number;
  userLpDepositBalanceBN: BigNumber;
  APY: number;
  dailyAPR: number;
  totalValueLocked: number;
  loading: boolean;
  contract?: ethers.Contract;
}

export const VAULT_QUARTZ_UST: IVault = {
  name: 'Quartz-UST',
  poolId: 0,
  vaultAddress: '0xEF80aFDD5b345269DEd372E0441b5C19D2680693',
  lpAddress: QUARTZ_UST_DFK_LP_ADDRESS,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 10000,
  dailyAPR: 3.2,
  totalValueLocked: 1000000,
  loading: false,
};

export const VAULTS = [VAULT_QUARTZ_UST];
