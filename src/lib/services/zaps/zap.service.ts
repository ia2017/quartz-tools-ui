import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { QUARTZ_CONTRACTS } from 'src/lib/data/data';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class ZapService {
  private _contract: ethers.Contract;

  constructor(private readonly web3: Web3Service) {
    this.web3.web3.subscribe((info) => {
      if (info) {
        this.setContract(info.chainId);
      }
    });
  }

  private setContract(chainId: number) {
    const address = QUARTZ_CONTRACTS[chainId].Zapper;
    if (!address) {
      throw new Error('Dafuq?');
    }

    this._contract = new ethers.Contract(
      address,
      [`function zapInWithPath public`],
      this.web3.web3Info.signer
    );
  }

  async zapIn() {
    //
  }
}
