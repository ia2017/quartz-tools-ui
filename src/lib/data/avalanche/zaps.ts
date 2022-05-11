import { ChainZapInfo, IZapPool } from 'src/lib/types/zap.types';
import {
  GSHARE_INPUT_OPTION,
  AVAX_INPUT_OPTION,
} from '../common/zap-input-options';
import { TOKENS } from '../tokens';
import { TRADERJOE_ROUTER_ADDRESS } from './avalanche-addresses';
import {
  PAIR_GRAVE_AVAX_ADDRESS,
  PAIR_GSHARE_AVAX_ADDRESS,
} from './pairs';
import { VAULT_GRAVE_AVAX } from './vaults';

export const ZAP_AVAX_GRAVE_AVALANCHE: IZapPool = {
  active: true,
  name: 'GRAVE-AVAX',
  poolId: 0,
  pairAddress: PAIR_GRAVE_AVAX_ADDRESS,
  token0: null,
  token1: null,
  routerAddress: TRADERJOE_ROUTER_ADDRESS,
  pair: null,
  tokenInAddress: null,
  tokenInAmount: null,
  logoPath: 'assets/logo.a9502d88.svg',
  tokenInputOptions: [
    {
      ...AVAX_INPUT_OPTION,
      address: TOKENS.AVAX.AVALANCHE,
      pathTokenInToLp0: [TOKENS.AVAX.AVALANCHE],
      pathTokenInToLp1: [TOKENS.AVAX.AVALANCHE, TOKENS.GRAVE.AVALANCHE],
    },
    // {
    //   ...BNB_INPUT_OPTION,
    //   address: TOKENS.BNB.BSC,
    //   pathTokenInToLp0: [TOKENS.BNB.BSC, TOKENS.UST.BSC],
    //   pathTokenInToLp1: [TOKENS.BNB.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
    // },
    // {
    //   ...BUSD_INPUT_OPTION,
    //   address: TOKENS.BUSD.BSC,
    //   pathTokenInToLp0: [TOKENS.BUSD.BSC, TOKENS.UST.BSC],
    //   pathTokenInToLp1: [TOKENS.BUSD.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
    // },
  ],
  vault: VAULT_GRAVE_AVAX,
};

// export const ZAP_AMES_ASHARE_BSC: IZapPool = {
//   active: true,
//   name: 'AMES-ASHARE',
//   poolId: 5,
//   pairAddress: PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
//   token0: null,
//   token1: null,
//   routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
//   pair: null,
//   tokenInAddress: null,
//   tokenInAmount: null,
//   logoPath: 'assets/ames-ashare-lp-logo.svg',
//   path: [],
//   tokenInputOptions: [
//     {
//       ...ASHARE_INPUT_OPTION,
//       address: TOKENS.ASHARE.BSC,
//       pathTokenInToLp0: [TOKENS.ASHARE.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [TOKENS.ASHARE.BSC],
//     },
//     {
//       ...UST_INPUT_OPTION,
//       address: TOKENS.UST.BSC,
//       pathTokenInToLp0: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [
//         TOKENS.UST.BSC,
//         TOKENS.AMETHYST.BSC,
//         TOKENS.ASHARE.BSC,
//       ],
//     },
//     {
//       ...BUSD_INPUT_OPTION,
//       address: TOKENS.BUSD.BSC,
//       pathTokenInToLp0: [TOKENS.BUSD.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [
//         TOKENS.BUSD.BSC,
//         TOKENS.UST.BSC,
//         TOKENS.AMETHYST.BSC,
//         TOKENS.ASHARE.BSC,
//       ],
//     },
//   ],
//   vault: VAULT_AMETHYST_ASHARE_BSC,
// };

// export const ZAP_AMES_SINGLE_STAKE_BSC: IZapPool = {
//   active: true,
//   name: 'AMES',
//   poolId: 6,
//   pairAddress: PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
//   token0: null,
//   token1: null,
//   routerAddress: PANCAKESWAP_ROUTER_ADDRESS,
//   pair: null,
//   tokenInAddress: null,
//   tokenInAmount: null,
//   logoPath: 'assets/ames-logo.svg',
//   path: [],
//   tokenInputOptions: [
//     {
//       ...ASHARE_INPUT_OPTION,
//       address: TOKENS.ASHARE.BSC,
//       pathTokenInToLp0: [TOKENS.ASHARE.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [TOKENS.ASHARE.BSC],
//     },
//     {
//       ...UST_INPUT_OPTION,
//       address: TOKENS.UST.BSC,
//       pathTokenInToLp0: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [
//         TOKENS.UST.BSC,
//         TOKENS.AMETHYST.BSC,
//         TOKENS.ASHARE.BSC,
//       ],
//     },
//     {
//       ...BUSD_INPUT_OPTION,
//       address: TOKENS.BUSD.BSC,
//       pathTokenInToLp0: [TOKENS.BUSD.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
//       pathTokenInToLp1: [
//         TOKENS.BUSD.BSC,
//         TOKENS.UST.BSC,
//         TOKENS.AMETHYST.BSC,
//         TOKENS.ASHARE.BSC,
//       ],
//     },
//   ],
// };

export const ZAPS_AVALANCHE: ChainZapInfo = {
  ZAPS: [ZAP_AVAX_GRAVE_AVALANCHE],
};
