import { ethers } from 'ethers';
import { IERC20 } from '../token.types';

export class ERC20TokenBase extends ethers.Contract implements IERC20 {
  private _name: string;
  private _decimals: number;

  public readonly contract: ethers.Contract;

  constructor(address: string, abi: any[], signer: ethers.Signer) {
    super(address, abi, signer);
    this.contract = new ethers.Contract(address, abi, signer);
  }

  async name() {
    if (!this._name) {
      this._name = await this.contract.name();
    }

    return this._name;
  }

  async decimals() {
    if (!this._decimals) {
      this._decimals = await this.contract.decimals();
    }

    return this._decimals;
  }

  async allowance(owner: string, spender: string) {
    return this.contract.allowance(owner, spender);
  }

  async approve(spender: string, amount: ethers.BigNumber) {
    return this.contract.approve(spender, amount);
  }

  async balanceOf(who: string) {
    return this.contract.balanceOf(who);
  }
}
