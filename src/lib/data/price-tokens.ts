import { TokenPriceInfo } from '../types/token.types';
import { BSC_PRICE_TOKENS } from './bsc/price-tokens';
import { AVALANCHE_PRICE_TOKENS } from './avalanche/price-tokens';
import { AVALANCHE, BINANCE_SMART_CHAIN, HARMONY_CHAIN } from './chains';
import { HARMONY_PRICE_TOKENS } from './harmony/price-tokens';

export const PRICE_TOKENS: { [chainId: number]: TokenPriceInfo[] } = {
  [BINANCE_SMART_CHAIN.chainId]: BSC_PRICE_TOKENS,
  [HARMONY_CHAIN.chainId]: HARMONY_PRICE_TOKENS,
  [AVALANCHE.chainId]: AVALANCHE_PRICE_TOKENS,
};
