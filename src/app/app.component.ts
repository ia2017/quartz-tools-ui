import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChainService } from 'src/lib/services/chain/chain.service';
import { DataWatchService } from 'src/lib/services/data-watch.service';
import { TokenService } from 'src/lib/services/tokens/token.service';
import { VaultService } from 'src/lib/services/vaults/vault.service';
import { Web3Service } from 'src/lib/services/web3.service';
import { ZapService } from 'src/lib/services/zaps/zap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public readonly web3Service: Web3Service,
    public readonly chainService: ChainService,
    private readonly vaults: VaultService,
    private readonly snackBar: MatSnackBar,
    public readonly tokenService: TokenService,
    private readonly dataWatch: DataWatchService,
    private readonly zapService: ZapService
  ) {
    const snackbarFn = (msg: string) => {
      this.snackBar.open(msg, null, {
        duration: 5000,
      });
    };

    this.vaults.error.subscribe((err) => {
      snackbarFn(err.message);
    });

    this.web3Service.web3.subscribe((info) => {
      if (!info) {
        this.dataWatch.stopWatchingPrices();
      }
    });

    this.web3Service.chain.subscribe((chain) => {
      if (chain) {
        this.dataWatch.stopWatchingPrices();
        this.dataWatch.watchTokenPrices(chain.chainId);
      }
    });

    this.zapService.error.subscribe((err) => {
      snackbarFn(err);
    });
  }
}
