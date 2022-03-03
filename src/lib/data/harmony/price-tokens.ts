import { TokenPriceInfo } from 'src/lib/types/token.types';
import { getSingleTokenPrice } from 'src/lib/utils/http-utils';

export const PRICE_INFO_QUARTZ: TokenPriceInfo = {
  imgPath: 'assets/quartz-logo.svg',
  price: 0,
  priceLink:
    'https://dexscreener.com/harmony/0x90a48cb3a724ef6f8e6240f4788559f6370b6925',
  getPrice: async () => (await getSingleTokenPrice('quartz-defi')).usd,
};

export const PRICE_INFO_QSHARE: TokenPriceInfo = {
  imgPath: 'assets/qshare-logo.svg',
  price: 0,
  priceLink:
    'https://dexscreener.com/harmony/0x157e2e205b8d307501f1aad1c5c96c562e6f07c5',
  getPrice: async () => (await getSingleTokenPrice('qshare')).usd,
};

export const HARMONY_PRICE_TOKENS = [PRICE_INFO_QUARTZ, PRICE_INFO_QSHARE];
