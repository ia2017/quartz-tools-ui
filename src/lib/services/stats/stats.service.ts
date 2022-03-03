import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { CHAIN_ID_MAP } from 'src/lib/data/chains';
import { IVault } from 'src/lib/types/vault.types';
import { FormattedResult, roundDecimals } from 'src/lib/utils/formatting';
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

    const [priceToken0, priceToken1] = await Promise.all([
      vault.fetchPriceToken0(),
      vault.fetchPriceToken1(),
    ]);

    const rewardPoolValueToken0 = rewardPoolToken0Share * priceToken0;
    const rewardPoolValueToken1 = rewardPoolToken1Share * priceToken1;
    const poolTVL = rewardPoolValueToken0 + rewardPoolValueToken1;

    const stratInfo = await this.rewardPool.userInfo(
      vault.poolId,
      vault.strategy.address
    );

    const stratLpBalance = new FormattedResult(stratInfo.amount);
    const stakingTokenPrice = poolTVL / chefLpBalance.toNumber();
    const vaultTVL = stratLpBalance.toNumber() * stakingTokenPrice;
    const { APR, dailyAPR, APY } = await this.getVaultAPRs(vault, poolTVL);

    return {
      vaultTVL,
      APR,
      dailyAPR,
      APY,
    };
  }

  async getVaultAPRs(vault: IVault, poolTVL: number) {
    const chain = CHAIN_ID_MAP[this.web3.web3Info.chainId];

    const [rewardsPerSecond, rewardTokenPrice] = await Promise.all([
      this.rewardPool.rewardsPerSecond(),
      vault.fetchRewardTokenPrice(),
    ]);

    const rewardTokensPerBlock =
      rewardsPerSecond.toNumber() * chain.blockTimeSeconds;
    const yearlyRewardsValue =
      rewardTokenPrice * rewardTokensPerBlock * chain.blocksPerYear;

    const { poolWeight } = await this.getPoolDataForAPR(vault.poolId);
    const poolsRewardTokenPerYear = yearlyRewardsValue * poolWeight.toNumber();
    const APR = (poolsRewardTokenPerYear / poolTVL) * 100;
    const dailyAPR = roundDecimals(APR / 365, 2);

    return {
      APR: roundDecimals(APR, 2),
      dailyAPR,
      APY: this.getAPY(APR, vault.compoundsDaily, dailyAPR),
    };
  }

  // TODO: APR's are too high and show inifinte sometimes
  // Need to convert to string and show something like "9.2m%"
  getAPY(apr: number, dailyCompounds: number, dailyAPR: number) {
    const dailyToPercent = dailyAPR / 100;
    const dailyCompoundResults = (1 + dailyToPercent) ** 365;

    console.log(dailyCompoundResults);

    // const digits = String(dailyCompoundResults);
    // if (digits.length > 9) {
    //   return '+1b';
    // }

    // if (digits.length > 6) {
    //   return '+1m';
    // }

    // if (digits.length > 3) {
    //   return '+1k';
    // }

    return dailyCompoundResults;
  }

  async getPoolDataForAPR(poolId: number) {
    const [poolInfo, totalAllocationPoints] = await Promise.all([
      this.rewardPool.poolInfo(poolId),
      this.rewardPool.totalAllocPoints(),
    ]);

    const poolAllocPoints = new FormattedResult(poolInfo.allocPoint);
    const poolWeight = new FormattedResult(
      ethers.utils.parseUnits(
        String(poolAllocPoints.toNumber(4) / totalAllocationPoints.toNumber(4))
      )
    );
    return {
      poolAllocPoints,
      totalAllocationPoints,
      poolWeight,
    };
  }
}
