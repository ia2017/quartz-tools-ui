import {
  ChainZapInfo,
  IZapPool,
  TokenInputOption,
  TokenZapPathMap,
} from 'src/lib/types/zap.types';
import { TOKENS } from '../tokens';
import { PANCAKESWAP_ROUTER_ADDRESS } from './bsc-addresses';
import { PAIR_UST_AMETHYST_BSC } from './pairs';

// UI input options for zapping in
export const ZAP_IN_TOKEN_OPTIONS_BSC: TokenInputOption[] = [
  {
    tokenName: 'UST',
    address: TOKENS.UST.BSC,
    logoPath: TOKENS.UST.logoPath,
  },
  {
    tokenName: 'AHARE',
    address: TOKENS.ASHARE.BSC,
    logoPath: TOKENS.ASHARE.logoPath,
  },
  {
    tokenName: 'BNB',
    address: TOKENS.BNB.BSC,
    logoPath: TOKENS.BNB.logoPath,
  },
  {
    tokenName: 'BUSD',
    address: TOKENS.BUSD.BSC,
    logoPath: TOKENS.BUSD.logoPath,
  },
];

const ZAP_IN_PATHS_BSC: TokenZapPathMap = {
  [TOKENS.UST.BSC]: [],
  [TOKENS.ASHARE.BSC]: [],
  [TOKENS.BNB.BSC]: [],
  [TOKENS.BUSD.BSC]: [],
};

export const ZAP_UST_AMES_BSC: IZapPool = {
  active: true,
  name: 'AMES-UST',
  // zapInWithPath parameters
  pairAddress: PAIR_UST_AMETHYST_BSC,
  token0: null,
  token1: null,
  routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
  pair: null,
  tokenInAddress: null, // selected by user
  tokenInAmount: null,
  logoPath: 'assets/ames-ust-lp-logo.svg',
  path: [],
};

export const ZAPS_BSC: ChainZapInfo = {
  PATHS: ZAP_IN_PATHS_BSC,
  ZAPS: [ZAP_UST_AMES_BSC],
  ZAP_IN_TOKEN_OPTIONS: ZAP_IN_TOKEN_OPTIONS_BSC,
};
