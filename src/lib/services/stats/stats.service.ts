import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { CHAIN_ID_MAP } from 'src/lib/data/chains';
import { ERC20 } from 'src/lib/types/classes/erc20';
import { Pair } from 'src/lib/types/classes/pair';
import { IVault } from 'src/lib/types/vault.types';
import { FormattedResult, roundDecimals } from 'src/lib/utils/formatting';
import { RewardPool } from '../reward-pool/reward-pool';
import { Web3Service } from '../web3.service';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(
    private readonly web3: Web3Service,
    private readonly rewardPool: RewardPool
  ) {}

  async setVaultUserStats(vaultRef: IVault, userAddress: string) {
    try {
      let userWalletBalance: FormattedResult;
      if (vaultRef.isSingleStake) {
        const stakeToken = new ERC20(
          vaultRef.lpAddress,
          this.web3.web3Info.signer
        );
        userWalletBalance = await stakeToken.balanceOf(userAddress);
      } else {
        const pair = new Pair(vaultRef.lpAddress, this.web3.web3Info.signer);
        userWalletBalance = await pair.balanceOf(userAddress);
      }

      // 0.000095553488826912
      // let userBalance = new FormattedResult(
      //   ethers.utils.parseEther('0.000095553488826912')
      // );

      vaultRef.walletBalanceBN = userWalletBalance.value;
      // Trim user balance to avoid weird long decimal issues
      const str = ethers.utils.formatEther(userWalletBalance.value);
      userWalletBalance = new FormattedResult(
        ethers.utils.parseEther((+str).toFixed(12))
      );

      if (userWalletBalance.toNumber() > 0.0000000001) {
        vaultRef.userLpWalletBalance = userWalletBalance.toNumber();
      } else {
        vaultRef.userLpWalletBalance = 0;
      }

      const pricePerFullShare = new FormattedResult(
        await vaultRef.contract.getPricePerFullShare()
      );
      vaultRef.pricePerShare = pricePerFullShare.toNumber();

      let userLpDepositBalance: ethers.BigNumber =
        await vaultRef.contract.balanceOf(userAddress);

      // console.log(ethers.utils.formatEther(userLpDepositBalance));

      vaultRef.userLpBaseDepositBalance = new FormattedResult(
        userLpDepositBalance
      ).toNumber();

      const fixed = vaultRef.userLpBaseDepositBalance.toFixed(18);
      // console.log(fixed);
      // console.log(ethers.utils.formatEther(ethers.utils.parseEther(fixed)));

      // const amountTimesPricePerShare =
      //   new FormattedResult(userLpDepositBalance).toNumber() *
      //   pricePerFullShare.toNumber();

      vaultRef.userLpDepositBalanceFull = userLpDepositBalance.isZero()
        ? 0
        : vaultRef.userLpBaseDepositBalance;

      vaultRef.userLpDepositBalanceUI = userLpDepositBalance.isZero()
        ? 0
        : roundDecimals(vaultRef.userLpBaseDepositBalance, 8);

      if (Number(fixed) > 0.000000001) {
        vaultRef.userLpDepositBalanceBN = ethers.utils.parseEther(
          String(vaultRef.userLpBaseDepositBalance)
        );
      } else {
        vaultRef.userLpDepositBalanceBN = ethers.constants.Zero;
      }
    } catch (error) {
      console.error(error);
      throw new Error(`Error getting vault stats: ${vaultRef.name}`);
    }
  }

  async getVaultTVL(vault: IVault) {
    let stats;
    if (vault.isSingleStake) {
      stats = await this.getSingleStakeTVL(vault);
    } else {
      stats = await this.getPairVaultTVL(vault);
    }

    // await this.setUserPercentOfDeposit(vault);
    return stats;
  }

  async getPairVaultTVL(vault: IVault) {
    const pair = new ethers.Contract(
      vault.lpAddress,
      [
        'function token0() view returns (address)',
        'function token1() view returns (address)',
        'function balanceOf(address) view returns (uint256)',
        'function totalSupply() view returns (uint256)',
        'function getReserves() view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)',
      ],
      this.web3.web3Info.provider
    );

    const [token0, token1] = await Promise.all([pair.token0(), pair.token1()]);
    const abi = ['function balanceOf(address) view returns (uint256)'];
    const t0 = new ethers.Contract(token0, abi, this.web3.web3Info.provider);
    const t1 = new ethers.Contract(token1, abi, this.web3.web3Info.provider);

    let [pairToken0Amount, pairToken1Amount, pairTotalSupply] =
      await Promise.all([
        t0.balanceOf(pair.address), // Same idea as `getReserves()` on the pair
        t1.balanceOf(pair.address), // Same idea as `getReserves()` on the pair
        pair.totalSupply(),
      ]);

    pairToken0Amount = new FormattedResult(pairToken0Amount);
    pairToken1Amount = new FormattedResult(pairToken1Amount);
    pairTotalSupply = new FormattedResult(pairTotalSupply);

    const res = await pair.getReserves();
    const res0 = new FormattedResult(res._reserve0);
    const res1 = new FormattedResult(res._reserve1);

    // Check quantity of pair LP token deposited into chef contract
    const chefLpBalance = new FormattedResult(
      await pair.balanceOf(this.rewardPool.contract.address)
    );

    // console.log('chefLpBalance: ' + chefLpBalance.toNumber());

    // Get reward pools % ownership of the pairs total supply
    const chefPercentOwnership =
      chefLpBalance.toNumber(4) / pairTotalSupply.toNumber(4);

    const chefPercentOfToken0 =
      pairToken0Amount.toNumber() * chefPercentOwnership;
    const chefPercentOfToken1 =
      pairToken1Amount.toNumber() * chefPercentOwnership;

    // Get current external USD price for each token in the pair
    const [priceToken0, priceToken1] = await Promise.all([
      vault.fetchPriceToken0(),
      vault.fetchPriceToken1(),
    ]);

    // console.log(vault.name);

    const lpValue0 = res0.toNumber(4) * priceToken0;
    const lpValue1 = res1.toNumber(4) * priceToken1;
    const lpTokenPrice = (lpValue0 + lpValue1) / pairTotalSupply.toNumber(4);

    // console.log('lpValue0: ' + lpValue0);
    // console.log('lpValue1: ' + lpValue1);
    // console.log('lpTokenPrice: ' + lpTokenPrice);

    // The percentage of token0 and token1 for the pool * their price
    // will gives us the total current USD value of the chefs pool
    const poolValueUsdToken0 = chefPercentOfToken0 * priceToken0;
    const poolValueUsdToken1 = chefPercentOfToken1 * priceToken1;
    const totalValueOfChefPoolUSD = poolValueUsdToken0 + poolValueUsdToken1;

    // console.log('poolValueUsdToken0: ' + poolValueUsdToken0);
    // console.log('poolValueUsdToken1: ' + poolValueUsdToken1);
    //console.log('totalValueOfChefPoolUSD: ' + totalValueOfChefPoolUSD);

    const stratInfo = await this.rewardPool.userInfo(
      vault.poolId,
      vault.strategy.address
    );

    // Strats LP tokens deposited in reward pool/chef
    const stratLpDepositBalance = new FormattedResult(stratInfo.amount);
    //console.log('stratLpDepositBalance: ' + stratLpDepositBalance.toNumber());

    let stratPercentOfChef =
      stratLpDepositBalance.toNumber(4) / chefLpBalance.toNumber(4);

    //console.log('stratPercentOfChef: ' + stratPercentOfChef + '%');

    // const stratTVL =
    //   stratLpDepositBalance.toNumber() *
    //   vaultValuePerToken *
    //   stratPercentOfChef;
    const vaultTVL = totalValueOfChefPoolUSD * stratPercentOfChef;
    //console.log('stratTVL: ' + stratTVL);

    const vaultValuePerToken = vault.pricePerShare * lpTokenPrice;
    //console.log('PPS * lpTokenPrice: ' + vaultValuePerToken);

    //console.log('userLpBaseDepositBalance: ' + vault.userLpBaseDepositBalance);

    // const userValue = vaultValuePerToken * vault.userLpDepositBalanceUI;
    //console.log('userValue: ' + userValue);

    // Vault TVL really comes through the strategies.
    // Strategy owns a certain percentage of the total deposits in the chef pool at any given time
    // const vaultTVL = await this.getStrategyTVL(
    //   vault,
    //   totalValueOfChefPoolUSD,
    //   chefLpBalance.toNumber()
    // );

    // if (vault.name == 'AMES-UST') {
    //   console.log(vault.name);
    //   console.log('lpTokenPrice: ' + lpTokenPrice);
    //   console.log('totalValueOfChefPoolUSD: ' + totalValueOfChefPoolUSD);
    //   console.log('stratLpDepositBalance: ' + stratLpDepositBalance.toNumber());
    //   console.log('stratPercentOfChef: ' + stratPercentOfChef + '%');
    //   console.log('stratTVL: ' + stratTVL);
    //   console.log('PPS * lpTokenPrice: ' + vaultValuePerToken);
    //   console.log(
    //     'userLpBaseDepositBalance: ' + vault.userLpBaseDepositBalance
    //   );
    //   console.log('userValue: ' + userValue);
    //   const userValueBase = vaultValuePerToken * vault.userLpBaseDepositBalance;
    //   console.log('userValue userLpBaseDepositBalance: ' + userValueBase);

    //   const baseDiff = userValue - userValueBase;
    //   console.log('DEPOSIT DIFF: ' + baseDiff);
    //   console.log('DEPOSIT DIFF: ' + baseDiff / userValue);

    //   const vaultTotalSupply = new FormattedResult(
    //     await vault.contract.totalSupply()
    //   );
    //   console.log('vaultTotalSupply: ' + vaultTotalSupply.toNumber());
    //   const userBalance = new FormattedResult(
    //     await vault.contract.balanceOf(this.web3.web3Info.userAddress)
    //   );
    //   console.log('userBalance: ' + userBalance.toNumber());
    //   const userPercentOfStrat =
    //     userBalance.toNumber() / vaultTotalSupply.toNumber();
    //   console.log('userPercentOfStrat: ' + userPercentOfStrat);
    //   const userActualValue = userPercentOfStrat * stratTVL
    //   console.log('tvl * userPercent: ' + userPercentOfStrat * stratTVL);
    //   vault.userValueUSD = userActualValue;
    // }

    const vaultTotalSupply = new FormattedResult(
      await vault.contract.totalSupply()
    );
    const userBalance = new FormattedResult(
      await vault.contract.balanceOf(this.web3.web3Info.userAddress)
    );
    console.log(userBalance.toNumber());
    const userPercentOfStrat =
      userBalance.toNumber() / vaultTotalSupply.toNumber();
    const userActualValue = userPercentOfStrat * vaultTVL;
    vault.userValueUSD = userActualValue;

    vault.totalValueLocked = vaultTVL;

    const { APR, dailyAPR, APY } = await this.getVaultAPRs(
      vault,
      totalValueOfChefPoolUSD
    );

    return {
      vaultTVL,
      APR,
      dailyAPR,
      APY,
    };
  }

  private async getStrategyTVL(
    vault: IVault,
    poolTVL: number,
    chefLpBalance: number
  ) {
    const stratInfo = await this.rewardPool.userInfo(
      vault.poolId,
      vault.strategy.address
    );

    const stratLpBalance = new FormattedResult(stratInfo.amount);
    const stakingTokenPrice = poolTVL / chefLpBalance;
    return stratLpBalance.toNumber() * stakingTokenPrice;
  }

  async getSingleStakeTVL(vault: IVault) {
    const stakeToken = new ERC20(vault.lpAddress, this.web3.web3Info.signer);

    const { totalSupply, chefLpBalance, chefPercentOwnership } =
      await this.getChefInfo(stakeToken);

    const chefPercentOfToken0 = totalSupply * chefPercentOwnership;
    const tokenPrice = await vault.fetchPriceToken0();

    const poolValueUsdToken0 = chefPercentOfToken0 * tokenPrice;
    const totalValueOfChefPoolUSD = poolValueUsdToken0;

    // TVL really comes through the strategies
    const vaultTVL = await this.getStrategyTVL(
      vault,
      totalValueOfChefPoolUSD,
      chefLpBalance.toNumber()
    );

    vault.totalValueLocked = vaultTVL;

    const { APR, dailyAPR, APY } = await this.getVaultAPRs(
      vault,
      totalValueOfChefPoolUSD
    );

    return {
      vaultTVL,
      APR,
      dailyAPR,
      APY,
    };
  }

  // private async setUserPercentOfDeposit(vault: IVault) {
  //   const totalSupply = new FormattedResult(await vault.contract.totalSupply());
  //   //console.log('vault total supply: ' + totalSupply.toNumber());
  //   const ratio = vault.userLpDepositBalanceUI / totalSupply.toNumber();
  //   //console.log('user ratio of vault: ' + ratio);
  //   const userPercent = roundDecimals(vault.totalValueLocked * ratio, 2);

  //   vault.userValueUSD = userPercent;
  //   return userPercent;
  // }

  private async getChefInfo(tokenContract) {
    const totalSupply = await tokenContract.totalSupply();
    const chefLpBalance = await tokenContract.balanceOf(
      this.rewardPool.contract.address
    );

    // Get rewards % ownership of the pairs total supply
    const chefPercentOwnership =
      chefLpBalance.toNumber(4) / totalSupply.toNumber(4);

    return {
      totalSupply: totalSupply.toNumber(),
      chefLpBalance,
      chefPercentOwnership,
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
      APY: this.getAPY(dailyAPR),
    };
  }

  // TODO: APR's are too high and show inifinte sometimes
  // Need to convert to string and show something like "9.2m%"
  getAPY(dailyAPR: number) {
    const dailyToPercent = dailyAPR / 100;
    const dailyCompoundResults = (1 + dailyToPercent) ** 365;
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
