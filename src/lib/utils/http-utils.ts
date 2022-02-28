import axios from 'axios';
import { TokenBaseConfig, TokenMarketData } from '../types/token.types';
import { roundDecimals } from './formatting';
import { getTokenStorageData, setTokenStorageData } from './storage-utils';

const headers = {
  accept: 'application/json',
};

const axiosConfig = {
  headers,
};

const geckoDataSimpleQueryParams = `
localization=false&
community_data=true&
developer_data=true&
tickers=false
market_data=true
sparkline=false`;

/**
 * Utility to flatten an array over token ids into one API call
 */
export async function getPriceInfoForTokenIdsUtil(tokens: TokenBaseConfig[]) {
  const ids = tokens.map((c) => c.coinGeckoId).join(',');
  return getSingleTokenPrice(ids);
}

/**
 * Utility to flatten an array over token ids into one API call
 */
export async function getMarketDataForTokens(
  tokens: TokenBaseConfig[]
): Promise<{ [id: string]: TokenMarketData }> {
  try {
    const ids = tokens.map((c) => c.coinGeckoId).join(',');
    const { data }: any = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
      axiosConfig
    );
    for (const id in data) {
      const marketData: TokenMarketData = {
        usd: data[id].usd,
        last_updated_at: data[id].last_updated_at,
        usd_24h_change: roundDecimals(data[id].usd_24h_change, 2),
        usd_24h_vol: data[id].usd_24h_vol,
      };

      data[id] = marketData;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getSingleTokenPrice(
  tokenApiID: string
): Promise<TokenMarketData> {
  try {
    const id = tokenApiID.toLowerCase();
    const isStableCoin =
      id === 'terrausd' ||
      id === 'usdt' ||
      id === 'dai' ||
      id === 'busd' ||
      id === 'usd-coin';
    if (isStableCoin) {
      return { usd: 1 };
    }
    const data: any = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenApiID}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`,
      axiosConfig
    );
    return data.data[tokenApiID];
  } catch (error) {
    throw error;
  }
}

export async function getCoinGeckoData(
  coinGeckoId: string,
  skipLocal = false
): Promise<TokenBaseConfig> {
  try {
    const local = await getTokenStorageData<TokenBaseConfig>(coinGeckoId);
    if (local && !skipLocal) {
      console.log('Retrieving from storage.');
      return local;
    }
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinGeckoId}?${geckoDataSimpleQueryParams}`,
      axiosConfig
    );

    const tokenConfig: TokenBaseConfig = {
      coinGeckoId,
      name: data.name,
      symbol: data.symbol.toUpperCase(),
      image: data.image,
      categories: data.categories,
      currentPrice: 0,
      meta: { ...data },
    };

    console.log('Setting local storage data.');
    await setTokenStorageData(coinGeckoId, tokenConfig);
    return tokenConfig;
  } catch (error) {
    throw error;
  }
}
