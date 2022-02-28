import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SimpleStateStore } from 'src/lib/services/store/simple-state-store';
import { VaultService } from 'src/lib/services/vaults/vault.service';

@Component({
  selector: 'quartz-vault-container',
  templateUrl: './vault-container.component.html',
  styleUrls: ['./vault-container.component.scss'],
})
export class VaultsContainerComponent implements OnDestroy {
  private subs = new Subscription();

  loadingVaults = true;

  constructor(
    public readonly vaultService: VaultService,
    public readonly state: SimpleStateStore,
    private snackBar: MatSnackBar
  ) {
    const s1 = this.vaultService.error.subscribe((err) => {
      this.snackBar.dismiss();
      this.snackBar.open(err.message, '', {
        duration: 1000 * 5,
      });
    });

    const s2 = this.vaultService.operationActive.subscribe((msg) => {
      this.snackBar.dismiss();
      if (msg) {
        this.snackBar.open(msg, '', {
          duration: 1000 * 5,
        });
      }
    });

    const s3 = this.vaultService.init.subscribe((init) => {
      this.loadingVaults = init;
    });

    this.subs.add(s1);
    this.subs.add(s2);
    this.subs.add(s3);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
