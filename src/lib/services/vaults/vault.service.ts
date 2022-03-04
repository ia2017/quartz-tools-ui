import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import { VAULTS } from 'src/lib/data/vaults';
import { IVault } from 'src/lib/types/vault.types';
import { FormattedResult, roundDecimals } from 'src/lib/utils/formatting';
import { awaitTransactionComplete } from 'src/lib/utils/web3-utils';
import { StatsService } from '../stats/stats.service';
import { TokenService } from '../tokens/token.service';
import { Web3Service } from '../web3.service';
import { VAULT_ABI } from './vault-abi';

@Injectable({ providedIn: 'root' })
export class VaultService {
  private _init = new BehaviorSubject<boolean>(false);
  get init() {
    return this._init.asObservable();
  }

  private _vaults = new BehaviorSubject<IVault[]>([]);
  get vaults() {
    return this._vaults.asObservable();
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
    private readonly statService: StatsService
  ) {}

  async initVaults(chainId: number) {
    try {
      this._init.next(true);
      const chainVaults = VAULTS[chainId];
      if (!chainVaults) {
        this._error.next(new Error(`Unsupported chainId: ${chainId}`));
        return;
      }

      if (!chainVaults.length) {
        this._vaults.next([]);
        this._init.next(false);
        return;
      }

      const vaults = [];
      for (const vault of chainVaults) {
        const vaultRef: IVault = {
          ...vault,
        };

        await this._initVaultFields(vaultRef);
        await this.statService.setVaultUserStats(
          vaultRef,
          this.web3.web3Info.userAddress
        );
        await this._setVaultAllowance(vaultRef);
        vaults.push(vaultRef);
      }

      this._vaults.next(vaults);
      this._init.next(false);
    } catch (error) {
      console.error(error);
      this._init.next(false);
      this._vaults.next([]);
      this._error.next(new Error(`Error initializing vaults`));
    }
  }

  private async _setVaultAllowance(vault: IVault) {
    try {
      // Check/set allowance for vault pair
      const vaultPair = this.tokens.getTokenContract(vault.lpAddress);
      const allowance: ethers.BigNumber = await vaultPair.allowance(
        this.web3.web3Info.userAddress,
        vault.vaultAddress
      );
      if (allowance.gt(ethers.constants.Zero)) {
        vault.contractApproved = true;
      }
    } catch (error) {
      throw error;
    }
  }

  private async _initVaultFields(vault: IVault) {
    try {
      vault.contract = new ethers.Contract(
        vault.vaultAddress,
        VAULT_ABI,
        this.web3.web3Info.signer
      );

      vault.strategyContract = new ethers.Contract(
        vault.strategy.address,
        [
          'function paused() view returns (bool)',
          'function withdrawalFee() view returns (uint256)',
        ],
        this.web3.web3Info.provider
      );

      // Get/set basic vault token info
      const [name, symbol, paused, withdrawalFee] = await Promise.all([
        vault.contract.name(),
        vault.contract.symbol(),
        vault.strategyContract.paused(),
        vault.strategyContract.withdrawalFee(),
      ]);

      vault.tokenName = name;
      vault.symbol = symbol;
      vault.strategy.paused = paused;
      vault.strategy.withdrawlFee = withdrawalFee.toNumber() / 1000;
    } catch (error) {
      this._error.next(new Error(`Error initializing vault: ${vault.name}`));
    }
  }

  async deposit(vault: IVault, amount: ethers.BigNumber) {
    try {
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
      const pair = this.tokens.getTokenContract(vault.lpAddress);
      await this.approveVaultIfNeeded(vault, amountIn, pair);
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
}
