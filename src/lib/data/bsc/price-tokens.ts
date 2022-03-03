import { TokenPriceInfo } from 'src/lib/types/token.types';
import { getSingleTokenPrice } from 'src/lib/utils/http-utils';

export const PRICE_INFO_AMES: TokenPriceInfo = {
  imgPath: 'assets/ames-logo.svg',
  price: 0,
  priceLink:
    'https://dexscreener.com/bsc/0x6f78a0d31adc7c9fb848850f9d2a40da5858ad03',
  getPrice: async () => (await getSingleTokenPrice('amethyst')).usd,
};

export const PRICE_INFO_ASHARE: TokenPriceInfo = {
  imgPath: 'assets/ashare-logo.svg',
  price: 0,
  priceLink:
    'https://dexscreener.com/bsc/0x39846550ef3cb8d06e3cff52845df42f71ac3851',
  getPrice: async () => (await getSingleTokenPrice('quartz-defi-ashare')).usd,
};

export const BSC_PRICE_TOKENS = [PRICE_INFO_AMES, PRICE_INFO_ASHARE];
