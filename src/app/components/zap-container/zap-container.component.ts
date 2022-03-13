import { Component } from '@angular/core';
import { Web3Service } from 'src/lib/services/web3.service';
import { ZapService } from 'src/lib/services/zaps/zap.service';

@Component({
  selector: 'quartz-zap-container',
  templateUrl: './zap-container.component.html',
  styleUrls: ['./zap-container.component.scss'],
})
export class ZapContainerComponent {
  constructor(
    private readonly web3Service: Web3Service,
    public readonly zapService: ZapService
  ) {
    this.web3Service.web3.subscribe((info) => {
      if (info) {
        this.zapService.setZapData(info.chainId);
      }
    });
  }
}
