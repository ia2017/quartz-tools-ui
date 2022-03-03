import { BehaviorSubject, Subject } from 'rxjs';
import { ethers } from 'ethers';
import { Injectable } from '@angular/core';
import { ChainService } from './chain/chain.service';
import { Web3AppInfo } from '../types/web3.types';
import { ChainBaseConfig } from '../types/chain.types';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Injectable({ providedIn: 'root' })
export class Web3Service {
  get connected(): boolean {
    return this._web3.value !== null;
  }

  private _web3 = new BehaviorSubject<Web3AppInfo>(null);
  get web3() {
    return this._web3.asObservable();
  }

  private _chain = new BehaviorSubject<ChainBaseConfig>(null);
  get chain() {
    return this._chain.asObservable();
  }

  get web3Info() {
    return {
      ...this._web3.value,
    };
  }

  private _error = new Subject<Error>();
  get error() {
    return this._error.asObservable();
  }

  constructor(private chainService: ChainService) {
    this.requestUserAccount();
    this.setEventHandlers();
  }

  private async requestUserAccount() {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      const signer = provider.getSigner();
      const selectedAccount = await signer.getAddress();
      if (selectedAccount) {
        this.connectWeb3();
      }
    } catch (error) {
      console.log('Web3 not previously connected');
      await this.connectWeb3();
    }
  }

  private async getWeb3Provider(): Promise<Web3AppInfo> {
    if (typeof window.ethereum === 'undefined') {
      this._error.next(new Error('MetaMask is not installed.'));
      return;
    }

    if (this.connected) {
      this._error.next(new Error('Wallet already connected.'));
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const chainId = await signer.getChainId();
      const currentChain = await this.chainService.getChainById(chainId);

      // const supported = this.chainService.isChainSupported(chainId);
      // if (!supported) {
      //   // freeze everything, blow it up, etc.
      //   this._web3.next(null);
      //   this._ready.next(false);
      //   this._chain.next(null);
      //   return;
      // }

      this._chain.next(currentChain);

      const web3Info: Web3AppInfo = {
        provider,
        signer,
        chainId,
        currentChain,
        userAddress: accounts[0],
      };

      return web3Info;
    } catch (error) {
      this._error.next(error);
    }
  }

  async connectWeb3() {
    if (!this.connected) {
      const web3Info = await this.getWeb3Provider();
      this._web3.next(web3Info);
    }
  }

  private setEventHandlers() {
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log('Accounts changed:');
      console.log(accounts);
      // Reload UI with accounts[0]
    });

    window.ethereum.on('disconnect', (error) => {
      console.log(`Account disconnected`);
      console.error(error);
      this._web3.next(null);
    });

    window.ethereum.on('chainChanged', async (chainId) => {
      // nada for now
      const supported = this.chainService.isChainSupported(chainId);
      console.log(supported);
      if (!supported) {
        // freeze everything, blow it up, etc.
        this._web3.next(null);
        this._chain.next(null);
      }
      this._chain.next(supported);
      window.location.reload();
    });
  }
}
