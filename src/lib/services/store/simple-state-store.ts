import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IVault } from 'src/lib/types/vault.types';

@Injectable({ providedIn: 'root' })
export class SimpleStateStore {
  private _vaults = new BehaviorSubject<IVault[]>([]);
  get vaults() {
    return this._vaults.asObservable();
  }

  constructor() {}

  setVaults(vaults: IVault[]) {
    this._vaults.next(vaults);
  }
}
