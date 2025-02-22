import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import { VAULTS } from 'src/lib/data/vaults';
import { ERC20 } from 'src/lib/types/classes/erc20';
import { ERC20TokenBase } from 'src/lib/types/classes/erc20-token-base';
import { IVault } from 'src/lib/types/vault.types';
import {
  ensureEtherFormat,
  FormattedResult,
  roundDecimals,
} from 'src/lib/utils/formatting';
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
      // Will handle single stake and pairs just the same
      const tokenContract = new ERC20TokenBase(
        vault.lpAddress,
        ['function allowance(address, address) public view returns(uint256)'],
        this.web3.web3Info.signer
      );
      // Check/set allowance for vault pair
      const allowance = await tokenContract.allowance(
        this.web3.web3Info.userAddress,
        vault.vaultAddress
      );
      if (allowance.value.gt(ethers.constants.Zero)) {
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
          'function protocolWithdrawalFee() view returns (uint256)',
        ],
        this.web3.web3Info.provider
      );

      const promises = [
        vault.contract.name(),
        vault.contract.symbol(),
        vault.strategyContract.paused(),
        vault.strategyContract.withdrawalFee(),
      ];

      // Get/set basic vault token info
      const [name, symbol, paused, withdrawalFee] = await Promise.all(promises);

      if (vault.isV2) {
        const promises = [
          vault.strategyContract.protocolWithdrawalFee(),
          vault.contract.depositLimitsEnabled(),
          vault.contract.userDepositLimit(),
          vault.contract.totalDepositLimit(),
          vault.contract.balance(),
        ];
        const [
          protocolWithdrawalFee,
          depositLimitsEnabled,
          userDepositLimit,
          totalDepositLimit,
          depositBalance,
        ] = await Promise.all(promises);

        vault.strategy.protocolWithdrawFee = protocolWithdrawalFee / 10;
        vault.depositLimitsEnabled = depositLimitsEnabled;
        vault.userDepositLimit = userDepositLimit / 10e17;
        vault.totalDepositLimit = totalDepositLimit / 10e17;
        const fmt = new FormattedResult(depositBalance);
        vault.depositBalance = Math.round(fmt.toNumber());
        //vault.depositBalance = 2000;

        // if (vault.depositBalance >= vault.totalDepositLimit) {
        //   vault.depositBalance = vault.totalDepositLimit;
        //   vault.depositLimitReached = true;
        // }
      }

      if (vault.protocolVersion) {
        const protocolWithdrawalFee =
          await vault.strategyContract.protocolWithdrawalFee();
        vault.strategy.protocolWithdrawFee = protocolWithdrawalFee / 10;
      }

      vault.tokenName = name;
      vault.symbol = symbol;
      vault.strategy.paused = paused;
      vault.strategy.withdrawlFee = withdrawalFee.toNumber() / 1000;
    } catch (error) {
      console.error(error);
      this._error.next(new Error(`Error initializing vault: ${vault.name}`));
    }
  }

  async deposit(vault: IVault, amount: ethers.BigNumber, initVaults = true) {
    try {
      return await this._deposit(vault, amount, initVaults);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Vault deposit Error'));
    }
  }

  async depositAll(vault: IVault, initVaults = true) {
    try {
      return await this._deposit(vault, vault.walletBalanceBN, initVaults);
    } catch (error) {
      console.error(error);
      this._error.next(new Error('Vault deposit Error'));
    }
  }

  private async _deposit(
    vault: IVault,
    amountIn: ethers.BigNumber,
    initVaults: boolean
  ) {
    try {
      if (amountIn.isZero()) {
        this._error.next(new Error("Can't deposit zero"));
        return;
      }

      amountIn = ensureEtherFormat(amountIn);
      console.log(amountIn.toString());

      await this.approveVaultIfNeeded(vault, amountIn, vault.lpAddress);
      const vaultContract = this.getVaultInstance(vault.vaultAddress);
      const depositTx = await vaultContract.deposit(amountIn);
      const txReceipt = await awaitTransactionComplete(depositTx);
      this._operationActive.next('Vault deposit complete');
      if (initVaults) {
        await this.initVaults(this.web3.web3Info.chainId);
      }

      return txReceipt;
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
    erc20Address: string
  ) {
    try {
      this._operationActive.next('Checking allowances..');
      const token = new ERC20(erc20Address, this.web3.web3Info.signer);
      const allowance = await token.allowance(
        this.web3.web3Info.userAddress,
        vault.vaultAddress
      );
      if (allowance.value.lt(amount)) {
        await this.approveVault(vault);
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
      // Will handle single stake and pairs just the same
      const tokenContract = new ethers.Contract(
        vault.lpAddress,
        ['function approve(address, uint256) public returns(bool)'],
        this.web3.web3Info.signer
      );
      const tx = await tokenContract.approve(vault.vaultAddress, amount);
      await awaitTransactionComplete(tx);
      vault.contractApproved = true;
      this._operationActive.next('Approvals complete.');
    } catch (error) {
      console.error(error);
    }
  }

  private getVaultInstance(address: string) {
    return new ethers.Contract(address, VAULT_ABI, this.web3.web3Info.signer);
  }
}
