import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VaultService } from 'src/lib/services/vaults/vault.service';

@Component({
  selector: 'quartz-vault-container',
  templateUrl: './vault-container.component.html',
  styleUrls: ['./vault-container.component.scss'],
})
export class VaultsContainerComponent {
  constructor(
    public readonly vaultService: VaultService,
    private snackBar: MatSnackBar
  ) {
    this.vaultService.error.subscribe((err) => {
      this.snackBar.dismiss();
      this.snackBar.open(err.message, '', {
        duration: 1000 * 5,
      });
    });

    this.vaultService.operationActive.subscribe((msg) => {
      this.snackBar.dismiss();
      if (msg) {
        this.snackBar.open(msg, '', {
          duration: 1000 * 5,
        });
      }
    });
  }
}
