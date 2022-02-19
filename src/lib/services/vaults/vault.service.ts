import { Injectable } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { IVault, VAULTS } from 'src/lib/data/vaults';
import { FormattedResult } from 'src/lib/utils/formatting';
import { awaitTransactionComplete } from 'src/lib/utils/web3-utils';
import { TokenService } from '../tokens/token.service';
import { Web3Service } from '../web3.service';
import { VAULT_ABI } from './vault-abi';

@Injectable({ providedIn: 'root' })
export class VaultService {
  private _vaults = new BehaviorSubject<IVault[]>([]);
  get vaults() {
    return this._vaults.asObservable();
  }

  private _operationComplete = new Subject<true>();
  get operationComplete() {
    return this._operationComplete.asObservable();
  }

  private _error = new Subject<Error>();
  get error() {
    return this._error.asObservable();
  }

  constructor(
    private readonly tokens: TokenService,
    private readonly web3: Web3Service
  ) {
    this.initVaults();
  }

  async deposit(vault: IVault) {
    try {
      if (vault.walletBalanceBN.isZero()) {
        this._error.next(new Error('User balance too low'));
        return;
      }
      const amountIn = vault.walletBalanceBN;
      const pair = this.tokens.getTokenContract(vault.lpAddress);
      const balanceGucci = await this.userHasSufficientBalance(amountIn, pair);
      console.log(balanceGucci);
      if (!balanceGucci) {
        this._error.next(new Error('User balance too low'));
        return;
      }
      await this.approveVaultIfNeeded(vault, amountIn, pair);

      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const depositTx = await vaultContract.deposit(amountIn);
      await awaitTransactionComplete(depositTx);
      await this.initVaults();
      this._operationComplete.next(true);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Deposit Error'));
    }
  }

  async withdrawAll(vault: IVault) {
    try {
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const tx = await vaultContract.withdrawAll();
      await awaitTransactionComplete(tx);
      await this.initVaults();
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Withdraw Error'));
    }
  }

  private async approveVaultIfNeeded(
    vault: IVault,
    amount: BigNumber,
    pair: ethers.Contract
  ) {
    try {
      const allowance = await pair.allowance(
        this.web3.web3Info.userAddress,
        vault.vaultAddress
      );
      if (allowance.lt(amount)) {
        // Get user approval for LP pair for vault contract
        const tx = await pair.approve(
          vault.vaultAddress,
          ethers.constants.MaxUint256
        );
        await awaitTransactionComplete(tx);
      }
    } catch (error) {
      throw error;
    }
  }

  private async userHasSufficientBalance(
    amountIn: BigNumber,
    pair: ethers.Contract
  ): Promise<boolean> {
    try {
      const userBalance: BigNumber = await pair.balanceOf(
        this.web3.web3Info.userAddress
      );
      if (userBalance.gte(amountIn)) {
        return true;
      }

      return false;
    } catch (error) {
      this._error.next(error);
    }
  }

  private getVaultInstance(address: string) {
    return new ethers.Contract(address, VAULT_ABI, this.web3.web3Info.signer);
  }

  private async getUserBalanceLP(lpAddress: string) {
    const pair = this.tokens.getTokenContract(lpAddress);
    const balance = await pair.balanceOf(this.web3.web3Info.userAddress);
    return new FormattedResult(balance);
  }

  private async initVaults() {
    const vaults = [];
    for (const vault of VAULTS) {
      const v: IVault = {
        ...vault,
      };
      v.contract = new ethers.Contract(
        v.vaultAddress,
        VAULT_ABI,
        this.web3.web3Info.signer
      );
      const bal = await this.getUserBalanceLP(v.lpAddress);
      v.userLpWalletBalance = bal.toNumber();
      v.walletBalanceBN = bal.value;
      const userLpDepositBalance: BigNumber = await v.contract.balanceOf(
        this.web3.web3Info.userAddress
      );
      v.userLpDepositBalance = userLpDepositBalance.isZero()
        ? 0
        : new FormattedResult(userLpDepositBalance).toNumber();
      v.userLpDepositBalanceBN = userLpDepositBalance;
      v.tokenName = await v.contract.name();
      vaults.push(v);
    }

    this._vaults.next(vaults);
  }
}
