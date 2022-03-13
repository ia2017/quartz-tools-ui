import { Injectable } from '@angular/core';
import { TokenService } from './tokens/token.service';
import { VaultService } from './vaults/vault.service';

@Injectable({ providedIn: 'root' })
export class DataWatchService {
  private _vaultTimer;
  private _priceTimer;
  private _defaultPriceInterval = 1000 * 30;

  constructor(
    private readonly vaultService: VaultService,
    private readonly tokenService: TokenService
  ) {}

  watchVaults(interval: number, chainId: number) {
    if (this._vaultTimer) {
      console.log('DataWatchService: already watching vaults');
      return;
    }
    this._vaultTimer = setInterval(() => {
      this.vaultService.initVaults(chainId);
    }, interval);
  }

  stopWatchingVaults() {
    if (this._vaultTimer) {
      clearInterval(this._vaultTimer);
      this._vaultTimer = null;
    }
  }

  watchTokenPrices(chainId: number, interval = this._defaultPriceInterval) {
    if (this._priceTimer) {
      console.log('DataWatchService: already watching prices');
      return;
    }
    this._priceTimer = setInterval(() => {
      console.log('Updating token prices..');
      this.tokenService.setPriceTokensInfo(chainId);
    }, interval);
  }

  // In case current chain changes
  stopWatchingPrices() {
    if (this._priceTimer) {
      clearInterval(this._priceTimer);
      this._priceTimer = null;
    }
  }
}
