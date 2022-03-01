import { BigNumber, Contract } from 'ethers';

export interface IVault {
  active: boolean;
  name: string;
  chainId: number;
  tokenName?: string;
  symbol?: string;
  poolId: number;
  vaultAddress: string;
  lpAddress: string;
  userLpWalletBalance: number;
  walletBalanceBN: BigNumber;
  userLpDepositBalance: number;
  userLpDepositBalanceFull?: number;
  userLpDepositBalanceBN: BigNumber;
  APR?: number;
  dailyAPR: number;
  APY: number;
  totalValueLocked: number;
  tvlChecked: boolean;
  loading: boolean;
  contract?: Contract;
  logoURI: string;
  contractApproved: boolean;
  pricePerShare?: BigNumber;
  strategy?: IStrategy;
  strategyContract?: Contract;
  geckoIdToken0?: string;
  geckoIdToken1?: string;
  fetchPriceToken0: () => Promise<number>;
  fetchPriceToken1: () => Promise<number>;
  fetchRewardTokenPrice: () => Promise<number>;
  compoundsDaily: number;
}

export interface IStrategy {
  address: string;
  paused?: boolean;
  withdrawlFee?: number;
}
