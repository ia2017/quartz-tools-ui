import { BigNumber } from 'ethers';
import { FormattedResult } from '../utils/formatting';

export interface TokenMarketData {
  usd: number;
  last_updated_at?: number;
  usd_24h_change?: number;
  usd_24h_vol?: number;
}

export interface TokenBaseConfig {
  coinGeckoId: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
  image?: {
    thumb: string;
    small: string;
    large: string;
  };
  categories?: string[];
  categoryLabel?: string;
  currentPrice?: number;
  projectSiteURL?: string;
  marketData?: TokenMarketData;
  meta?: any;
}

export interface IERC20 {
  name: () => Promise<string>;
  decimals: () => Promise<number>;
  allowance: (owner: string, spender: string) => Promise<FormattedResult>;
  approve: (spender: string, amount: BigNumber) => Promise<void>;
  balanceOf: (who: string) => Promise<FormattedResult>;
}

export interface IPair extends IERC20 {
  token0: () => Promise<string>;
  token1: () => Promise<string>;
}

export interface TokenPriceInfo {
  price: number;
  imgPath: string;
  priceLink: string;
  getPrice: () => Promise<number>;
}
