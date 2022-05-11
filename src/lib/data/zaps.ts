import { ChainZapData } from '../types/zap.types';
import { ZAPPER_ADDRESS_AVALANCHE } from './avalanche/avalanche-addresses';
import { ZAPS_BSC } from './bsc/zaps';
import { AVALANCHE, BINANCE_SMART_CHAIN, BINANCE_SMART_CHAIN_TESTNET, HARMONY_CHAIN } from './chains';
import { ZAPS_HARMONY } from './harmony/zaps';
import { ZAPS_AVALANCHE } from './avalanche/zaps';
  
export const ZAPS: ChainZapData = {
  [BINANCE_SMART_CHAIN.chainId]: ZAPS_BSC,
  [HARMONY_CHAIN.chainId]: ZAPS_HARMONY,
  [BINANCE_SMART_CHAIN_TESTNET.chainId]: ZAPS_BSC,
  [AVALANCHE.chainId]: ZAPS_AVALANCHE
};
