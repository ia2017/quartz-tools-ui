import { IVault } from '../types/vault.types';
import { VAULTS_BSC } from './bsc/vaults';
import { AVALANCHE, BINANCE_SMART_CHAIN, BINANCE_SMART_CHAIN_TESTNET, HARMONY_CHAIN } from './chains';
import { VAULTS_HARMONY } from './harmony/vaults';
import { VAULTS_AVALANCHE } from './avalanche/vaults';

export const VAULTS: { [chainId: number]: IVault[] } = {
  [BINANCE_SMART_CHAIN.chainId]: VAULTS_BSC,
  [HARMONY_CHAIN.chainId]: VAULTS_HARMONY,
  [BINANCE_SMART_CHAIN_TESTNET.chainId]: VAULTS_BSC,
  [AVALANCHE.chainId]: VAULTS_AVALANCHE,
};
