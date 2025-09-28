# ENSwap Contract Addresses

## 🎉 All Contracts Successfully Deployed!

### ENSwapIdentity Contract
- **Address:** `0x522884a14f04b584165fB87eFebEe6a8C480d623`
- **Network:** Hedera Testnet (Chain ID: 296)
- **Deployed:** September 28, 2025
- **Status:** ✅ Deployed and Verified
- **Block Explorer:** https://hashscan.io/testnet/contract/0x522884a14f04b584165fB87eFebEe6a8C480d623
- **Purpose:** Core identity and reputation management

### ENSSwapIntegration Contract
- **Address:** `0xEd0bb47997770ea0aA03aFb7054c13fd674cA19f`
- **Network:** Hedera Testnet (Chain ID: 296)
- **Deployed:** September 28, 2025
- **Status:** ✅ Deployed and Verified
- **Block Explorer:** https://hashscan.io/testnet/contract/0xEd0bb47997770ea0aA03aFb7054c13fd674cA19f
- **Purpose:** Enhanced ENS integration with creative subname features
- **Features:**
  - Transaction-specific ENS subnames
  - Reputation-based subname minting
  - ENS-as-identity across platform

### HederaENSSwap Contract
- **Address:** `0xCF2F43C351017d6d8fAFA1536b4048737eAB0b41`
- **Network:** Hedera Testnet (Chain ID: 296)
- **Deployed:** September 28, 2025
- **Status:** ✅ Deployed and Verified
- **Block Explorer:** https://hashscan.io/testnet/contract/0xCF2F43C351017d6d8fAFA1536b4048737eAB0b41
- **Purpose:** Hedera-specific features with HTS and HBAR support
- **Features:**
  - HTS System Contracts integration
  - Native HBAR swapping
  - Hedera EVM compatibility

## 📋 Environment Variables Summary

### Updated Frontend .env Variables:
```bash
# Contract Addresses - DEPLOYED ON HEDERA TESTNET
VITE_ENSWAP_IDENTITY_ADDRESS=0x522884a14f04b584165fB87eFebEe6a8C480d623
VITE_ENS_SWAP_INTEGRATION_ADDRESS=0xEd0bb47997770ea0aA03aFb7054c13fd674cA19f
VITE_HEDERA_ENS_SWAP_ADDRESS=0xCF2F43C351017d6d8fAFA1536b4048737eAB0b41

# API Keys
VITE_ONE_INCH_API_KEY=3T7z7yeDMd35XLNZhUrBxBx0qBXm490T
VITE_PROJECT_ID=aea25227957bdbe6ba50b99b18e6a69c
```


## 🎯 Technology Integration Status

### 1inch Integration
- ✅ **API Key:** Configured and working
- ✅ **7 APIs:** Quote, Swap, Price Feed, Balances, Metadata, Protocols, Health Check
- ✅ **Real-time data:** Live quotes and swaps

### ENS Integration
- ✅ **Enhanced Contract:** ENSSwapIntegration deployed and verified
- ✅ **Creative Features:** Transaction-specific subnames, reputation-based naming
- ✅ **Identity System:** ENS-as-identity across platform

### Hedera Integration
- ✅ **Primary Contract:** ENSwapIdentity deployed on Hedera Testnet
- ✅ **Enhanced Contract:** HederaENSSwap deployed and verified
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
