import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import {
  QUARTZ_TOKEN_ADDRESS_HARMONY,
  QuartzToken,
  QSHARE_TOKEN_ADDRESS_HARMONY,
  QShareToken,
  UST_ADDRESS,
  UstToken,
  UsdcToken,
  USDC_ADDRESS,
  JEWEL_ADDRESS,
  JewelToken,
  HARMONY_wONE_ADDRESS,
  wOneToken,
  QSHARE_ONE_DFK_LP_ADDRESS,
  QUARTZ_QSHARE_DFK_LP_ADDRESS,
  QUARTZ_UST_DFK_LP_ADDRESS,
} from '../../data/data';
import { FormattedResult, roundDecimals } from 'src/lib/utils/formatting';
import { Web3Service } from '../web3.service';
import { awaitTransactionComplete } from 'src/lib/utils/web3-utils';
import {
  PAIR_UST_AMETHYST_BSC,
  PAIR_ASHARE_UST_BSC,
} from 'src/lib/data/bsc/pairs';
import { BehaviorSubject } from 'rxjs';
import { TokenPriceInfo } from 'src/lib/types/token.types';
import { PRICE_TOKENS } from 'src/lib/data/price-tokens';
import { createPairContract } from 'src/lib/utils/contract.utils';
import { Pair } from 'src/lib/types/classes/pair';
import { ERC20 } from 'src/lib/types/classes/erc20';
import { TokenInputOption } from 'src/lib/types/zap.types';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private contractRefs: { [address: string]: ethers.Contract } = {};

  private _priceTokens = new BehaviorSubject<TokenPriceInfo[]>([]);
  get priceTokens() {
    return this._priceTokens.asObservable();
  }

  constructor(private readonly web3: Web3Service) {
    this.web3.web3.subscribe((web3Info) => {
      if (web3Info) {
        this.setContractRefs();
        this.setPriceTokensInfo(web3Info.chainId);
      }
    });
  }

  setPriceTokens(info: TokenPriceInfo[]) {
    this._priceTokens.next(info);
  }

  getPair(pairAddress: string) {
    return new Pair(pairAddress, this.web3.web3Info.signer);
  }

  getERC20(address: string) {
    return new ERC20(address, this.web3.web3Info.signer);
  }

  async setPriceTokensInfo(chainId: number) {
    const chainTokens = PRICE_TOKENS[chainId];
    if (!chainTokens || !chainTokens.length) {
      this.setPriceTokens([]);
      return;
    }
    const priceTokens: TokenPriceInfo[] = [];
    for (const token of chainTokens) {
      priceTokens.push({
        ...token,
        ...{
          price: await token.getPrice(),
        },
      });
    }

    this.setPriceTokens(priceTokens);
  }

  async getUserTokenBalance(tokenAddress: string) {
    const balance = await this.contractRefs[tokenAddress].balanceOf(
      this.web3.web3Info.userAddress
    );
    return new FormattedResult(balance);
  }

  async setUserTokenBalances(tokens: TokenInputOption[]) {
    for (const token of tokens) {
      token.loadingBalance = true;
      const contract = new ERC20(token.address, this.web3.web3Info.signer);
      const balance = await contract.balanceOf(this.web3.web3Info.userAddress);
      token.userBalanceUI = roundDecimals(Number(balance.formatEther()), 3);
      token.userBalanceBN = balance.value;
      token.loadingBalance = false;
    }
  }

  getTokenContract(address: string) {
    return this.contractRefs[address];
  }

  async approveTokenIfNeeded(
    tokenAddress: string,
    owner: string,
    spender: string,
    amount: ethers.BigNumber
  ) {
    try {
      const allowance: ethers.BigNumber = await this.contractRefs[
        tokenAddress
      ].allowance(owner, spender);
      if (allowance.lt(amount)) {
        const tx = await this.contractRefs[tokenAddress].approve(
          spender,
          ethers.constants.MaxUint256
        );

        await awaitTransactionComplete(tx);
      }
    } catch (error) {
      throw error;
    }
  }

  private setContractRefs() {
    this.contractRefs[QUARTZ_TOKEN_ADDRESS_HARMONY] = QuartzToken.connect(
      this.web3.web3Info.signer
    );
    this.contractRefs[QSHARE_TOKEN_ADDRESS_HARMONY] = QShareToken.connect(
      this.web3.web3Info.signer
    );
    this.contractRefs[UST_ADDRESS] = UstToken.connect(
      this.web3.web3Info.signer
    );
    this.contractRefs[USDC_ADDRESS] = UsdcToken.connect(
      this.web3.web3Info.signer
    );
    this.contractRefs[USDC_ADDRESS] = UsdcToken.connect(
      this.web3.web3Info.signer
    );
    this.contractRefs[JEWEL_ADDRESS] = JewelToken.connect(
      this.web3.web3Info.signer
    );
    this.contractRefs[HARMONY_wONE_ADDRESS] = wOneToken.connect(
      this.web3.web3Info.signer
    );

    this.setPairRefs();
  }

  private setPairRefs() {
    this.contractRefs[QUARTZ_QSHARE_DFK_LP_ADDRESS] = createPairContract(
      QUARTZ_QSHARE_DFK_LP_ADDRESS,
      this.web3.web3Info.signer
    );

    this.contractRefs[QUARTZ_UST_DFK_LP_ADDRESS] = createPairContract(
      QUARTZ_UST_DFK_LP_ADDRESS,
      this.web3.web3Info.signer
    );

    this.contractRefs[QSHARE_ONE_DFK_LP_ADDRESS] = createPairContract(
      QSHARE_ONE_DFK_LP_ADDRESS,
      this.web3.web3Info.signer
    );

    this.contractRefs[PAIR_ASHARE_UST_BSC] = createPairContract(
      PAIR_ASHARE_UST_BSC,
      this.web3.web3Info.signer
    );

    this.contractRefs[PAIR_UST_AMETHYST_BSC] = createPairContract(
      PAIR_UST_AMETHYST_BSC,
      this.web3.web3Info.signer
    );
  }
}
