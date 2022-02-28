import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { IVault } from 'src/lib/types/vault.types';
import { FormattedResult } from 'src/lib/utils/formatting';
import { RewardPool } from '../reward-pool/reward-pool';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(
    private readonly web3: Web3Service,
    private rewardPool: RewardPool
  ) {}

  async getVaultTVL(vault: IVault) {
    const pair = new ethers.Contract(
      vault.lpAddress,
      [
        'function token0() view returns (address)',
        'function token1() view returns (address)',
        'function balanceOf(address) view returns (uint256)',
        'function totalSupply() view returns (uint256)',
      ],
      this.web3.web3Info.provider
    );

    const [token0, token1] = await Promise.all([pair.token0(), pair.token1()]);
    const abi = ['function balanceOf(address) view returns (uint256)'];
    const t0 = new ethers.Contract(token0, abi, this.web3.web3Info.provider);
    const t1 = new ethers.Contract(token1, abi, this.web3.web3Info.provider);

    let [pairToken0Amount, pairToken1Amount, totalSupply] = await Promise.all([
      t0.balanceOf(pair.address),
      t1.balanceOf(pair.address),
      pair.totalSupply(),
    ]);

    pairToken0Amount = new FormattedResult(pairToken0Amount);
    pairToken1Amount = new FormattedResult(pairToken1Amount);
    totalSupply = new FormattedResult(totalSupply);

    const chefLpBalance = new FormattedResult(
      await pair.balanceOf(this.rewardPool.contract.address)
    );

    const chefPercentOwnership =
      chefLpBalance.toNumber(4) / totalSupply.toNumber(4);

    const rewardPoolToken0Share =
      pairToken0Amount.toNumber() * chefPercentOwnership;
    const rewardPoolToken1Share =
      pairToken1Amount.toNumber() * chefPercentOwnership;

    // if (!vault.geckoIdToken0 || !vault.geckoIdToken1) {
    //   console.log('Missing coin gecko ids');
    //   return 0;
    // }

    const [priceToken0, priceToken1] = await Promise.all([
      vault.fetchPriceToken0(),
      vault.fetchPriceToken1(),
    ]);

    const rewardPoolValueToken0 = rewardPoolToken0Share * priceToken0;
    const rewardPoolValueToken1 = rewardPoolToken1Share * priceToken1;
    const TVL = rewardPoolValueToken0 + rewardPoolValueToken1;

    const stratInfo = await this.rewardPool.userInfo(
      vault.poolId,
      vault.strategy.address
    );

    const stratLpBalance = new FormattedResult(stratInfo.amount);
    const dollarsPerChefShare = TVL / chefLpBalance.toNumber();
    const vaultTVL = stratLpBalance.toNumber() * dollarsPerChefShare;
    const tvlFmt = new FormattedResult(
      ethers.utils.parseUnits(String(vaultTVL))
    );
    return new FormattedResult(ethers.utils.parseUnits(String(vaultTVL)));
  }
}
