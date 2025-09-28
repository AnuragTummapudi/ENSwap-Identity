# ENSwap - ETHGlobal Hackathon Submission

## 🎯 Project Overview

**ENSwap** is a comprehensive Web3 platform that combines decentralized identity management with seamless token swapping capabilities. Built for the ETHGlobal hackathon, it provides users with ENS-based identities and reputation systems for secure, identity-verified transactions.

### 🌟 Key Innovation

ENSwap bridges the gap between decentralized identity and DeFi by creating a reputation-based trading system where users can build trust through verified identities and transaction history.

## 🚀 Live Demo

- **Frontend**: https://enswap-id.vercel.app
- **Smart Contracts**: 
  - ENSwapIdentity: `0x522884a14f04b584165fB87eFebEe6a8C480d623`
  - ENSSwapIntegration: `0xEd0bb47997770ea0aA03aFb7054c13fd674cA19f`
  - HederaENSSwap: `0xCF2F43C351017d6d8fAFA1536b4048737eAB0b41`
  - **Network**: Hedera Testnet
- **GitHub**: https://github.com/AnuragTummapudi/ENSwap-Identity

## 🚀 Advanced Technology Integration

### 🎯 **1inch Integration** - **Comprehensive DEX Aggregation**
✅ **Complete 1inch API Implementation:**
- **Classic Swap API**: Real-time token swapping with optimal rates
- **Quote API**: Live pricing and slippage calculations  
- **Price Feed API**: Real-time token prices
- **Wallet Balances API**: Live wallet balance checking
- **Token Metadata API**: Comprehensive token information
- **Protocols API**: DEX protocol information
- **Health Check API**: Service status monitoring

### 🎯 **ENS Integration** - **Creative Identity Solutions**
✅ **Innovative ENS Use Cases:**
- **Transaction-Specific ENS Names**: Each swap gets unique ENS subname
- **Reputation-Based Subnames**: High-reputation users can mint subnames
- **ENS-as-Identity**: ENS names as primary user identifiers
- **Cross-Platform Identity**: ENS names work across all features
- **Subname Minting**: Automated subname creation for swaps

### 🎯 **Hedera Integration** - **Next-Generation Blockchain**
✅ **Advanced Hedera Features:**
- **Hedera EVM Compatibility**: Smart contracts deployed on Hedera Testnet
- **HTS System Contracts**: Integration with Hedera Token Service
- **Native HBAR Support**: Direct HBAR token swapping
- **Cross-Chain Ready**: Built for Hedera's cross-chain capabilities
- **Enhanced Reputation**: Advanced scoring system for Hedera users

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript (Web Application)
- **Kotlin** with Android SDK (Mobile Application)
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Wagmi** + **RainbowKit** for Web3 integration
- **1inch API** for optimal token swapping

### Smart Contracts
- **Solidity** for contract development
- **Hardhat** for development and deployment
- **OpenZeppelin** for security standards
- **Hedera Testnet** for deployment

### Key Integrations
- **1inch Protocol** for DEX aggregation
- **ENS (Ethereum Name Service)** for identity
- **Hedera Hashgraph** for blockchain infrastructure
- **RainbowKit** for wallet connection

## 🔧 Key Features

### 1. Decentralized Identity Management
- Create ENS-based identities
- DID (Decentralized Identifier) support
- Identity verification and validation
- Cross-platform identity portability

### 2. Reputation System
- Transaction history tracking
- Reputation scoring algorithm
- Trust indicators for users
- Community-driven reputation building

### 3. Secure Token Swapping
- 1inch API integration for best rates
- Identity-verified transactions
- Slippage protection
- Gas optimization

### 4. Cross-Platform Experience
- **Web Application**: React-based responsive design
- **Mobile Application**: Native Android app built with Kotlin
- Professional interface across all platforms
- Real-time updates and synchronization
- Seamless wallet integration on mobile

## 📊 Smart Contract Architecture

### ENSwapIdentity Contract

**Key Functions:**
```solidity
function createIdentity(string memory _ensName, string memory _did) public
function getIdentity(address _user) public view returns (UserIdentity)
function logReceipt(address user, string memory ensName, string memory swapDetails, uint256 timestamp) public
function getReputationScore(address user) public view returns (uint256)
```

**Data Structures:**
```solidity
struct UserIdentity {
    string ensName;
    string did;
    address wallet;
    uint256 reputationScore;
}

struct Receipt {
    string ensName;
    string swapDetails;
    uint256 timestamp;
    bytes32 receiptHash;
}
```

