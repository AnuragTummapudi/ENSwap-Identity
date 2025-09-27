# ENSwap Contract Addresses

## 🏆 Currently Deployed Contract

### ENSwapIdentity Contract
- **Address:** `0xEe58d185f59e01034527d95FDd85236fa245Ea9f`
- **Network:** Hedera Testnet (Chain ID: 296)
- **Deployed:** September 27, 2025
- **Status:** ✅ Deployed and Verified
- **Block Explorer:** https://hashscan.io/testnet/contract/0xEe58d185f59e01034527d95FDd85236fa245Ea9f
- **Purpose:** Core identity and reputation management

## 🚀 Enhanced Contracts (Ready for Deployment)

### ENSSwapIntegration Contract
- **Mock Address:** `0x1234567890123456789012345678901234567890`
- **Status:** 🔄 Ready for deployment
- **Purpose:** Enhanced ENS integration with creative subname features
- **Features:**
  - Transaction-specific ENS subnames
  - Reputation-based subname minting
  - ENS-as-identity across platform

### HederaENSSwap Contract
- **Mock Address:** `0x2345678901234567890123456789012345678901`
- **Status:** 🔄 Ready for deployment
- **Purpose:** Hedera-specific features with HTS and HBAR support
- **Features:**
  - HTS System Contracts integration
  - Native HBAR swapping
  - Hedera EVM compatibility

## 📋 Environment Variables Summary


## 🎯 Technology Integration Status

### 1inch Integration
- ✅ **API Key:** Configured and working
- ✅ **7 APIs:** Quote, Swap, Price Feed, Balances, Metadata, Protocols, Health Check
- ✅ **Real-time data:** Live quotes and swaps

### ENS Integration
- 🔄 **Enhanced Contract:** ENSSwapIntegration (ready for deployment)
- ✅ **Creative Features:** Transaction-specific subnames, reputation-based naming
- ✅ **Identity System:** ENS-as-identity across platform

### Hedera Integration
- ✅ **Primary Contract:** ENSwapIdentity deployed on Hedera Testnet
- 🔄 **Enhanced Contract:** HederaENSSwap (ready for deployment)
- ✅ **Network Support:** Hedera Testnet with HTS integration

## 🚀 Next Steps for Full Deployment

### 1. Deploy Enhanced Contracts
```bash
cd contracts
npx hardhat run scripts/deployEnhanced.js --network hederaTestnet
```

### 2. Update Environment Variables
Replace mock addresses with actual deployed addresses in `.env` file

### 3. Verify Contracts
Follow Hedera's verification process on Hashscan

### 4. Update Documentation
Update this file with actual contract addresses

## 📊 Contract Architecture

```
ENSwap Platform
├── ENSwapIdentity (DEPLOYED)
│   ├── Identity management
│   ├── Reputation system
│   └── Receipt logging
├── ENSSwapIntegration (TO DEPLOY)
│   ├── Transaction-specific ENS names
│   ├── Reputation-based subnames
│   └── Creative ENS features
└── HederaENSSwap (TO DEPLOY)
    ├── HTS token integration
    ├── Native HBAR swapping
    └── Hedera-specific features
```

## 🔗 Useful Links

- **Hedera Testnet Explorer:** https://hashscan.io/testnet
- **Contract Verification:** https://hashscan.io/testnet/contract/0xEe58d185f59e01034527d95FDd85236fa245Ea9f
- **Hedera Faucet:** https://portal.hedera.com/faucet
- **1inch API Portal:** https://portal.1inch.dev/
- **WalletConnect Cloud:** https://cloud.walletconnect.com/

## 💡 Innovation Summary
- **1inch**: Comprehensive DEX aggregation with 7 APIs
- **ENS**: Creative identity solutions with transaction-specific names
- **Hedera**: Next-generation blockchain integration with HTS support
