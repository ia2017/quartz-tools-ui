import { ethers } from 'ethers';
import { ERC20_ABI } from '../abis/erc20-abi';
import { UNIV2_PAIR_ABI } from '../abis/UniV2Pair';
import { Pair } from '../types/classes/pair';
import { IERC20, IPair } from '../types/token.types';
import { IZapPool } from '../types/zap.types';

export function createPairContract(
  address: string,
  signer?: ethers.Signer
): IPair & ethers.Contract {
  return <IPair & ethers.Contract>(
    (<unknown>new ethers.Contract(address, UNIV2_PAIR_ABI, signer))
  );
}

export function createERC20TokenContract(
  address: string,
  signer?: ethers.Signer
): IERC20 & ethers.Contract {
  return <IERC20 & ethers.Contract>(
    (<unknown>new ethers.Contract(address, ERC20_ABI, signer))
  );
}
