import { QuartzContract } from '../types/quartz-contract.types';
import { BINANCE_SMART_CHAIN, HARMONY_CHAIN } from './chains';

export const QUARTZ_CONTRACTS: {
  [chainId: number]: { [name in QuartzContract]: string };
} = {
  [BINANCE_SMART_CHAIN.chainId]: {
    Zapper: '',
    RewardPool: '',
  },
  [HARMONY_CHAIN.chainId]: {
    Zapper: '',
    RewardPool: '',
  },
};
