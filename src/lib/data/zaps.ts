import { IZapPool } from '../types/zap.types';
import { ZAPS_BSC } from './bsc/zaps';
import { BINANCE_SMART_CHAIN, HARMONY_CHAIN } from './chains';

export const ZAPS: { [chainId: number]: IZapPool[] } = {
  [BINANCE_SMART_CHAIN.chainId]: ZAPS_BSC,
  [HARMONY_CHAIN.chainId]: [],
};
