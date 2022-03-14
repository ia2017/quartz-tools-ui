import {
  ChainZapInfo,
  IZapPool,
  TokenInputOption,
  TokenZapPathMap,
} from 'src/lib/types/zap.types';
import { TOKENS } from '../tokens';

import { DFK_ROUTER_HARMONY } from './contract-addresses';
import { PAIR_UST_JEWEL_ADDRESS_HARMONY } from './pair-addresses';

// UI input options for zapping in
export const ZAP_IN_TOKEN_OPTIONS_HARMONY: TokenInputOption[] = [
  {
    tokenName: 'UST',
    address: TOKENS.UST.HARMONY,
    logoPath: TOKENS.UST.logoPath,
  },
];

const ZAP_IN_PATHS_HARMONY: TokenZapPathMap = {
  [TOKENS.UST.HARMONY]: [],
};

export const ZAP_UST_JEWEL_HARMONY: IZapPool = {
  active: true,
  name: 'JEWEL-UST',
  // zapInWithPath parameters
  pairAddress: PAIR_UST_JEWEL_ADDRESS_HARMONY,
  token0: null,
  token1: null,
  routerAddress: DFK_ROUTER_HARMONY,
  pair: null,
  tokenInAddress: null, // selected by user
  tokenInAmount: null,
  tokenInAmountBN: null,
  logoPath:
    'https://assets.coingecko.com/coins/images/18570/small/fAisLIV.png?1632449282',
  path: [],
  pathsFromTokenIn: {
    [TOKENS.UST.HARMONY]: [TOKENS.UST.HARMONY, TOKENS.JEWEL.HARMONY],
  },
};

export const ZAPS_HARMONY: ChainZapInfo = {
  PATHS: ZAP_IN_PATHS_HARMONY,
  ZAPS: [ZAP_UST_JEWEL_HARMONY],
  ZAP_IN_TOKEN_OPTIONS: ZAP_IN_TOKEN_OPTIONS_HARMONY,
};
