import { Component, Input } from '@angular/core';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { IVault } from 'src/lib/types/vault.types';

@Component({
  selector: 'quartz-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
})
export class VaultComponent {
  @Input() vault: IVault;
  depositValue = 100;
  withdrawValue = 0;

  constructor(public readonly vaultService: VaultService) {}

  async setVaultDeposit() {
    this.vault.loading = true;
    await this.vaultService.deposit(this.vault, this.depositValue);
    this.depositValue = 100;
    this.vault.loading = false;
  }

  async setVaultDepositAll() {
    this.vault.loading = true;
    this.depositValue = 100;
    await this.vaultService.depositAll(this.vault);
    this.depositValue = 0;
    this.vault.loading = false;
  }

  async setVaultWithdraw() {
    console.log(this.withdrawValue);
  }

  async setVaultWithdrawAll() {
    this.vault.loading = true;
    await this.vaultService.withdrawAll(this.vault);
    this.vault.loading = false;
  }

  async setApproval() {
    this.vault.loading = true;
    await this.vaultService.approveVault(this.vault);
    this.vault.loading = false;
  }
}
