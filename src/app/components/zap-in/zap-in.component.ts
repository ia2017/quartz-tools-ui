import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenService } from 'src/lib/services/tokens/token.service';
import { IZapPool, TokenInputOption, ZapInput } from 'src/lib/types/zap.types';

@Component({
  selector: 'quartz-zap-in',
  templateUrl: './zap-in.component.html',
  styleUrls: ['./zap-in.component.scss'],
})
export class ZapInComponent implements OnInit {
  @Input() zap: IZapPool;
  @Output() zapIn: EventEmitter<ZapInput>;
  zapGroup: FormGroup;

  private lastBalanceCheck = null;
  private balanceCheckLimit = 1000 * 30;

  currentSelectedToken: TokenInputOption = null;

  constructor(private readonly tokenService: TokenService) {
    this.zapIn = new EventEmitter();
  }

  ngOnInit() {
    this.zapGroup = new FormGroup({
      tokenIn: new FormControl(null, [Validators.required]),
      tokenInAmount: new FormControl(null, [Validators.required]),
    });
  }

  emitZapIn() {
    if (this.zapGroup.valid) {
      const tokenInAmount = this.zapGroup.get('tokenInAmount').value;
      const tokenIn = this.zapGroup.get('tokenIn').value;
      const input: ZapInput = {
        tokenInAddress: tokenIn.address,
        pairAddress: this.zap.pairAddress,
        tokenInAmount,
      };

      this.zapIn.next(input);
      this.reset();
    }
  }

  async getInputTokenBalances() {
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
  }
}
