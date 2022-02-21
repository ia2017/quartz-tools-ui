import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import {
  QUARTZ_TOKEN_ADDRESS_HARMONY,
  QuartzToken,
  QSHARE_TOKEN_ADDRESS_HARMONY,
  QShareToken,
  UST_ADDRESS,
  UstToken,
  QUARTZ_QSHARE_DFK_LP_ADDRESS,
  QShareQuartzPair,
  QUARTZ_UST_DFK_LP_ADDRESS,
  QuartzUstPair,
  UsdcToken,
  USDC_ADDRESS,
  JEWEL_ADDRESS,
  JewelToken,
  HARMONY_wONE_ADDRESS,
  wOneToken,
  QSHARE_ONE_DFK_LP_ADDRESS,
  QShareOnePair,
} from '../../data/contracts';
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
    this.contractRefs[QUARTZ_QSHARE_DFK_LP_ADDRESS] = QShareQuartzPair.connect(
      this.web3.web3Info.signer
    );

    this.contractRefs[QUARTZ_UST_DFK_LP_ADDRESS] = QuartzUstPair.connect(
      this.web3.web3Info.signer
    );

    this.contractRefs[QSHARE_ONE_DFK_LP_ADDRESS] = QShareOnePair.connect(
      this.web3.web3Info.signer
    );
  }
}
