import { ContractReceipt, ContractTransaction, ethers } from 'ethers';
import { Web3AppInfo } from '../types/web3.types';

export async function getWeb3(
  address: string,
  rpcURL: string,
  websockets = false
): Promise<Web3AppInfo> {
  let provider: ethers.providers.JsonRpcProvider;
  if (websockets) {
    provider = new ethers.providers.WebSocketProvider(rpcURL);
  } else {
    provider = new ethers.providers.JsonRpcProvider(rpcURL);
  }
  const signer = provider.getSigner(address);
  const chainId = await signer.getChainId();
  return {
    provider,
    signer,
    chainId,
  };
}

export async function awaitTransactionComplete(
  txResponse: ContractTransaction,
  confirmations = 1
): Promise<ContractReceipt> {
  try {
    console.log(`- Starting transaction: ${txResponse.hash}`);
    console.log(
      `- Awaiting transaction receipt... - ` + new Date().toLocaleString()
    );
    const txReceipt = await txResponse.wait(confirmations);
    console.log(
      '- TransactionReceipt received - ' + new Date().toLocaleString()
    );
    if (txReceipt.status === 1) {
      // success
      console.log(`Transaction successful`);
    }
    return txReceipt;
  } catch (error) {
    throw error; // Throw and try to let this be handled back in the call stack as needed
  }
}
