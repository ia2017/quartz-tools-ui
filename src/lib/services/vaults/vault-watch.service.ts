import { Injectable } from '@angular/core';
import { VaultService } from './vault.service';

@Injectable({ providedIn: 'root' })
export class VaultWatchService {
  private _timer;

  constructor(private readonly vaultService: VaultService) {}

  watchVaults(interval: number, chainId: number) {
    if (this._timer) {
      console.log('VaultWatchService: Already watching.');
      return;
    }
    this._timer = setInterval(() => {
      this.vaultService.initVaults(chainId);
    }, interval);
  }

  stopWatchingVaults() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
}
