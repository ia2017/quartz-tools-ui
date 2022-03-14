import {
  ChainZapInfo,
  IZapPool,
  TokenInputOption,
  TokenZapPathMap,
} from 'src/lib/types/zap.types';
import { TOKENS } from '../tokens';
import { PANCAKESWAP_ROUTER_ADDRESS } from './bsc-addresses';
import {
  PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
  PAIR_UST_AMETHYST_BSC,
} from './pairs';

const UST_INPUT_OPTION: TokenInputOption = {
  tokenName: 'UST',
  address: TOKENS.UST.BSC,
  logoPath: TOKENS.UST.logoPath,
};

const ASHARE_INPUT_OPTION: TokenInputOption = {
  tokenName: 'AHARE',
  address: TOKENS.ASHARE.BSC,
  logoPath: TOKENS.ASHARE.logoPath,
};

// UI input options for zapping in
// export const ZAP_IN_TOKEN_OPTIONS_BSC: TokenInputOption[] = [
//   UST_INPUT_OPTION,
//   ASHARE_INPUT_OPTION,
//   {
//     tokenName: 'BNB',
//     address: TOKENS.BNB.BSC,
//     logoPath: TOKENS.BNB.logoPath,
//   },
//   {
//     tokenName: 'BUSD',
//     address: TOKENS.BUSD.BSC,
//     logoPath: TOKENS.BUSD.logoPath,
//   },
// ];

// const ZAP_IN_PATHS_BSC: TokenZapPathMap = {
//   [TOKENS.UST.BSC]: [],
//   [TOKENS.ASHARE.BSC]: [],
//   [TOKENS.BNB.BSC]: [],
//   [TOKENS.BUSD.BSC]: [],
// };

export const ZAP_UST_AMES_BSC: IZapPool = {
  active: true,
  name: 'AMES-UST',
  pairAddress: PAIR_UST_AMETHYST_BSC,
  token0: null,
  token1: null,
  routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
  pair: null,
  tokenInAddress: null,
  tokenInAmount: null,
  logoPath: 'assets/ames-ust-lp-logo.svg',
  path: [],
  tokenInputOptions: [UST_INPUT_OPTION],
  pathsFromTokenIn: {
    // UST -> AMES
    [TOKENS.UST.BSC]: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
  },
};

export const ZAP_AMES_ASHARE_BSC: IZapPool = {
  active: true,
  name: 'AMES-ASHARE',
  pairAddress: PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
  token0: null,
  token1: null,
  routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
  pair: null,
  tokenInAddress: null,
  tokenInAmount: null,
  logoPath: 'assets/ames-ashare-lp-logo.svg',
  path: [],
  tokenInputOptions: [ASHARE_INPUT_OPTION],
  pathsFromTokenIn: {
    // ASHARE -> AMES
    [TOKENS.ASHARE.BSC]: [TOKENS.ASHARE.BSC, TOKENS.AMETHYST.BSC],
  },
};

export const ZAPS_BSC: ChainZapInfo = {
  PATHS: {},
  ZAPS: [ZAP_UST_AMES_BSC, ZAP_AMES_ASHARE_BSC],
  ZAP_IN_TOKEN_OPTIONS: [],
};
