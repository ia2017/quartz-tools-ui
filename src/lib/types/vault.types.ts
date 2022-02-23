import { BigNumber, Contract } from 'ethers';

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
  contract?: Contract;
  logoURI: string;
  contractApproved: boolean;
  pricePerShare?: BigNumber;
  strategy?: IStrategy;
  strategyContract?: Contract;
}

export interface IStrategy {
  address: string;
  paused?: boolean;
  withdrawlFee?: number;
}
