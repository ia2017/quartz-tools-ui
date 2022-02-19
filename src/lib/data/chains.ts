import { ChainBaseConfig } from '../types/chain.types';

export const HARMONY_CHAIN: ChainBaseConfig = {
  name: 'Harmony',
  nativeToken: { coinGeckoId: 'harmony' },
  chainId: 1666600000,
};

export const BINANCE_SMART_CHAIN: ChainBaseConfig = {
  name: 'BSC',
  nativeToken: { coinGeckoId: 'binancecoin' },
  chainId: 56,
};

export const CURRENT_CHAINS: ChainBaseConfig[] = [
  BINANCE_SMART_CHAIN,
  HARMONY_CHAIN,
  // {
  //   name: 'Solana',
  //   nativeToken: { coinGeckoId: 'solana' },
  // },

  // {
  //   name: 'Polygon',
  //   nativeToken: { coinGeckoId: 'matic-network' },
  // },

  // {
  //   name: 'Osmosis',
  //   nativeToken: { coinGeckoId: 'osmosis' },
  // },
  // {
  //   name: 'Terra',
  //   nativeToken: { coinGeckoId: 'terra-luna' },
  // },
  // {
  //   name: 'Avalanche',
  //   nativeToken: { coinGeckoId: 'avalanche-2' },
  //   chainId: 43114,
  // },
  // {
  //   name: 'Fantom',
  //   nativeToken: { coinGeckoId: 'fantom' },
  //   chainId: 250,
  // },
  // {
  //   name: 'Near',
  //   nativeToken: { coinGeckoId: 'near' },
  // },
  // {
  //   name: 'Aurora',
  //   nativeToken: { coinGeckoId: 'aurora-near' },
  // },
  // {
  //   name: 'Oasis',
  //   nativeToken: { coinGeckoId: 'oasis-network' },
  // },
  // {
  //   name: 'Cosmos',
  //   nativeToken: { coinGeckoId: 'cosmos' },
  // },
];
