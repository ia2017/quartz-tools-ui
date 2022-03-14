import { QuartzContract } from '../types/quartz-contract.types';
import { BINANCE_SMART_CHAIN, HARMONY_CHAIN } from './chains';
import {
  REWARD_POOL_ADDRESS_HARMONY,
  ZAPPER_ADDRESS_HARMONY,
} from './harmony/contract-addresses';

export const QUARTZ_CONTRACTS: {
  [chainId: number]: { [name in QuartzContract]: string };
} = {
  [BINANCE_SMART_CHAIN.chainId]: {
    Zapper: '',
    RewardPool: '0x1da194F8baf85175519D92322a06b46A2638A530',
  },
  [HARMONY_CHAIN.chainId]: {
    Zapper: ZAPPER_ADDRESS_HARMONY,
    RewardPool: REWARD_POOL_ADDRESS_HARMONY,
  },
};
