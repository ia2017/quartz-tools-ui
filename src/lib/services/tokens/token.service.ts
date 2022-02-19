import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import {
  QUARTZ_TOKEN_ADDRESS_HARMONY,
  QuartzToken,
  QSHARE_TOKEN_ADDRESS_HARMONY,
  QShareToken,
  UST_ADDRESS,
  UstToken,
  USDC_ADDRESS,
  UsdcToken,
  JEWEL_ADDRESS,
  JewelToken,
  HARMONY_wONE_ADDRESS,
  wOneToken,
  QUARTZ_QSHARE_DFK_LP_ADDRESS,
  QSHARE_QUARTZ_PAIR,
  QUARTZ_UST_DFK_LP_ADDRESS,
  QUARTZ_UST_PAIR,
} from 'src/lib/data/contracts';
import { FormattedResult } from 'src/lib/utils/formatting';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private contractRefs: { [address: string]: ethers.Contract } = {};

  constructor(private readonly web3: Web3Service) {
    this.setContractRefs();
  }

  async getUserTokenBalance(tokenAddress: string) {
    const balance = await this.contractRefs[tokenAddress].balanceOf(
      this.web3.web3Info.userAddress
    );
    return new FormattedResult(balance);
  }

  getTokenContract(address: string) {
    return this.contractRefs[address];
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
    this.contractRefs[QUARTZ_QSHARE_DFK_LP_ADDRESS] =
      QSHARE_QUARTZ_PAIR.connect(this.web3.web3Info.signer);

    this.contractRefs[QUARTZ_UST_DFK_LP_ADDRESS] = QUARTZ_UST_PAIR.connect(
      this.web3.web3Info.signer
    );
  }
}
