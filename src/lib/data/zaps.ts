import { IZapPool } from '../types/zap.types';
import { BINANCE_SMART_CHAIN, HARMONY_CHAIN } from './chains';
import { ZAP_QUARTS_UST_HARMONY } from './harmony/zaps';

export const ZAPS: { [chainId: number]: IZapPool[] } = {
  [BINANCE_SMART_CHAIN.chainId]: [],
  [HARMONY_CHAIN.chainId]: [ZAP_QUARTS_UST_HARMONY],
};
