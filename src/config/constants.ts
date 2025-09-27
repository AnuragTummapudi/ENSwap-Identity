// Configuration constants for the application

export const CONTRACT_ADDRESS = "0xEe58d185f59e01034527d95FDd85236fa245Ea9f";
export const PROJECT_ID = "aea25227957bdbe6ba50b99b18e6a69c";
export const ONE_INCH_API_KEY = "3T7z7yeDMd35XLNZhUrBxBx0qBXm490T";

// Network configurations
export const NETWORKS = {
  HEDERA_TESTNET: {
    chainId: 296,
    name: "Hedera Testnet",
    rpcUrl: "https://testnet.hashio.io/api",
    blockExplorer: "https://hashscan.io/testnet",
  },
  ETHEREUM: {
    chainId: 1,
    name: "Ethereum Mainnet",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/",
    blockExplorer: "https://etherscan.io",
  },
} as const;

// Token configurations
export const TOKENS = {
  HBAR: {
    symbol: "HBAR",
    name: "Hedera Hashgraph",
    decimals: 8,
    address: "0x0000000000000000000000000000000000000000", // Native token
    network: "hedera",
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    address: "0x0000000000000000000000000000000000000000", // Native token
    network: "ethereum",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0xA0b86a33E6441b8c4C8C0E4a5cF4c4a5cF4c4a5c", // Example address
    network: "ethereum",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    network: "ethereum",
  },
} as const;

// 1inch API endpoints
export const ONE_INCH_ENDPOINTS = {
  QUOTE: "https://api.1inch.dev/swap/v6.0/1/quote",
  SWAP: "https://api.1inch.dev/swap/v6.0/1/swap",
} as const;
