import { Component, Input, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { ethers } from 'ethers';
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

  constructor(public readonly vaultService: VaultService) {}

  ngOnInit() {
    this.depositInput.value = '0';
    this.withdrawInput.value = '0';
  }

  ngAfterViewInit() {}

  async setVaultDeposit() {
    this.vault.loading = true;
    console.log(this.depositInput.value);
    // await this.vaultService.deposit(this.vault, this.depositValue);
    // this.depositInput.value = '0';
    // this.vault.loading = false;
  }

  async setVaultDepositAll() {
    this.vault.loading = true;
    await this.vaultService.depositAll(this.vault);
    this.depositInput.value = '0';
    this.vault.loading = false;
  }

  async setVaultWithdraw() {
    console.log(this.withdrawInput.value);
    this.vault.loading = true;
    await this.vaultService.withdraw(
      this.vault,
      ethers.utils.parseUnits(this.withdrawInput.value)
    );
    this.vault.loading = false;
    this.withdrawInput.value = '0';
  }

  async setVaultWithdrawAll() {
    this.vault.loading = true;
    await this.vaultService.withdrawAll(this.vault);
    this.vault.loading = false;
    this.withdrawInput.value = '0';
  }

  async setApproval() {
    this.vault.loading = true;
    await this.vaultService.approveVault(this.vault);
    this.vault.loading = false;
  }

  onDepositSliderChange(value: number) {
    console.log('Deposit slider change');
    console.log(value);
  }

  onDepositSliderInputChange(value: number) {
    console.log('Deposit slider input change');
    console.log(value);
  }

  onWithdrawSliderInputChange(value: number) {
    this.withdrawInput.value = String(this.getWithdrawValue(value));
  }

  private getWithdrawValue(value: number) {
    if (value === 0) {
      return 0;
    }

    if (value === 100) {
      return this.vault.userLpDepositBalance;
    }
    const valuePerent = value / 100;
    const balancePercent = this.vault.userLpDepositBalance * valuePerent;
    return balancePercent;
  }
}
