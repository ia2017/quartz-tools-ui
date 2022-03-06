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
      let userBalance: FormattedResult;
      if (vaultRef.isSingleStake) {
        const stakeToken = new ERC20(
          vaultRef.lpAddress,
          this.web3.web3Info.signer
        );
        userBalance = await stakeToken.balanceOf(userAddress);
      } else {
        const pair = new Pair(vaultRef.lpAddress, this.web3.web3Info.signer);
        userBalance = await pair.balanceOf(userAddress);
      }

      // 0.000095553488826912
      // let userBalance = new FormattedResult(
      //   ethers.utils.parseEther('0.000095553488826912')
      // );

      vaultRef.walletBalanceBN = userBalance.value;
      // Trim user balance to avoid weird long decimal issues
      const str = ethers.utils.formatEther(userBalance.value);
      userBalance = new FormattedResult(
        ethers.utils.parseEther((+str).toFixed(12))
      );

      vaultRef.userLpWalletBalance = userBalance.toNumber();

      const pricePerFullShare = new FormattedResult(
        await vaultRef.contract.getPricePerFullShare()
      );
      vaultRef.pricePerShare = pricePerFullShare.toNumber();

      let userLpDepositBalance: ethers.BigNumber =
        await vaultRef.contract.balanceOf(userAddress);

      vaultRef.userLpBaseDepositBalance = new FormattedResult(
        userLpDepositBalance
      ).toNumber();

      // let userLpDepositBalance = ethers.BigNumber.from('58332221');
      // const balStr = ethers.utils.formatEther(userLpDepositBalance);
      // console.log(balStr);

      // if (balStr.length > 18) {
      //   console.log(ethers.utils.parseEther('58332221').toString());

      //   const trimmed = balStr.slice(19);
      //   console.log(trimmed);

      //   const t2 = ethers.utils.parseEther('58332221').toString().slice(18);
      //   console.log(t2);

      //   userLpDepositBalance = ethers.utils.parseEther(trimmed);
      //   // console.log(ethers.utils.formatEther(userLpDepositBalance));
      // }

      const amountTimesPricePerShare =
        new FormattedResult(userLpDepositBalance).toNumber() *
        pricePerFullShare.toNumber();

      vaultRef.userLpDepositBalanceFull = userLpDepositBalance.isZero()
        ? 0
        : amountTimesPricePerShare;

      vaultRef.userLpDepositBalance = userLpDepositBalance.isZero()
        ? 0
        : roundDecimals(amountTimesPricePerShare, 8);

      vaultRef.userLpDepositBalanceBN = ethers.utils.parseUnits(
        String(amountTimesPricePerShare)
      );
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

    await this.setUserPercentOfDeposit(vault);
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

    // Get rewards % ownership of the pairs total supply
    const chefPercentOwnership =
      chefLpBalance.toNumber(4) / totalSupply.toNumber(4);
    const chefPercentOfToken0 =
      pairToken0Amount.toNumber() * chefPercentOwnership;
    const chefPercentOfToken1 =
      pairToken1Amount.toNumber() * chefPercentOwnership;

    // Get current external USD price for each token in the pair
    const [priceToken0, priceToken1] = await Promise.all([
      vault.fetchPriceToken0(),
      vault.fetchPriceToken1(),
    ]);

    // The percentage of token0 and token1 for the pool * their price
    // will gives us the total current USD value of the chefs pool
    const poolValueUsdToken0 = chefPercentOfToken0 * priceToken0;
    const poolValueUsdToken1 = chefPercentOfToken1 * priceToken1;
    const totalValueOfChefPoolUSD = poolValueUsdToken0 + poolValueUsdToken1;

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

  private async setUserPercentOfDeposit(vault: IVault) {
    const totalSupply = new FormattedResult(await vault.contract.totalSupply());
    const ratio = vault.userLpDepositBalanceFull / totalSupply.toNumber();
    const userPercent = roundDecimals(vault.totalValueLocked * ratio, 2);
    vault.userValueUSD = userPercent;
    return userPercent;
  }

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
