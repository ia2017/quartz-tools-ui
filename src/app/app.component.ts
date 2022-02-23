import { Component } from '@angular/core';
import { ChainService } from 'src/lib/services/chain/chain.service';
import { Web3Service } from 'src/lib/services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public web3Service: Web3Service,
    public readonly chainService: ChainService
  ) {}
}
