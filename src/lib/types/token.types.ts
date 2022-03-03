import { BigNumber } from 'ethers';

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
  allowance: (owner: string, spender: string) => Promise<BigNumber>;
  approve: (spender: string, amount: BigNumber) => Promise<BigNumber>;
  balanceOf: (who: string) => Promise<BigNumber>;
}

export interface TokenPriceInfo {
  price: number;
  imgPath: string;
  priceLink: string;
  getPrice: () => Promise<number>;
}
