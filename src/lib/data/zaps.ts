import { ChainZapData } from '../types/zap.types';
import { ZAPS_BSC } from './bsc/zaps';
import { BINANCE_SMART_CHAIN, HARMONY_CHAIN } from './chains';
import { ZAPS_HARMONY } from './harmony/zaps';

export const ZAPS: ChainZapData = {
  [BINANCE_SMART_CHAIN.chainId]: ZAPS_BSC,
  [HARMONY_CHAIN.chainId]: ZAPS_HARMONY,
};
