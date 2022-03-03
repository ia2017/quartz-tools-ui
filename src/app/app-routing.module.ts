import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { SwapContainerComponent } from './components/swap-container/swap-container.component';
import { VaultsContainerComponent } from './components/vault-container/vault-container.component';
import { ZapContainerComponent } from './components/zap-container/zap-container.component';

const routes: Routes = [
  {
    path: 'vaults',
    component: VaultsContainerComponent,
  },
  {
    path: 'zaps',
    component: ZapContainerComponent,
  },
  // {
  //   path: 'swap',
  //   component: SwapContainerComponent,
  // },
  {
    path: '**',
    redirectTo: 'vaults',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
