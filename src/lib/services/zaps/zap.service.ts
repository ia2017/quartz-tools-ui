import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';
import { QUARTZ_CONTRACTS } from 'src/lib/data/contract';
import { ZAPS } from 'src/lib/data/zaps';
import { ERC20 } from 'src/lib/types/classes/erc20';
import { Pair } from 'src/lib/types/classes/pair';
import {
  ChainZapData,
  ChainZapInfo,
  IZapPool,
  ZapContractArgs,
  ZapInput,
} from 'src/lib/types/zap.types';
import { FormattedResult, roundDecimals } from 'src/lib/utils/formatting';
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

  private _chainZapData: ChainZapInfo;

  constructor(private readonly web3: Web3Service) {
    super();

    this.web3.web3.subscribe((info) => {
      if (info) {
        this.setContract(info.chainId);
      }
    });

    this.web3.chain.subscribe((chain) => {
      if (chain) {
        this.setContract(chain.chainId);
      }
    });
  }

  async setZapData(chainId: number) {
    this.setContract(chainId);

    const chainZaps = ZAPS[chainId];
    if (!chainZaps) {
      throw new Error('setZaps: Dafuq?');
    }

    this._chainZapData = chainZaps;
    const zappers: IZapPool[] = await this._setupZaps();
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
      this._error.next('Error getting zaps contract');
    }
  }

  async zapInWithPath(zapInput: ZapInput) {
    try {
      const zapInfo = this._zaps.value.find(
        (z) => z.pairAddress === zapInput.pairAddress
      );
      // Read routing path mapping for selected input token
      const path = zapInfo.pathsFromTokenIn[zapInput.tokenInAddress];

      if (!path) {
        throw new Error('dafaq?');
      }

      const tx = await this._contract.zapInWithPath(
        zapInput.tokenInAddress,
        zapInput.pairAddress,
        zapInput.tokenInAmountBN,
        zapInfo.routerAddress,
        path
      );
      await awaitTransactionComplete(tx);

      // Return the amount of LP tokens for convenience
      return this._getZapResult(zapInfo.pairAddress);
    } catch (error) {
      console.error(error);
      this._error.next('Error zapping in');
    }
  }

  private async _getZapResult(pairAddress: string) {
    const pair = new ERC20(pairAddress, this.web3.web3Info.signer);
    const lpTokens = await pair.balanceOf(this.web3.web3Info.userAddress);

    return {
      lpTokensUI: roundDecimals(lpTokens.toNumber(), 8),
      lpTokensBN: lpTokens.value,
    };
  }

  async approveZapperIfNeeded(
    tokenInAddress: string,
    amountIn: ethers.BigNumber
  ) {
    try {
      const tokenIn = new ERC20(tokenInAddress, this.web3.web3Info.signer);
      const allowance = await tokenIn.allowance(
        this.web3.web3Info.userAddress,
        this._contract.address
      );

      if (allowance.value.lt(amountIn)) {
        await tokenIn.approve(
          this._contract.address,
          ethers.constants.MaxUint256
        );
      }
    } catch (error) {
      this._error.next('Error approving contract');
    }
  }

  /**
   * Initialze zap contract info for easier UI component work.
   * Call after setting value for `_chainZapData`
   * @param zapInfo
   */
  private async _setupZaps() {
    try {
      const zappers: IZapPool[] = [];
      for (const zap of this._chainZapData.ZAPS) {
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

        zapIn.tokenInputOptions = zap.tokenInputOptions;

        zappers.push(zapIn);
      }

      return zappers;
    } catch (error) {
      throw error;
    }
  }
}
