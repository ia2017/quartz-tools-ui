import { IZapPool } from 'src/lib/types/zap.types';
import {
  createDefaultZapPool,
  createERC20TokenContract,
} from 'src/lib/utils/contract.utils';
import { PAIR_QUARTZ_UST_ADDRESS_HARMONY } from './pair-addresses';

export const ZAP_QUARTS_UST_HARMONY: IZapPool = createDefaultZapPool(
  'Quartz-UST',
  PAIR_QUARTZ_UST_ADDRESS_HARMONY,
  '',
  '',
  []
);

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
