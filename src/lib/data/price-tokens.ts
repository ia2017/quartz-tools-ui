import { TokenPriceInfo } from '../types/token.types';
import { BSC_PRICE_TOKENS } from './bsc/price-tokens';
import { BINANCE_SMART_CHAIN } from './chains';

export const PRICE_TOKENS: { [chainId: number]: TokenPriceInfo[] } = {
  [BINANCE_SMART_CHAIN.chainId]: BSC_PRICE_TOKENS,
};
