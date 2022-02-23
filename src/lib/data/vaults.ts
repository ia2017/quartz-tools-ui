import { BigNumber, ethers } from 'ethers';
import {
  QSHARE_ONE_DFK_LP_ADDRESS,
  QUARTZ_UST_DFK_LP_ADDRESS,
  VAULT_QSHARE_ONE_ADDRESS,
  VAULT_QUARTZ_UST_ADDRESS,
} from './contracts';

export interface IVault {
  name: string;
  tokenName?: string;
  symbol?: string;
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
  logoURI: string;
  contractApproved: boolean;
  pricePerShare?: BigNumber;
}

export const VAULT_QUARTZ_UST: IVault = {
  name: 'Quartz-UST',
  poolId: 0,
  vaultAddress: VAULT_QUARTZ_UST_ADDRESS,
  lpAddress: QUARTZ_UST_DFK_LP_ADDRESS,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 14,
  dailyAPR: 0.012,
  totalValueLocked: 127000,
  loading: false,
  logoURI: 'assets/quartz-ust-lp.svg',
  contractApproved: false,
};

// export const VAULT_QSHARE_ONE: IVault = {
//   name: 'QShare-ONE',
//   poolId: 1,
//   vaultAddress: VAULT_QSHARE_ONE_ADDRESS,
//   lpAddress: QSHARE_ONE_DFK_LP_ADDRESS,
//   userLpWalletBalance: 0,
//   walletBalanceBN: ethers.constants.Zero,
//   userLpDepositBalance: 0,
//   userLpDepositBalanceBN: ethers.constants.Zero,
//   APY: 18,
//   dailyAPR: 0.02,
//   totalValueLocked: 117000,
//   loading: false,
//   logoURI: 'assets/qshare-one-lp.svg',
// };

export const VAULTS = [VAULT_QUARTZ_UST];
