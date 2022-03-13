import { ERC20 } from 'src/lib/types/classes/erc20';
import { IZapPool } from 'src/lib/types/zap.types';
import { TOKENS } from '../tokens';
import { PANCAKESWAP_ROUTER_ADDRESS } from './bsc-addresses';
import { PAIR_UST_AMETHYST_BSC } from './pairs';

// UI input options for zapping in
export const ZAP_INPUT_TOKENS_BSC: string[] = [
  TOKENS.UST.BSC,
  TOKENS.ASHARE.BSC,
  TOKENS.BNB.BSC,
  TOKENS.BUSD.BSC,
];

const ZAP_IN_PATHS = {
  [TOKENS.UST.BSC]: [],
  [TOKENS.ASHARE.BSC]: [],
  [TOKENS.BNB.BSC]: [],
  [TOKENS.BUSD.BSC]: [],
};

export const ZAP_UST_AMES_BSC: IZapPool = {
  active: true,
  name: 'UST-AMES',
  // zapInWithPath parameters
  pairAddress: PAIR_UST_AMETHYST_BSC,
  token0: null,
  token1: null,
  routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
  path: [],
  pair: null,
  tokenInAddress: null, // selected by user (hard code UST for now?)
  tokenInAmount: null,
  tokenInAmountBN: null,
};

export const ZAPS_BSC = [ZAP_UST_AMES_BSC];
