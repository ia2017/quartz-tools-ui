import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
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

  private _init = new BehaviorSubject<boolean>(false);
  get init() {
    return this._init.asObservable();
  }

  private _operationActive = new Subject<string>();
  get operationActive() {
    return this._operationActive.asObservable();
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

  async deposit(vault: IVault, amount: number) {
    try {
      const amountBN = ethers.BigNumber.from(amount);
      // Convert to percentage
      const amountIn = vault.walletBalanceBN.mul(amountBN).div(100);
      await this._deposit(vault, amountIn);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Deposit Error'));
    }
  }

  async depositAll(vault: IVault) {
    try {
      // if (vault.walletBalanceBN.isZero()) {
      //   this._error.next(new Error("Can't deposit zero"));
      //   return;
      // }
      // const pair = this.tokens.getTokenContract(vault.lpAddress);
      // await this.approveVaultIfNeeded(vault, vault.walletBalanceBN, pair);
      // const vaultContract = this.getVaultInstance(vault.vaultAddress);
      // const depositTx = await this._deposit(vault, vault.walletBalanceBN);
      //await awaitTransactionComplete(depositTx);

      await this._deposit(vault, vault.walletBalanceBN);
    } catch (error) {}
  }

  private async _deposit(vault: IVault, amountIn: ethers.BigNumber) {
    try {
      if (vault.walletBalanceBN.isZero() || amountIn.isZero()) {
        this._error.next(new Error("Can't deposit zero"));
        return;
      }

      this._operationActive.next('Depositing..');
      const pair = this.tokens.getTokenContract(vault.lpAddress);
      const balanceGucci = await this.userHasSufficientBalance(amountIn, pair);
      if (!balanceGucci) {
        this._error.next(new Error('User balance too low'));
        return;
      }
      await this.approveVaultIfNeeded(vault, amountIn, pair);
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const depositTx = await vaultContract.deposit(amountIn);
      await awaitTransactionComplete(depositTx);
      this._operationActive.next('Deposit complete.');
      await this.initVaults();
    } catch (error) {
      throw error;
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
    amount: ethers.BigNumber,
    pair: ethers.Contract
  ) {
    try {
      this._operationActive.next('Checking allowances..');
      const allowance = await pair.allowance(
        this.web3.web3Info.userAddress,
        vault.vaultAddress
      );
      if (allowance.lt(amount)) {
        // Get user approval for LP pair for vault contract
        this._operationActive.next('Awaiting approvals..');
        const tx = await pair.approve(
          vault.vaultAddress,
          ethers.constants.MaxUint256
        );

        await awaitTransactionComplete(tx);
        this._operationActive.next('Approvals complete.');
      }
    } catch (error) {
      throw error;
    }
  }

  async approveVault(
    vault: IVault,
    amount: ethers.BigNumber = ethers.constants.MaxUint256
  ) {
    try {
      this._operationActive.next('Approving contract...');
      const pair = this.tokens.getTokenContract(vault.lpAddress);
      const tx = await pair.approve(vault.vaultAddress, amount);
      await awaitTransactionComplete(tx);
      vault.contractApproved = true;
      this._operationActive.next('Approvals complete.');
    } catch (error) {
      console.error(error);
    }
  }

  private async userHasSufficientBalance(
    amountIn: ethers.BigNumber,
    pair: ethers.Contract
  ): Promise<boolean> {
    try {
      const userBalance: ethers.BigNumber = await pair.balanceOf(
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

  reloadVault(vault: IVault) {
    //
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
      const userLpDepositBalance: ethers.BigNumber = await v.contract.balanceOf(
        this.web3.web3Info.userAddress
      );
      v.userLpDepositBalance = userLpDepositBalance.isZero()
        ? 0
        : new FormattedResult(userLpDepositBalance).toNumber();
      v.userLpDepositBalanceBN = userLpDepositBalance;
      const [name, symbol] = await Promise.all([
        v.contract.name(),
        v.contract.symbol(),
      ]);
      v.tokenName = name;
      v.symbol = symbol;

      const vaultPair = this.tokens.getTokenContract(vault.lpAddress);
      const allowance: ethers.BigNumber = await vaultPair.allowance(
        this.web3.web3Info.userAddress,
        vault.vaultAddress
      );

      if (allowance.gt(ethers.constants.Zero)) {
        v.contractApproved = true;
      }

      vaults.push(v);
    }

    this._vaults.next(vaults);

    this._init.next(true);
  }
}
