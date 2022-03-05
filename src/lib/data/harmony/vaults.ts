import { ethers } from 'ethers';
import { IVault } from 'src/lib/types/vault.types';
import { getSingleTokenPrice } from 'src/lib/utils/http-utils';
import { HARMONY_CHAIN } from '../chains';
import {
  QUARTZ_ADDRESS_HARMONY,
  STRAT_ONE_QSHARE_ADDRESS_HARMONY,
  STRAT_SINGLE_QUARTZ_ADDRESS_HARMONY,
  STRAT_UST_QUARTZ_ADDRESS_HARMONY,
  VAULT_ONE_QSHARE_ADDRESS_HARMONY,
  VAULT_SINGLE_QUARTZ_ADDRESS_HARMONY,
  VAULT_UST_QUARTZ_ADDRESS_HARMONY,
} from './contract-addresses';
import {
  PAIR_QSHARE_ONE_ADDRESS_HARMONY,
  PAIR_UST_QUARTZ_ADDRESS_HARMONY,
} from './pair-addresses';

export const VAULT_UST_QUARTZ_HARMONY: IVault = {
  active: true,
  chainId: HARMONY_CHAIN.chainId,
  name: 'Quartz-UST',
  poolId: 0,
  vaultAddress: VAULT_UST_QUARTZ_ADDRESS_HARMONY,
  lpAddress: PAIR_UST_QUARTZ_ADDRESS_HARMONY,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/quartz-ust-lp.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_UST_QUARTZ_ADDRESS_HARMONY,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: async () => {
    return (await getSingleTokenPrice('quartz-defi')).usd;
  },
  fetchRewardTokenPrice: async () => {
    return (await getSingleTokenPrice('qshare')).usd;
  },
  compoundsDaily: HARMONY_CHAIN.compoundsGuessimate,
  isSingleStake: false,
};

export const VAULT_ONE_QSHARE_HARMONY: IVault = {
  active: true,
  chainId: HARMONY_CHAIN.chainId,
  name: 'QShare-ONE',
  poolId: 2,
  vaultAddress: VAULT_ONE_QSHARE_ADDRESS_HARMONY,
  lpAddress: PAIR_QSHARE_ONE_ADDRESS_HARMONY,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/qshare-one-lp.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_ONE_QSHARE_ADDRESS_HARMONY,
  },
  fetchPriceToken0: async () => {
    return (await getSingleTokenPrice('harmony')).usd;
  },
  fetchPriceToken1: async () => {
    return (await getSingleTokenPrice('qshare')).usd;
  },
  fetchRewardTokenPrice: async () => {
    return (await getSingleTokenPrice('qshare')).usd;
  },
  compoundsDaily: HARMONY_CHAIN.compoundsGuessimate,
  isSingleStake: false,
};

const VAULT_SINGLE_STAKE_QUARTZ: IVault = {
  active: true,
  chainId: HARMONY_CHAIN.chainId,
  name: 'Quartz',
  poolId: 4,
  vaultAddress: VAULT_SINGLE_QUARTZ_ADDRESS_HARMONY,
  lpAddress: QUARTZ_ADDRESS_HARMONY,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalance: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/quartz-lp.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_SINGLE_QUARTZ_ADDRESS_HARMONY,
  },
  fetchPriceToken0: async () => {
    return (await getSingleTokenPrice('quartz-defi')).usd;
  },
  fetchPriceToken1: async () => {
    return null;
  },
  fetchRewardTokenPrice: async () => {
    return (await getSingleTokenPrice('qshare')).usd;
  },
  compoundsDaily: HARMONY_CHAIN.compoundsGuessimate,
  isSingleStake: true,
};

export const VAULTS_HARMONY = [
  VAULT_SINGLE_STAKE_QUARTZ,
  VAULT_UST_QUARTZ_HARMONY,
  VAULT_ONE_QSHARE_HARMONY,
];
