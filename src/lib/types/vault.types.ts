import { BigNumber, Contract } from 'ethers';

export interface IVault {
  active: boolean;
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
}

export interface IStrategy {
  address: string;
  paused?: boolean;
  withdrawlFee?: number;
}
