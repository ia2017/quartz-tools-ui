import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'quartz-zap-in',
  templateUrl: './zap-in.component.html',
  styleUrls: ['./zap-in.component.scss'],
})
export class ZapInComponent implements OnInit {
  fetchingBalances = false;
  pool;
  pathZap;

  constructor() {}

  ngOnInit(): void {}

  getUserBalanceForPool(pool) {}

  async handleZapInWithPath(
    inputTokenAddress: string,
    lpAddress: string,
    amount: string
  ) {
    // const pool = this.pools.find((p) => p.lpAddress == lpAddress);
    // pool.loading = true;
    // // Test zap in with path
    // let path;
    // if (lpAddress == QUARTZ_UST_DFK_LP_ADDRESS) {
    //   if (inputTokenAddress == QUARTZ.address) {
    //     path = [QUARTZ.address, UST.address];
    //   } else {
    //     path = [UST.address, QUARTZ.address];
    //   }
    // }
    // if (lpAddress == QSHARE_ONE_DFK_LP_ADDRESS) {
    //   if (inputTokenAddress == QSHARE.address) {
    //     path = [QSHARE.address, WONE.address];
    //   } else {
    //     path = [WONE.address, QSHARE.address];
    //   }
    // }
    // await this.zapper.zapInWithPath(
    //   inputTokenAddress,
    //   lpAddress,
    //   parseUnits(amount, 18),
    //   path
    // );
    // pool.loading = false;
  }
}
