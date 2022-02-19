import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VaultContainerComponent } from './components/vault-container/vault-container.component';
import { VaultComponent } from './components/vault/vault.component';
import { ZapInComponent } from './components/zap-in/zap-in.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwapComponent } from './components/swap/swap.component';

@NgModule({
  declarations: [
    AppComponent,
    VaultContainerComponent,
    VaultComponent,
    ZapInComponent,
    SwapComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
