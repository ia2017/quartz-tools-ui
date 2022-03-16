import { ChainZapInfo, IZapPool } from 'src/lib/types/zap.types';
import { UST_INPUT_OPTION } from '../common/zap-input-options';
import { TOKENS } from '../tokens';

import { DFK_ROUTER_HARMONY } from './contract-addresses';
import { PAIR_UST_JEWEL_ADDRESS_HARMONY } from './pair-addresses';

// export const ZAP_UST_JEWEL_HARMONY: IZapPool = {
//   active: true,
//   name: 'JEWEL-UST',
//   // zapInWithPath parameters
//   pairAddress: PAIR_UST_JEWEL_ADDRESS_HARMONY,
//   token0: null,
//   token1: null,
//   routerAddress: DFK_ROUTER_HARMONY,
//   pair: null,
//   tokenInAddress: null, // selected by user
//   tokenInAmount: null,
//   tokenInAmountBN: null,
//   logoPath:
//     'https://assets.coingecko.com/coins/images/18570/small/fAisLIV.png?1632449282',
//   tokenInputOptions: [
//     {
//       ...UST_INPUT_OPTION,
//       address: TOKENS.UST.HARMONY,
//       pathTokenInToLp0: [TOKENS.UST.HARMONY],
//       pathTokenInToLp1: [TOKENS.UST.HARMONY, TOKENS.JEWEL.HARMONY],
//     },
//   ],
// };

export const ZAPS_HARMONY: ChainZapInfo = {
  ZAPS: [],
};
