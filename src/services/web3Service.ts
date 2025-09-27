import { ethers } from 'ethers';
import { getPublicClient, getWalletClient } from '@wagmi/core';
import { CONTRACT_ADDRESS, NETWORKS } from '@/config/constants';

// Contract ABI for ENSwapIdentity
const CONTRACT_ABI = [
  "function createIdentity(string memory _ensName, string memory _did) public",
  "function getIdentity(address _user) public view returns (tuple(string ensName, string did, address wallet, uint256 reputationScore))",
  "function logReceipt(address user, string memory ensName, string memory swapDetails, uint256 timestamp) public",
  "function getReceipts(address user) public view returns (tuple(string ensName, string swapDetails, uint256 timestamp, bytes32 receiptHash)[] memory)",
  "function getReputationScore(address user) public view returns (uint256)",
  "event IdentityCreated(address indexed user, string ensName, string did)",
  "event ReceiptLogged(address indexed user, string ensName, string swapDetails, uint256 timestamp, bytes32 receiptHash)",
  "event ReputationUpdated(address indexed user, uint256 newScore)"
];

export interface UserIdentity {
  ensName: string;
  did: string;
  wallet: string;
  reputationScore: number;
}

export interface Receipt {
  ensName: string;
  swapDetails: string;
  timestamp: number;
  receiptHash: string;
}

class Web3Service {
  private contract: ethers.Contract | null = null;

  async connectWallet(): Promise<string> {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      // Initialize contract
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const address = await signer.getAddress();
      return address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async getAccount(): Promise<string | null> {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) return null;
      return walletClient.account.address;
    } catch (error) {
      console.error('Failed to get account:', error);
      return null;
    }
  }

  async createIdentity(ensName: string, did: string): Promise<void> {
    try {
      const walletClient = await getWalletClient();
      if (!walletClient) {
        throw new Error('Wallet not connected');
      }

      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.createIdentity(ensName, did);
      await tx.wait();
    } catch (error) {
      console.error('Failed to create identity:', error);
      throw error;
    }
  }

  async getIdentity(userAddress?: string): Promise<UserIdentity | null> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const address = userAddress || await this.getAccount();
      if (!address) return null;

      const identity = await this.contract.getIdentity(address);
      
      // Check if identity exists (empty ensName means no identity)
      if (!identity.ensName || identity.ensName === '') {
        return null;
      }

      return {
        ensName: identity.ensName,
        did: identity.did,
        wallet: identity.wallet,
        reputationScore: Number(identity.reputationScore)
      };
    } catch (error) {
      console.error('Failed to get identity:', error);
      return null;
    }
  }

  async logReceipt(userAddress: string, ensName: string, swapDetails: string, timestamp: number): Promise<void> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.contract.logReceipt(userAddress, ensName, swapDetails, timestamp);
      await tx.wait();
    } catch (error) {
      console.error('Failed to log receipt:', error);
      throw error;
    }
  }

  async getReceipts(userAddress?: string): Promise<Receipt[]> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const address = userAddress || await this.getAccount();
      if (!address) return [];

      const receipts = await this.contract.getReceipts(address);
      
      return receipts.map((receipt: any) => ({
        ensName: receipt.ensName,
        swapDetails: receipt.swapDetails,
        timestamp: Number(receipt.timestamp),
        receiptHash: receipt.receiptHash
      }));
    } catch (error) {
      console.error('Failed to get receipts:', error);
      return [];
    }
  }

  async getReputationScore(userAddress?: string): Promise<number> {
    if (!this.contract) {
      throw new Error('Wallet not connected');
    }

    try {
      const address = userAddress || await this.getAccount();
      if (!address) return 0;

      const score = await this.contract.getReputationScore(address);
      return Number(score);
    } catch (error) {
      console.error('Failed to get reputation score:', error);
      return 0;
    }
  }

  async getBalance(address?: string): Promise<string> {
    try {
      const publicClient = getPublicClient();
      if (!publicClient) return '0';

      const addr = address || await this.getAccount();
      if (!addr) return '0';

      const balance = await publicClient.getBalance({ address: addr as `0x${string}` });
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  async switchNetwork(chainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If the chain doesn't exist, add it
      if (error.code === 4902) {
        const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
        if (network) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: network.name,
              rpcUrls: [network.rpcUrl],
              blockExplorerUrls: [network.blockExplorer],
            }],
          });
        }
      } else {
        throw error;
      }
    }
  }

  isConnected(): boolean {
    return this.contract !== null;
  }

  disconnect(): void {
    this.contract = null;
  }
}

// Export singleton instance
export const web3Service = new Web3Service();

// Extend Window interface for MetaMask
declare global {
  interface Window {
    ethereum?: any;
  }
}
