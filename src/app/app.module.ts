import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VaultsContainerComponent } from './components/vault-container/vault-container.component';
import { VaultComponent } from './components/vault/vault.component';
import { ZapInComponent } from './components/zap-in/zap-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwapComponent } from './components/swap/swap.component';
import { ZapContainerComponent } from './components/zap-container/zap-container.component';
import { SwapContainerComponent } from './components/swap-container/swap-container.component';
import { ChainBadgeComponent } from './components/chain-badge/chain-badge.component';
import { ConnectWalletButtonComponent } from './components/connect-wallet-button/connect-wallet-button.component';

@NgModule({
  declarations: [
    AppComponent,
    VaultsContainerComponent,
    VaultComponent,
    ZapInComponent,
    SwapComponent,
    ZapContainerComponent,
    SwapContainerComponent,
    ChainBadgeComponent,
    ConnectWalletButtonComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
