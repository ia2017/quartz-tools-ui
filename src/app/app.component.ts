import { Component } from '@angular/core';
import { Web3Service } from 'src/lib/services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public web3Service: Web3Service) {}
}
