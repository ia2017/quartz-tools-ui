import { QuartzContract } from '../types/quartz-contract.types';
import { BINANCE_SMART_CHAIN, HARMONY_CHAIN } from './chains';

export const QUARTZ_CONTRACTS: {
  [chainId: number]: { [name in QuartzContract]: string };
} = {
  [BINANCE_SMART_CHAIN.chainId]: {
    Zapper: '',
    RewardPool: '0x1da194F8baf85175519D92322a06b46A2638A530',
  },
  [HARMONY_CHAIN.chainId]: {
    Zapper: '0x56EA1648a0174AFC0bCf3B1ee5f406A065640A4B',
    RewardPool: '',
  },
};