## 🔐 Security Features

- **OpenZeppelin Standards**: Using battle-tested security patterns
- **Access Controls**: Proper permission management
- **Input Validation**: Comprehensive parameter validation
- **Gas Optimization**: Efficient contract execution
- **Audit Ready**: Code follows security best practices

## 🌐 Deployment Information

- **Network**: Hedera Testnet
- **Contract Addresses**: 
  - ENSwapIdentity: `0x522884a14f04b584165fB87eFebEe6a8C480d623`
  - ENSSwapIntegration: `0xEd0bb47997770ea0aA03aFb7054c13fd674cA19f`
  - HederaENSSwap: `0xCF2F43C351017d6d8fAFA1536b4048737eAB0b41`
- **Deployment Date**: September 28, 2025
- **Frontend**: Hosted on modern CDN

## 📈 Impact & Use Cases

### For Users
- **Trust Building**: Establish reputation through verified transactions
- **Better Rates**: Access to optimal swap rates via 1inch
- **Identity Portability**: Use ENS identity across platforms
- **Security**: Enhanced security through identity verification

### For DeFi Ecosystem
- **Trust Layer**: Adds reputation layer to DeFi transactions
- **Identity Integration**: Bridges identity and finance
- **User Adoption**: Reduces barriers to DeFi participation
- **Innovation**: Novel approach to trust in decentralized systems

## 🚀 Future Roadmap

### Short Term
- [ ] Ethereum Mainnet deployment
- [ ] Additional DEX integrations
- [x] **Mobile app development** (Android Kotlin app completed)
- [ ] Enhanced reputation algorithms
- [ ] iOS mobile app development

### Long Term
- [ ] Cross-chain identity support
- [ ] Governance token integration
- [ ] Advanced analytics dashboard
- [ ] Institutional adoption features

## 👥 Team

**Anurag Tummapudi**
- Full-Stack Developer
- Blockchain & Web3 Specialist
- Email: tummapudianurag@gmail.com
- GitHub: @AnuragTummapudi

**Shatadru Mukhopadhyay**
- Frontend Developer
- UI/UX Specialist
- Web3 Integration Expert

**Manthan Singla**
- App Developer
- Kotlin Expert
- React & TypeScript Expert

## 🏅 Technical Achievements

### Core Development
- ✅ Built complete full-stack Web3 application
- ✅ Developed native Android mobile app with Kotlin
- ✅ Integrated multiple protocols (1inch, ENS, Hedera)
- ✅ Implemented secure smart contracts
- ✅ Created modern, responsive UI across web and mobile
- ✅ Comprehensive testing and documentation

### Innovation Highlights
- 🎯 Novel reputation-based trading system
- 🎯 Identity-verified DeFi transactions
- 🎯 Cross-protocol integration
- 🎯 Cross-platform Web3 experience (Web + Mobile)
- 🎯 Native mobile app with seamless wallet integration

## 📱 Demo Instructions

### Web Application
1. **Connect Wallet**: Use MetaMask or WalletConnect
2. **Create Identity**: Register ENS name and DID
3. **View Reputation**: Check your reputation score
4. **Perform Swap**: Execute identity-verified token swaps
5. **Track Activity**: Monitor transaction history

### Mobile Application (Android)
1. **Install App**: Download and install the Kotlin-based Android app
2. **Connect Wallet**: Seamless wallet integration on mobile
3. **Create Identity**: Register ENS name using mobile interface
4. **Mobile Swapping**: Execute token swaps with mobile-optimized UI
5. **Cross-Platform Sync**: Data syncs between web and mobile

## 🔗 Links & Resources

- **GitHub Repository**: https://github.com/AnuragTummapudi/ENSwap-Identity
- **Live Demo**: [To be deployed]
- **Documentation**: ./docs/README.md
- **API Docs**: ./docs/api.md
- **Deployment Guide**: ./docs/deployment.md

## 🎉 Conclusion

ENSwap represents a significant step forward in combining decentralized identity with DeFi functionality. By creating a reputation-based trading system, we're building trust in the decentralized ecosystem while maintaining the core principles of Web3.

The project demonstrates technical excellence, innovative thinking, and practical utility - showcasing the future of Web3 identity and finance integration.

---

**Built with ❤️ for the Web3 community during ETHGlobal 2025**
