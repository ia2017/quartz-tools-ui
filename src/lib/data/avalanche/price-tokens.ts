import { TokenPriceInfo } from 'src/lib/types/token.types';
import { getAmethystPrice, getAsharePrice, getGravePrice, getGSharePrice } from './pricing';

export const PRICE_INFO_AMES: TokenPriceInfo = {
  imgPath: 'assets/ames-logo.svg',
  price: 0,
  priceLink:
    'https://dexscreener.com/bsc/0x6f78a0d31adc7c9fb848850f9d2a40da5858ad03',
  getPrice: getAmethystPrice,
};

export const PRICE_INFO_ASHARE: TokenPriceInfo = {
  imgPath: 'assets/ashare-logo.svg',
  price: 0,
  priceLink:
    'https://dexscreener.com/bsc/0x39846550ef3cb8d06e3cff52845df42f71ac3851', //https://dexscreener.com/avalanche/0x10e882acfae3cf63e96741fabc41c19025e7be2a
  getPrice: getAsharePrice,
};

export const PRICE_INFO_GRAVE: TokenPriceInfo = {
  imgPath: 'assets/logo.a9502d88.svg',
  price: 0,
  priceLink:
    'https://dexscreener.com/avalanche/0x10e882acfae3cf63e96741fabc41c19025e7be2a', //https://dexscreener.com/avalanche/0x10e882acfae3cf63e96741fabc41c19025e7be2a
  getPrice: getGravePrice,
};

export const PRICE_INFO_GSHARE: TokenPriceInfo = {
  imgPath: 'assets/logo.a9502d88.svg',
  price: 0,
  priceLink:
    'https://dexscreener.com/avalanche/0xae427ad7a54f5490ef76b3bde3663b0e45c7a102', //https://dexscreener.com/avalanche/0x10e882acfae3cf63e96741fabc41c19025e7be2a
  getPrice: getGSharePrice,
};

//export const BSC_PRICE_TOKENS = [PRICE_INFO_AMES, PRICE_INFO_ASHARE];
export const AVALANCHE_PRICE_TOKENS = [PRICE_INFO_GRAVE, PRICE_INFO_GSHARE];
