import { Component, Input } from '@angular/core';
import { ethers } from 'ethers';
import { IVault } from 'src/lib/data/vaults';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { FormattedResult } from 'src/lib/utils/formatting';

@Component({
  selector: 'quartz-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
})
export class VaultComponent {
  @Input() vault: IVault;
  depositValue = 0;
  withdrawValue = 0;

  constructor(public readonly vaultService: VaultService) {}

  async setVaultDeposit(vault: IVault) {
    vault.loading = true;
    await this.vaultService.deposit(vault, this.depositValue);
    this.depositValue = 0;
    vault.loading = false;
  }

  async setVaultDepositAll(vault: IVault) {
    vault.loading = true;
    this.depositValue = 100;
    await this.vaultService.depositAll(vault);
    this.depositValue = 0;
    vault.loading = false;
  }

  async setVaultWithdraw(vault: IVault) {
    console.log(this.withdrawValue);
  }

  async setVaultWithdrawAll(vault: IVault) {
    vault.loading = true;
    await this.vaultService.withdrawAll(vault);
    vault.loading = false;
  }
}
