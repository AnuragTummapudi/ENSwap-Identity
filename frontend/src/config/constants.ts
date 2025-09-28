// Configuration constants for the application

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x522884a14f04b584165fB87eFebEe6a8C480d623";
export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID || "aea25227957bdbe6ba50b99b18e6a69c";
export const ONE_INCH_API_KEY = import.meta.env.VITE_ONE_INCH_API_KEY || "3T7z7yeDMd35XLNZhUrBxBx0qBXm490T";

// Enhanced contract addresses - DEPLOYED ON HEDERA TESTNET
export const CONTRACT_ADDRESSES = {
  ENSWAP_IDENTITY: "0x522884a14f04b584165fB87eFebEe6a8C480d623", // Deployed and verified
  ENS_SWAP_INTEGRATION: "0xEd0bb47997770ea0aA03aFb7054c13fd674cA19f", // Deployed and verified
  HEDERA_ENS_SWAP: "0xCF2F43C351017d6d8fAFA1536b4048737eAB0b41", // Deployed and verified
} as const;

// Network configurations
export const NETWORKS = {
  HEDERA_TESTNET: {
    chainId: 296,
    name: "Hedera Testnet",
    rpcUrl: "https://testnet.hashio.io/api",
    blockExplorer: "https://hashscan.io/testnet",
  },
  SEPOLIA: {
    chainId: 11155111,
    name: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/",
    blockExplorer: "https://sepolia.etherscan.io",
  },
  ETHEREUM: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/",
    blockExplorer: "https://etherscan.io",
  },
} as const;

// Default network for testing
export const DEFAULT_NETWORK = NETWORKS.HEDERA_TESTNET;

// Token configurations
export const TOKENS = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // 1inch ETH placeholder
    network: "ethereum",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0xA0b86a33E6441b8c4C8C0E4a5cF4c4a5cF4c4a5c", // Real USDC address
    network: "ethereum",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Real USDT address
    network: "ethereum",
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    decimals: 18,
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // Real WETH address
    network: "ethereum",
  },
} as const;

// 1inch API endpoints (v6.1 as per official docs)
export const ONE_INCH_ENDPOINTS = {
  QUOTE: "https://api.1inch.dev/swap/v6.1",
  SWAP: "https://api.1inch.dev/swap/v6.1",
  TOKENS: "https://api.1inch.dev/swap/v6.1",
} as const;

// Supported chains
export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  BSC: 56,
  POLYGON: 137,
  ARBITRUM: 42161,
  OPTIMISM: 10,
  AVALANCHE: 43114,
} as const;
