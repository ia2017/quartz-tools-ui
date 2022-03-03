import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class Zapper {
  private readonly _contract: ethers.Contract;

  constructor(private readonly web3: Web3Service) {}

  async zapIn() {
    //
  }
}
