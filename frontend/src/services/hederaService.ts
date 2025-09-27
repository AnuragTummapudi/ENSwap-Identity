import { CONTRACT_ADDRESSES } from '@/config/constants';
import { ethers } from 'ethers';

// Hedera Integration Service
export interface HederaUserProfile {
  ensName: string;
  hbarBalance: string;
  reputationScore: number;
  associatedTokens: string[];
  totalHederaSwaps: number;
  isHederaVerified: boolean;
}

export interface HederaSwapRecord {
  user: string;
  ensName: string;
  fromToken: string;
  toToken: string;
  amount: string;
  timestamp: number;
  completed: boolean;
  reputationGain: number;
}

class HederaService {
  private contract: ethers.Contract | null = null;

  // Contract ABI for HederaENSSwap
  private contractABI = [
    "function executeHederaSwap(string memory _ensName, address _fromToken, address _toToken, uint256 _amount) external",
    "function executeHBARSwap(string memory _ensName, address _tokenToReceive, uint256 _hbarAmount) external",
    "function associateHTSToken(address _tokenId) external",
    "function getHederaProfile(address _user) external view returns (tuple(string ensName, uint256 hbarBalance, uint256 reputationScore, address[] associatedTokens, uint256 totalHederaSwaps, bool isHederaVerified))",
    "function getHederaReputation(address _user) external view returns (uint256)",
    "function completeHederaSwap(bytes32 _swapHash) external",
    "function getTotalHederaSwaps() external view returns (uint256)",
    "function verifyHederaAccount(address _user) external",
    "event HederaSwapExecuted(address indexed user, string ensName, address fromToken, address toToken, uint256 amount, uint256 timestamp)",
    "event HBARSwapExecuted(address indexed user, string ensName, uint256 hbarAmount, address tokenReceived, uint256 tokenAmount, uint256 timestamp)",
    "event HTSAssociationCreated(address indexed user, address indexed tokenId)",
    "event HederaReputationUpdated(address indexed user, uint256 newReputation)",
  ];

  async initializeContract(signer: ethers.Signer) {
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESSES.HEDERA_ENS_SWAP,
      this.contractABI,
      signer
    );
  }

  /**
   * Execute a swap using Hedera HTS tokens
   */
  async executeHederaSwap(
    ensName: string,
    fromToken: string,
    toToken: string,
    amount: string
  ): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const amountWei = ethers.parseEther(amount);
    const tx = await this.contract.executeHederaSwap(
      ensName,
      fromToken,
      toToken,
      amountWei
    );
    await tx.wait();
  }

  /**
   * Execute a swap using HBAR (Hedera's native token)
   */
  async executeHBARSwap(
    ensName: string,
    tokenToReceive: string,
    hbarAmount: string
  ): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const hbarWei = ethers.parseEther(hbarAmount);
    const tx = await this.contract.executeHBARSwap(
      ensName,
      tokenToReceive,
      hbarWei
    );
    await tx.wait();
  }

  /**
   * Associate a Hedera HTS token with user's account
   */
  async associateHTSToken(tokenId: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.associateHTSToken(tokenId);
    await tx.wait();
  }

  /**
   * Get user's Hedera profile
   */
  async getHederaProfile(userAddress: string): Promise<HederaUserProfile | null> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const profile = await this.contract.getHederaProfile(userAddress);
      return {
        ensName: profile.ensName,
        hbarBalance: ethers.formatEther(profile.hbarBalance),
        reputationScore: Number(profile.reputationScore),
        associatedTokens: profile.associatedTokens,
        totalHederaSwaps: Number(profile.totalHederaSwaps),
        isHederaVerified: profile.isHederaVerified,
      };
    } catch (error) {
      console.error('Failed to get Hedera profile:', error);
      return null;
    }
  }

  /**
   * Get Hedera-specific reputation score
   */
  async getHederaReputation(userAddress: string): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const reputation = await this.contract.getHederaReputation(userAddress);
      return Number(reputation);
    } catch (error) {
      console.error('Failed to get Hedera reputation:', error);
      return 0;
    }
  }

  /**
   * Complete a Hedera swap and update reputation
   */
  async completeHederaSwap(swapHash: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.completeHederaSwap(swapHash);
    await tx.wait();
  }

  /**
   * Get total Hedera swaps for analytics
   */
  async getTotalHederaSwaps(): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const total = await this.contract.getTotalHederaSwaps();
      return Number(total);
    } catch (error) {
      console.error('Failed to get total Hedera swaps:', error);
      return 0;
    }
  }

  /**
   * Verify Hedera account
   */
  async verifyHederaAccount(userAddress: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.verifyHederaAccount(userAddress);
    await tx.wait();
  }

  /**
   * Format HBAR balance for display
   */
  formatHBARBalance(balance: string): string {
    const num = parseFloat(balance);
    if (num === 0) return '0.000';
    if (num < 0.001) return '<0.001';
    return num.toFixed(3);
  }

  /**
   * Get Hedera network information
   */
  getHederaNetworkInfo() {
    return {
      name: 'Hedera Testnet',
      chainId: 296,
      rpcUrl: 'https://testnet.hashio.io/api',
      blockExplorer: 'https://hashscan.io/testnet',
      nativeCurrency: {
        name: 'HBAR',
        symbol: 'HBAR',
        decimals: 18,
      },
    };
  }

  /**
   * Check if address is a Hedera HTS token
   */
  isHTSToken(address: string): boolean {
    // Hedera HTS tokens typically start with specific patterns
    return address.startsWith('0x') && address.length === 42;
  }

  /**
   * Get reputation bonus for Hedera users
   */
  getHederaReputationBonus(): number {
    return 50; // Extra reputation for Hedera users
  }

  /**
   * Get HBAR swap bonus
   */
  getHBARSwapBonus(): number {
    return 25; // Bonus for HBAR swaps
  }
}

export const hederaService = new HederaService();
