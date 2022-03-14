import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ethers } from 'ethers';
import { TokenService } from 'src/lib/services/tokens/token.service';
import { ZapService } from 'src/lib/services/zaps/zap.service';
import { IZapPool, TokenInputOption, ZapInput } from 'src/lib/types/zap.types';

@Component({
  selector: 'quartz-zap-in',
  templateUrl: './zap-in.component.html',
  styleUrls: ['./zap-in.component.scss'],
})
export class ZapInComponent implements OnInit {
  @Input() zap: IZapPool;
  zapGroup: FormGroup;

  private lastBalanceCheck = null;
  private balanceCheckLimit = 1000 * 30;

  currentSelectedToken: TokenInputOption = null;
  runningZap = false;

  zapResult = null;

  constructor(
    private readonly tokenService: TokenService,
    public readonly zapService: ZapService
  ) {}

  async ngOnInit() {
    this.zapGroup = new FormGroup({
      tokenIn: new FormControl(null, [Validators.required]),
      tokenInAmount: new FormControl(null, [Validators.required]),
    });

    const lpTokens = await this.zap.pair.balanceOf(
      '0x2e86D29cFea7c4f422f7fCCF97986bbBa03e1a7F'
    );
    this.zapResult = {
      lpTokensUI: lpTokens.toNumber(),
    };
    console.log(lpTokens.toNumber());
  }

  async runZapIn() {
    if (this.zapGroup.valid) {
      const tokenIn = this.zapGroup.get('tokenIn').value;

      const tokenInAmount = this.zapGroup.get('tokenInAmount').value;
      const tokenInAmountBN = ethers.utils.parseEther(String(tokenInAmount));

      const input: ZapInput = {
        tokenInAddress: tokenIn.address,
        pairAddress: this.zap.pairAddress,
        tokenInAmount,
        tokenInAmountBN,
      };

      this.reset();

      this.runningZap = true;
      await this.zapService.approveZapperIfNeeded(
        tokenIn.address,
        tokenInAmountBN
      );
      this.zapResult = await this.zapService.zapInWithPath(input);
      console.log(this.zapResult);
      this.runningZap = false;
    }
  }

  async getInputTokenBalances() {
    // Limit queries in the event selects are being open and closed too frequently
    if (
      this.lastBalanceCheck &&
      Date.now() < this.lastBalanceCheck + this.balanceCheckLimit
    ) {
      return;
    }
    await this.tokenService.setUserTokenBalances(this.zap.tokenInputOptions);
    this.lastBalanceCheck = Date.now();
  }

  onSelectedChange(selectedTokenIn: TokenInputOption) {
    this.currentSelectedToken = selectedTokenIn;
  }

  private reset() {
    this.zapGroup.reset();
    this.lastBalanceCheck = null;
    this.currentSelectedToken = null;
    this.zapResult = null;
  }
}
