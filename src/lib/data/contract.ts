import { QuartzContract } from '../types/quartz-contract.types';
import {
  REWARD_POOL_ADDRESS_BSC,
  ZAPPER_ADDRESS_BSC,
} from './bsc/bsc-addresses';
import { BINANCE_SMART_CHAIN, HARMONY_CHAIN, AVALANCHE } from './chains';
import {
  REWARD_POOL_ADDRESS_HARMONY,
  ZAPPER_ADDRESS_HARMONY,
  ZAPPER_FLEX_ADDRESS_HARMONY,
} from './harmony/contract-addresses';
import {
  REWARD_POOL_ADDRESS_GRAVE,
  ZAPPER_ADDRESS_AVALANCHE,
} from './avalanche/avalanche-addresses';

export const QUARTZ_CONTRACTS: {
  [chainId: number]: { [name in QuartzContract]: string };
} = {
  [BINANCE_SMART_CHAIN.chainId]: {
    Zapper: ZAPPER_ADDRESS_BSC,
    RewardPool: REWARD_POOL_ADDRESS_BSC,
  },
  [HARMONY_CHAIN.chainId]: {
    Zapper: ZAPPER_FLEX_ADDRESS_HARMONY,
    RewardPool: REWARD_POOL_ADDRESS_HARMONY,
  },
  [AVALANCHE.chainId]: {
    Zapper: ZAPPER_ADDRESS_AVALANCHE,
    RewardPool: REWARD_POOL_ADDRESS_GRAVE,
  },
};
