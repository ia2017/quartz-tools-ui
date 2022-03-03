import { ethers } from 'ethers';
import { IVault } from 'src/lib/types/vault.types';
import { getSingleTokenPrice } from 'src/lib/utils/http-utils';
import { HARMONY_CHAIN } from '../chains';
import {
  VAULT_QUARTZ_UST_ADDRESS,
  QUARTZ_UST_DFK_LP_ADDRESS,
  STRAT_QUARTZ_UST_ADDRESS,
} from '../data';

export const VAULT_QUARTZ_UST_HARMONY: IVault = {
  active: true,
  chainId: HARMONY_CHAIN.chainId,
  name: 'Quartz-UST',
  poolId: 0,
  vaultAddress: VAULT_QUARTZ_UST_ADDRESS,
  lpAddress: QUARTZ_UST_DFK_LP_ADDRESS,
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
    address: STRAT_QUARTZ_UST_ADDRESS,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: async () => {
    return (await getSingleTokenPrice('quartz-defi')).usd;
  },
  fetchRewardTokenPrice: async () => {
    return (await getSingleTokenPrice('qshare')).usd;
  },
  compoundsDaily: HARMONY_CHAIN.compoundsGuessimate,
};

export const VAULTS_HARMONY = [];
