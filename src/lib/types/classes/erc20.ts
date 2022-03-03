import { ethers } from 'ethers';
import { ERC20_ABI } from 'src/lib/abis/erc20-abi';
import { IERC20 } from '../token.types';
import { ERC20TokenBase } from './erc20-token-base';

export class ERC20 extends ERC20TokenBase implements IERC20 {
  constructor(address: string, signer: ethers.Signer) {
    super(address, ERC20_ABI, signer);
  }
}
