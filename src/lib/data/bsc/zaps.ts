import {
  ChainZapInfo,
  IZapPool,
  TokenInputOption,
  TokenZapPathMap,
} from 'src/lib/types/zap.types';
import {
  ASHARE_INPUT_OPTION,
  UST_INPUT_OPTION,
} from '../common/zap-input-options';
import { TOKENS } from '../tokens';
import { PANCAKESWAP_ROUTER_ADDRESS } from './bsc-addresses';
import {
  PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
  PAIR_UST_AMETHYST_BSC,
} from './pairs';

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
  tokenInputOptions: [
    {
      ...UST_INPUT_OPTION,
      address: TOKENS.UST.BSC,
      pathTokenInToLp0: [],
      pathTokenInToLp1: [],
    },
  ],
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
  tokenInputOptions: [
    {
      ...ASHARE_INPUT_OPTION,
      address: TOKENS.ASHARE.BSC,
      pathTokenInToLp0: [TOKENS.ASHARE.BSC, TOKENS.AMETHYST.BSC],
      pathTokenInToLp1: [TOKENS.ASHARE.BSC],
    },
  ],
};

export const ZAPS_BSC: ChainZapInfo = {
  ZAPS: [ZAP_UST_AMES_BSC, ZAP_AMES_ASHARE_BSC],
};
