import { Component, Input } from '@angular/core';
import { IVault } from 'src/lib/data/vaults';
import { VaultService } from 'src/lib/services/vaults/vault.service';

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
    await this.vaultService.deposit(vault);
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
