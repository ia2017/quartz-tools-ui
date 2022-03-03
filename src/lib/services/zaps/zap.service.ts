import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import { QUARTZ_CONTRACTS } from 'src/lib/data/contract';
import { ZAPS } from 'src/lib/data/zaps';
import { Pair } from 'src/lib/types/classes/pair';
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
        this.setZapData(info.chainId);
      }
    });
  }

  async setZapData(chainId: number) {
    const zaps = this.getZapsForChain(chainId);
    const zappers: IZapPool[] = [];
    for (const zap of zaps) {
      const z: IZapPool = {
        ...zap,
        pair: new Pair(zap.pairAddress, this.web3.web3Info.signer),
      };
      zappers.push(z);
    }

    this._zaps.next(zappers);
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

  private getZapsForChain(chainId: number) {
    const chainZaps = ZAPS[chainId];
    if (!chainZaps) {
      throw new Error('setZaps: Dafuq?');
    }

    return chainZaps;
  }

  async zapInWithPath(zapInfo: IZapPool) {
    //
  }

  // createZapPool(): IZapPool {

  // }
}
