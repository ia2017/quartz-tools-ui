import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject, Subject } from 'rxjs';
import { QUARTZ_CONTRACTS } from 'src/lib/data/contract';
import { ZAPS } from 'src/lib/data/zaps';
import { ERC20 } from 'src/lib/types/classes/erc20';
import { Pair } from 'src/lib/types/classes/pair';
import { IZapPool } from 'src/lib/types/zap.types';
import { awaitTransactionComplete } from 'src/lib/utils/web3-utils';
import { CommonServiceEvents } from '../service-events-common';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class ZapService extends CommonServiceEvents {
  private _contract: ethers.Contract;

  private _zaps = new BehaviorSubject<IZapPool[]>([]);
  get zaps() {
    return this._zaps.asObservable();
  }

  constructor(private readonly web3: Web3Service) {
    super();
  }

  async setZapData(chainId: number) {
    //
    // this.setContract(chainId);
    //
    const zaps = this._getZapsForChain(chainId);
    const zappers: IZapPool[] = await this._setupZaps(zaps);
    this._zaps.next(zappers);
  }

  private setContract(chainId: number) {
    try {
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
    } catch (error) {
      this._error.next('Error getting zaps data');
    }
  }

  private _getZapsForChain(chainId: number) {
    const chainZaps = ZAPS[chainId];
    if (!chainZaps) {
      throw new Error('setZaps: Dafuq?');
    }

    return chainZaps;
  }

  async zapInWithPath(zapInfo: IZapPool) {
    try {
      // const tx = await this._contract.zapInWithPath();
      // await awaitTransactionComplete(tx);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Initialze zap contract info for easier UI component work
   * @param zapInfo
   */
  private async _setupZaps(zapInfo: IZapPool[]) {
    try {
      const zappers: IZapPool[] = [];
      for (const zap of zapInfo) {
        const zapIn: IZapPool = {
          ...zap,
        };
        if (!zapIn.pair) {
          zapIn.pair = new Pair(zapIn.pairAddress, this.web3.web3Info.signer);
        }

        if (!zapIn.token0 || !zapIn.token1) {
          zapIn.token0 = new ERC20(
            await zapIn.pair.token0(),
            this.web3.web3Info.signer
          );
          zapIn.token0 = new ERC20(
            await zapIn.pair.token1(),
            this.web3.web3Info.signer
          );
        }

        zappers.push(zapIn);
      }

      return zappers;
    } catch (error) {
      throw error;
    }
  }
}
