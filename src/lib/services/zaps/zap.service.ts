import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import { QUARTZ_CONTRACTS } from 'src/lib/data/contract';
import { ZAPS } from 'src/lib/data/zaps';
import { IZapPool } from 'src/lib/types/zap.types';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class ZapService {
  private _contract: ethers.Contract;

  private _zaps = new BehaviorSubject<IZapPool[]>([]);
  get zaps() {
    return this._zaps.asObservable();
  }

  private _errors = new Subject<string>();
  get errors() {
    return this._errors.asObservable();
  }

  constructor(private readonly web3: Web3Service) {
    this.web3.web3.subscribe((info) => {
      if (info) {
        this.setContract(info.chainId);
        this.setZaps(info.chainId);
      }
    });
  }

  private setContract(chainId: number) {
    const address = QUARTZ_CONTRACTS[chainId].Zapper;
    if (!address) {
      throw new Error('setContract: Dafuq?');
    }

    this._contract = new ethers.Contract(
      address,
      [
        `function zapInWithPath(address, address, uint256, address, address[]) public`,
      ],
      this.web3.web3Info.signer
    );
  }

  private async setZaps(chainId: number) {
    // const chainZaps = ZAPS[chainId];
    // if (!chainZaps) {
    //   throw new Error('setZaps: Dafuq?');
    // }
    // console.log(chainZaps);
    // this._zaps.next(chainZaps || []);
  }

  async zapIn(zapInfo: IZapPool) {
    //
  }

  // createZapPool(): IZapPool {

  // }
}
