import { Component, Input, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { ethers } from 'ethers';
import { StatsService } from 'src/lib/services/stats/stats.service';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { IVault } from 'src/lib/types/vault.types';

@Component({
  selector: 'quartz-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
})
export class VaultComponent {
  @Input() vault: IVault;

  @ViewChild('depositInput', {
    read: MatInput,
    static: true,
  })
  depositInput: MatInput;
  @ViewChild('withdrawInput', {
    read: MatInput,
    static: true,
  })
  withdrawInput: MatInput;

  constructor(
    public readonly vaultService: VaultService,
    private readonly vaultStats: StatsService
  ) {}

  async ngOnInit() {
    this.resetInputs();
    const tvl = await this.vaultStats.getVaultTVL(this.vault);
    console.log(tvl.toNumber());
    this.vault.totalValueLocked = tvl.toNumber();
  }

  private resetInputs() {
    this.depositInput.value = '0';
    this.withdrawInput.value = '0';
  }

  async setVaultDeposit() {
    this.vault.loading = true;
    console.log(this.depositInput.value);
    await this.vaultService.deposit(
      this.vault,
      ethers.utils.parseUnits(this.depositInput.value)
    );
    this.resetInputs();
    this.vault.loading = false;
  }

  async setVaultDepositAll() {
    this.vault.loading = true;
    await this.vaultService.depositAll(this.vault);
    this.resetInputs();
    this.vault.loading = false;
  }

  async setVaultWithdraw() {
    this.vault.loading = true;
    await this.vaultService.withdraw(
      this.vault,
      ethers.utils.parseUnits(this.withdrawInput.value)
    );
    this.vault.loading = false;
    this.resetInputs();
  }

  async setVaultWithdrawAll() {
    this.vault.loading = true;
    await this.vaultService.withdrawAll(this.vault);
    this.vault.loading = false;
    this.resetInputs();
  }

  async setApproval() {
    this.vault.loading = true;
    await this.vaultService.approveVault(this.vault);
    this.vault.loading = false;
  }

  onDepositSliderInputChange(value: number) {
    if (value === 0) {
      this.depositInput.value = '0';
      return;
    }

    if (value === 100) {
      this.depositInput.value = String(this.vault.userLpWalletBalance);
      return;
    }

    this.depositInput.value = String(
      this.vault.userLpWalletBalance * (value / 100)
    );
  }

  onWithdrawSliderInputChange(value: number) {
    if (value === 0) {
      this.withdrawInput.value = '0';
      return;
    }

    if (value === 100) {
      this.withdrawInput.value = String(this.vault.userLpDepositBalance);
      return;
    }

    this.withdrawInput.value = String(
      this.vault.userLpDepositBalance * (value / 100)
    );
  }
}
