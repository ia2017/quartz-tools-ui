import { ethers } from 'ethers';
import { ERC20_ABI } from 'src/lib/abis/erc20-abi';

// QUARTZ.DEFI
export const QSHARE_TOKEN_ADDRESS_HARMONY =
  '0xfa4b16b0f63f5a6d0651592620d585d308f749a4';
export const QUARTZ_TOKEN_ADDRESS_HARMONY =
  '0xb9e05b4c168b56f73940980ae6ef366354357009';
export const QBOND_ADDRESS_HARMONY =
  '0x5A12bc3Ad86c674a50fae82510DcB03751ab218b';
export const QSHARE_REWARD_POOL_HARMONY =
  '0x1da194F8baf85175519D92322a06b46A2638A530';

// QUARTZ DFK LP's
export const QUARTZ_UST_DFK_LP_ADDRESS =
  '0x90a48cb3a724ef6f8e6240f4788559f6370b6925';
export const QSHARE_ONE_DFK_LP_ADDRESS =
  '0x157e2E205b8d307501F1AAd1C5C96c562e6f07c5';
export const QUARTZ_QSHARE_DFK_LP_ADDRESS =
  '0x3736B5B6f2033433Ea974e121cE19cc6d0E10DC9';

// DFK
export const DFK_ROUTER_HARMONY = '0x24ad62502d1c652cc7684081169d04896ac20f30';
export const HARMONY_wONE_ADDRESS =
  '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a';
export const JEWEL_ADDRESS = '0x72Cb10C6bfA5624dD07Ef608027E366bd690048F';
export const UST_ADDRESS = '0x224e64ec1BDce3870a6a6c777eDd450454068FEC';
export const USDC_ADDRESS = '0x985458E523dB3d53125813eD68c274899e9DfAb4';

export let QuartzToken = new ethers.Contract(
  QUARTZ_TOKEN_ADDRESS_HARMONY,
  ERC20_ABI
);
export let QShareToken = new ethers.Contract(
  QSHARE_TOKEN_ADDRESS_HARMONY,
  ERC20_ABI
);
export let UstToken = new ethers.Contract(UST_ADDRESS, ERC20_ABI);
export let UsdcToken = new ethers.Contract(USDC_ADDRESS, ERC20_ABI);
export let JewelToken = new ethers.Contract(JEWEL_ADDRESS, ERC20_ABI);
export let wOneToken = new ethers.Contract(HARMONY_wONE_ADDRESS, ERC20_ABI);
