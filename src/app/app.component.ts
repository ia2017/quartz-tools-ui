import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChainService } from 'src/lib/services/chain/chain.service';
import { TokenService } from 'src/lib/services/tokens/token.service';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { Web3Service } from 'src/lib/services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public web3Service: Web3Service,
    public readonly chainService: ChainService,
    private readonly vaults: VaultService,
    private readonly snackBar: MatSnackBar,
    public readonly tokenService: TokenService
  ) {
    const snackbarFn = (msg: string) => {
      snackBar.open(msg, null, {
        duration: 5000,
      });
    };

    this.vaults.error.subscribe((err) => {
      snackbarFn(err.message);
    });
  }
}
