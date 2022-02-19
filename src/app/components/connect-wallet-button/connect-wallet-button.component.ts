import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/lib/services/web3.service';

@Component({
  selector: 'quartz-connect-wallet-button',
  templateUrl: './connect-wallet-button.component.html',
  styleUrls: ['./connect-wallet-button.component.scss'],
})
export class ConnectWalletButtonComponent implements OnInit {
  constructor(public web3: Web3Service) {}

  ngOnInit() {}

  connectWallet() {
    this.web3.connectWeb3();
  }

  ngAfterViewInit() {}
}
