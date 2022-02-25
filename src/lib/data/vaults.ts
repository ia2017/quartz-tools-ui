import { ethers } from 'ethers';
import { IVault } from '../types/vault.types';
import {
  STRAT_1QSHARE_UST_ADDRESS_BSC,
  STRAT_AMETHYST_UST_ADDRESS_BSC,
  STRAT_ASHARE_UST_ADDRESS_BSC,
  VAULT_1QSHARE_UST_ADDRESS_BSC,
  VAULT_AMETHYST_UST_ADDRESS_BSC,
  VAULT_ASHARE_UST_ADDRESS_BSC,
} from './bsc/bsc-addresses';
import {
  PAIR_AMETHYST_UST_BSC,
  PAIR_ASHARE_UST_BSC,
  PAIR_1QSHARE_UST_BSC,
} from './bsc/pairs';
import {
  QSHARE_ONE_DFK_LP_ADDRESS,
  QUARTZ_UST_DFK_LP_ADDRESS,
  STRAT_QUARTZ_UST_ADDRESS,
  VAULT_QSHARE_ONE_ADDRESS,
  VAULT_QUARTZ_UST_ADDRESS,
} from './contracts';

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
  strategy: {
    address: STRAT_QUARTZ_UST_ADDRESS,
  },
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

export const VAULT_AMETHYST_UST_BSC: IVault = {
  name: 'AMES-UST',
  poolId: 0,
  vaultAddress: VAULT_AMETHYST_UST_ADDRESS_BSC,
  lpAddress: PAIR_AMETHYST_UST_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 14,
  dailyAPR: 0.012,
  totalValueLocked: 127000,
  loading: false,
  logoURI: 'assets/ames-ust-lp-logo.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_AMETHYST_UST_ADDRESS_BSC,
  },
};

export const VAULT_ASHARE_UST_BSC: IVault = {
  name: 'ASHARE-UST',
  poolId: 1,
  vaultAddress: VAULT_ASHARE_UST_ADDRESS_BSC,
  lpAddress: PAIR_ASHARE_UST_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 14,
  dailyAPR: 0.012,
  totalValueLocked: 127000,
  loading: false,
  logoURI: 'assets/ashare-ust-lp-logo.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_ASHARE_UST_ADDRESS_BSC,
  },
};

export const VAULT_1QSHARE_UST_BSC: IVault = {
  name: '1QSHARE-UST',
  poolId: 2,
  vaultAddress: VAULT_1QSHARE_UST_ADDRESS_BSC,
  lpAddress: PAIR_1QSHARE_UST_BSC,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 14,
  dailyAPR: 0.012,
  totalValueLocked: 127000,
  loading: false,
  logoURI: 'assets/1share-ust-lp-logo.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_1QSHARE_UST_ADDRESS_BSC,
  },
};

export const VAULTS_HARMONY = [VAULT_QUARTZ_UST];

export const VAULTS_BSC = [
  VAULT_AMETHYST_UST_BSC,
  VAULT_ASHARE_UST_BSC,
  VAULT_1QSHARE_UST_BSC,
];

export const ALL_VAULTS = {
  [56]: VAULTS_BSC,
  [1666600000]: VAULTS_HARMONY,
};
