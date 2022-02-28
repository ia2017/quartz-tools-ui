import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { ALL_VAULTS } from 'src/lib/data/vaults';
import { IVault } from 'src/lib/types/vault.types';
import { FormattedResult } from 'src/lib/utils/formatting';
import { awaitTransactionComplete } from 'src/lib/utils/web3-utils';
import { SimpleStateStore } from '../store/simple-state-store';
import { TokenService } from '../tokens/token.service';
import { Web3Service } from '../web3.service';
import { VAULT_ABI } from './vault-abi';

@Injectable({ providedIn: 'root' })
export class VaultService {
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
    private readonly web3: Web3Service,
    private readonly state: SimpleStateStore
  ) {
    this.web3.web3.subscribe((web3Info) => {
      if (web3Info) {
        this.initVaults(web3Info.chainId);
      }
    });
  }

  private async initVaults(chainId: number) {
    try {
      this._init.next(true);
      const chainVaults = ALL_VAULTS[chainId];
      if (!chainVaults) {
        // Do suttin
        // throw new Error(`ChainId: ${chainId} not found`);
        this._error.next(new Error(`Unsupported chainId: ${chainId}`));
        return;
      }

      const vaults = [];
      for (const vault of chainVaults) {
        const v: IVault = {
          ...vault,
        };
        //console.log(this.web3.web3Info.signer);
        v.contract = new ethers.Contract(
          v.vaultAddress,
          VAULT_ABI,
          this.web3.web3Info.signer
        );
        v.strategyContract = new ethers.Contract(
          v.strategy.address,
          [
            'function paused() view returns (bool)',
            'function withdrawalFee() view returns (uint256)',
          ],
          this.web3.web3Info.provider
        );

        // Get/set basic vault token info
        const [name, symbol, getPricePerFullShare, paused, withdrawalFee] =
          await Promise.all([
            v.contract.name(),
            v.contract.symbol(),
            v.contract.getPricePerFullShare(),
            v.strategyContract.paused(),
            v.strategyContract.withdrawalFee(),
          ]);

        v.tokenName = name;
        v.symbol = symbol;
        v.strategy.paused = paused;
        v.strategy.withdrawlFee = withdrawalFee.toNumber() / 100;
        // Check users current LP holdings in wallet
        const bal = await this.getUserBalanceLP(v.lpAddress);
        v.userLpWalletBalance = bal.toNumber();
        v.walletBalanceBN = bal.value;
        // Check/set users current deposits into vault
        const userLpDepositBalance: ethers.BigNumber =
          await v.contract.balanceOf(this.web3.web3Info.userAddress);
        const amountTimesPricePerShare =
          new FormattedResult(userLpDepositBalance).toNumber() *
          new FormattedResult(getPricePerFullShare).toNumber();
        v.userLpDepositBalance = userLpDepositBalance.isZero()
          ? 0
          : amountTimesPricePerShare;
        v.userLpDepositBalanceBN = parseUnits(String(amountTimesPricePerShare));
        // Check/set allowance for vault pair
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

      this.state.setVaults(vaults);
      this._init.next(false);
    } catch (error) {
      console.error(error);
      this._init.next(false);
      this.state.setVaults([]);
      this._error.next(new Error(`Error initializing vaults`));
    }
  }

  async deposit(vault: IVault, amount: ethers.BigNumber) {
    try {
      // const amountBN = ethers.BigNumber.from(amount);
      // // Convert to percentage
      // const amountIn = vault.walletBalanceBN.mul(amountBN).div(100);
      await this._deposit(vault, amount);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Deposit Error'));
    }
  }

  async depositAll(vault: IVault) {
    try {
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
      // const pair = this.tokens.getTokenContract(vault.lpAddress);
      // const balanceGucci = await this.userHasSufficientBalance(amountIn, pair);
      // if (!balanceGucci) {
      //   this._error.next(new Error('User balance too low'));
      //   return;
      // }
      // await this.approveVaultIfNeeded(vault, amountIn, pair);
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const depositTx = await vaultContract.deposit(amountIn);
      await awaitTransactionComplete(depositTx);
      this._operationActive.next('Deposit complete');
      await this.initVaults(this.web3.web3Info.chainId);
    } catch (error) {
      throw error;
    }
  }

  async withdraw(vault: IVault, amount: ethers.BigNumber) {
    try {
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const tx = await vaultContract.withdraw(amount);
      await awaitTransactionComplete(tx);
      await this.initVaults(this.web3.web3Info.chainId);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Withdraw Error'));
    }
  }

  async withdrawAll(vault: IVault) {
    try {
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const tx = await vaultContract.withdrawAll();
      await awaitTransactionComplete(tx);
      await this.initVaults(this.web3.web3Info.chainId);
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
      this._operationActive.next(null);
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
      // this._operationActive.next('Approvals complete.');
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
    const balance: ethers.BigNumber = await pair.balanceOf(
      this.web3.web3Info.userAddress
    );
    return new FormattedResult(balance);
  }

  // TODO:
  reloadVault(vault: IVault) {
    //
  }
}
