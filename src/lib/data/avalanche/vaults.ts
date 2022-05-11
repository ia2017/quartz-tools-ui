import { ethers } from 'ethers';
import { IVault } from '../../types/vault.types';
import {
  STRAT_GRAVE_AVAX_ADDRESS,
  VAULT_GRAVE_AVAX_ADDRESS
} from './avalanche-addresses';
import {
  PAIR_GRAVE_AVAX_ADDRESS,
  PAIR_GSHARE_AVAX_ADDRESS
} from './pairs';
import { AVALANCHE } from '../chains';
//import { TOKENS } from '../tokens';
import { getGravePrice, getGSharePrice } from './pricing';

export const VAULT_GRAVE_AVAX: IVault = {
  active: true,
  chainId: AVALANCHE.chainId,
  name: 'X-GRAVE-AVAX',
  poolId: 1,
  vaultAddress: VAULT_GRAVE_AVAX_ADDRESS, // fill in
  lpAddress: PAIR_GRAVE_AVAX_ADDRESS,
  userLpWalletBalance: 0,
  walletBalanceBN: ethers.constants.Zero,
  userLpDepositBalanceUI: 0,
  userLpDepositBalanceBN: ethers.constants.Zero,
  APY: 0,
  dailyAPR: 0.0,
  totalValueLocked: 0,
  tvlChecked: false,
  loading: false,
  logoURI: 'assets/logo.a9502d88.svg',
  contractApproved: false,
  strategy: {
    address: STRAT_GRAVE_AVAX_ADDRESS,
  },
  fetchPriceToken0: async () => 1,
  fetchPriceToken1: getGravePrice,
  fetchRewardTokenPrice: getGSharePrice,
  compoundsDaily: AVALANCHE.compoundsGuessimate,
  isSingleStake: false,
  protocolVersion: true,
};


export const VAULTS_AVALANCHE = [
  VAULT_GRAVE_AVAX,
];

