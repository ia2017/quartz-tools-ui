import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { QUARTZ_CONTRACTS } from 'src/lib/data/contracts';
import { FormattedResult } from 'src/lib/utils/formatting';
import { Web3Service } from '../web3.service';
import { REWARD_POOL_ABI } from './reward-pool-abi';

@Injectable({ providedIn: 'root' })
export class RewardPool {
  contract: ethers.Contract;

  constructor(private readonly web3: Web3Service) {
    this.web3.web3.subscribe((web3Info) => {
      if (web3Info) {
        this.contract = new ethers.Contract(
          QUARTZ_CONTRACTS.REWARD_POOL.BSC,
          REWARD_POOL_ABI,
          this.web3.web3Info.provider
        );
      }
    });
  }

  userInfo(poolId: number, user: string) {
    return this.contract.userInfo(poolId, user);
  }

  poolInfo(poolId: number) {
    return this.contract.poolInfo(poolId);
  }

  async totalAllocPoints() {
    return new FormattedResult(await this.contract.totalAllocPoint());
  }

  async rewardsPerSecond() {
    return new FormattedResult(await this.contract.tSharePerSecond());
  }
}
