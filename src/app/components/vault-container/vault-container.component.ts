import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SimpleStateStore } from 'src/lib/services/store/simple-state-store';
import { VaultWatchService } from 'src/lib/services/vaults/vault-watch.service';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { Web3Service } from 'src/lib/services/web3.service';

@Component({
  selector: 'quartz-vault-container',
  templateUrl: './vault-container.component.html',
  styleUrls: ['./vault-container.component.scss'],
})
export class VaultsContainerComponent implements OnDestroy {
  private _subs = new Subscription();
  private _dataWatchInterval = 1000 * 60;
  loadingVaults = true;

  constructor(
    private readonly web3: Web3Service,
    public readonly vaultService: VaultService,
    public readonly state: SimpleStateStore,
    private readonly snackBar: MatSnackBar,
    private readonly watcher: VaultWatchService
  ) {
    this.web3.web3.subscribe((web3Info) => {
      if (web3Info) {
        this.vaultService.initVaults(web3Info.chainId);
      }
    });

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

    const s4 = this.state.vaults.subscribe((vaults) => {
      if (!vaults.length) {
        this.watcher.stopWatchingVaults();
      } else {
        this.watcher.watchVaults(
          this._dataWatchInterval,
          this.web3.web3Info.chainId
        );
      }
    });

    this._subs.add(s1);
    this._subs.add(s2);
    this._subs.add(s3);
    this._subs.add(s4);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
    this.watcher.stopWatchingVaults();
  }
}
