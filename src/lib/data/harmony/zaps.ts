import { IZapPool } from 'src/lib/types/zap.types';
import {
  createDefaultZapPool,
  createERC20TokenContract,
} from 'src/lib/utils/contract.utils';
import { DFK_ROUTER_HARMONY } from './contract-addresses';
import { PAIR_QUARTZ_UST_ADDRESS_HARMONY } from './pair-addresses';

// export const ZAP_QUARTS_UST_HARMONY: IZapPool = createDefaultZapPool(
//   'Quartz-UST',
//   PAIR_QUARTZ_UST_ADDRESS_HARMONY,
//   DFK_ROUTER_HARMONY,
//   []
// );

export const ZAP_QUARTS_UST_HARMONY: IZapPool = {
  name: 'Quartz-UST',
  // zapInWithPath parameters
  pairAddress: PAIR_QUARTZ_UST_ADDRESS_HARMONY,
  routerAddress: DFK_ROUTER_HARMONY,
  path: [],
  pair: null,
  tokenInAddress: null, // selected by user
  tokenInAmount: null,
  tokenInAmountBN: null,
};

// {
//   name: 'Quartz-UST',
//   token0: createERC20TokenContract(''),
//   token1: createERC20TokenContract(''),

//   // zapInWithPath parameters
//   pairAddress: PAIR_QUARTZ_UST_ADDRESS_HARMONY,
//   tokenInAddress: null, // selected by user
//   tokenInAmount: 0,
//   tokenInAmountBN: null,
//   routerAddress: '',
//   path: [],
// };
