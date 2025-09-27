import { CONTRACT_ADDRESSES } from '@/config/constants';
import { ethers } from 'ethers';

// Enhanced ENS Integration Service
export interface ENSProfile {
  primaryName: string;
  subnames: string[];
  reputationScore: number;
  totalSwaps: number;
  isVerified: boolean;
}

export interface SwapRecord {
  swapHash: string;
  ensName: string;
  amount: string;
  tokenPair: string;
  timestamp: number;
  completed: boolean;
}

class ENSService {
  private contract: ethers.Contract | null = null;

  // Contract ABI for ENSSwapIntegration
  private contractABI = [
    "function createSwapENSName(string memory _ensName, uint256 _amount, string memory _tokenPair) external",
    "function completeSwap(bytes32 _swapHash, uint256 _reputationGain) external",
    "function getUserENSProfile(address _user) external view returns (tuple(string primaryName, string[] subnames, uint256 reputationScore, uint256 totalSwaps, bool isVerified))",
    "function getUserSwaps(address _user) external view returns (tuple(bytes32 swapHash, string ensName, uint256 amount, string tokenPair, uint256 timestamp, bool completed)[] memory)",
    "function verifyENSName(string memory _ensName, address _owner) external",
    "function mintReputationSubname(string memory _subname) external",
    "function getENSReputationScore(address _user) external view returns (uint256)",
    "event SwapENSNameCreated(address indexed user, string ensName, bytes32 swapHash, uint256 timestamp)",
    "event ENSReputationUpdated(address indexed user, string ensName, uint256 newReputation)",
    "event ENSSubnameMinted(address indexed user, string parentName, string subname)",
  ];

  async initializeContract(signer: ethers.Signer) {
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESSES.ENS_SWAP_INTEGRATION,
      this.contractABI,
      signer
    );
  }

  /**
   * Create a unique ENS name for a swap transaction
   */
  async createSwapENSName(ensName: string, amount: string, tokenPair: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const amountWei = ethers.parseEther(amount);
    const tx = await this.contract.createSwapENSName(ensName, amountWei, tokenPair);
    await tx.wait();
  }

  /**
   * Complete a swap and update ENS-based reputation
   */
  async completeSwap(swapHash: string, reputationGain: number): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.completeSwap(swapHash, reputationGain);
    await tx.wait();
  }

  /**
   * Get user's ENS profile with all subnames
   */
  async getUserENSProfile(userAddress: string): Promise<ENSProfile | null> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const profile = await this.contract.getUserENSProfile(userAddress);
      return {
        primaryName: profile.primaryName,
        subnames: profile.subnames,
        reputationScore: Number(profile.reputationScore),
        totalSwaps: Number(profile.totalSwaps),
        isVerified: profile.isVerified,
      };
    } catch (error) {
      console.error('Failed to get ENS profile:', error);
      return null;
    }
  }

  /**
   * Get all swap records for a user
   */
  async getUserSwaps(userAddress: string): Promise<SwapRecord[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const swaps = await this.contract.getUserSwaps(userAddress);
      return swaps.map((swap: any) => ({
        swapHash: swap.swapHash,
        ensName: swap.ensName,
        amount: ethers.formatEther(swap.amount),
        tokenPair: swap.tokenPair,
        timestamp: Number(swap.timestamp),
        completed: swap.completed,
      }));
    } catch (error) {
      console.error('Failed to get user swaps:', error);
      return [];
    }
  }

  /**
   * Verify ENS name ownership
   */
  async verifyENSName(ensName: string, owner: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.verifyENSName(ensName, owner);
    await tx.wait();
  }

  /**
   * Create a reputation-based ENS subname
   */
  async mintReputationSubname(subname: string): Promise<void> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const tx = await this.contract.mintReputationSubname(subname);
    await tx.wait();
  }

  /**
   * Get reputation score for ENS-based trading
   */
  async getENSReputationScore(userAddress: string): Promise<number> {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const score = await this.contract.getENSReputationScore(userAddress);
      return Number(score);
    } catch (error) {
      console.error('Failed to get ENS reputation score:', error);
      return 0;
    }
  }

  /**
   * Generate a unique ENS subname for a swap
   */
  generateSwapSubname(swapHash: string): string {
    return `swap-${swapHash.slice(0, 8)}.enswap.eth`;
  }

  /**
   * Check if user can mint reputation subnames
   */
  canMintReputationSubname(reputationScore: number): boolean {
    const MIN_REPUTATION = 100;
    return reputationScore >= MIN_REPUTATION;
  }

  /**
   * Format ENS name for display
   */
  formatENSName(name: string): string {
    if (!name) return 'No ENS name';
    if (name.endsWith('.eth')) return name;
    return `${name}.eth`;
  }
}

export const ensService = new ENSService();
