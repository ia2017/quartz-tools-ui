import { ethers } from 'ethers';
import { FormattedResult } from 'src/lib/utils/formatting';
import { awaitTransactionComplete } from 'src/lib/utils/web3-utils';
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
    return new FormattedResult(await this.contract.allowance(owner, spender));
  }

  async approve(spender: string, amount: ethers.BigNumber) {
    try {
      const tx = await this.contract.approve(spender, amount);
      await awaitTransactionComplete(tx);
    } catch (error) {
      throw error;
    }
  }

  async balanceOf(who: string) {
    return new FormattedResult(await this.contract.balanceOf(who));
  }

  async totalSupply() {
    return new FormattedResult(await this.contract.totalSupply());
  }
}
