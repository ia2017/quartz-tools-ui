import axios from 'axios';

const PAIR_INFO_URL = 'https://api.dexscreener.io/latest/dex/pairs/';

export async function getPairInfo(
  chainSymbol: 'bsc' | 'harmony',
  pairAddress: string
) {
  try {
    const req = await axios.get(
      `${PAIR_INFO_URL}${chainSymbol}/${pairAddress}`
    );
    return req.data;
  } catch (error) {
    throw error;
  }
}
