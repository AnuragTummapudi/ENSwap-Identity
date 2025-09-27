# ENSwap - ETHGlobal Hackathon Submission

## 🎯 Project Overview

**ENSwap** is a comprehensive Web3 platform that combines decentralized identity management with seamless token swapping capabilities. Built for the ETHGlobal hackathon, it provides users with ENS-based identities and reputation systems for secure, identity-verified transactions.

### 🌟 Key Innovation

ENSwap bridges the gap between decentralized identity and DeFi by creating a reputation-based trading system where users can build trust through verified identities and transaction history.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel/Netlify]
- **Smart Contract**: `0xEe58d185f59e01034527d95FDd85236fa245Ea9f` (Hedera Testnet)
- **GitHub**: https://github.com/AnuragTummapudi/ENSwap-Identity

## 🏆 Partner Prize Alignment

### 🎯 **1inch Integration** - **$1,500 Prize Pool**
✅ **Comprehensive 1inch API Usage:**
- **Classic Swap API**: Real-time token swapping with optimal rates
- **Quote API**: Live pricing and slippage calculations  
- **Price Feed API**: Real-time token prices
- **Wallet Balances API**: Live wallet balance checking
- **Token Metadata API**: Comprehensive token information
- **Protocols API**: DEX protocol information
- **Health Check API**: Service status monitoring

### 🎯 **ENS Integration** - **$10,000 Prize Pool**
✅ **Creative ENS Use Cases:**
- **Transaction-Specific ENS Names**: Each swap gets unique ENS subname
- **Reputation-Based Subnames**: High-reputation users can mint subnames
- **ENS-as-Identity**: ENS names as primary user identifiers
- **Cross-Platform Identity**: ENS names work across all features
- **Subname Minting**: Automated subname creation for swaps

### 🎯 **Hedera Integration** - **$3,500 Prize Pool**
✅ **Advanced Hedera Features:**
- **Hedera EVM Compatibility**: Smart contracts deployed on Hedera Testnet
- **HTS System Contracts**: Integration with Hedera Token Service
- **Native HBAR Support**: Direct HBAR token swapping
- **Cross-Chain Ready**: Built for Hedera's cross-chain capabilities
- **Reputation Bonuses**: Extra rewards for Hedera users

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
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

### 4. Modern UI/UX
- Responsive design
- Professional interface
- Real-time updates
- Mobile-friendly

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
- **Contract Address**: `0xEe58d185f59e01034527d95FDd85236fa245Ea9f`
- **Deployment Date**: September 27, 2025
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
- [ ] Mobile app development
- [ ] Enhanced reputation algorithms

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

## 🏅 Hackathon Achievements

### Technical Achievements
- ✅ Built complete full-stack Web3 application
- ✅ Integrated multiple protocols (1inch, ENS, Hedera)
- ✅ Implemented secure smart contracts
- ✅ Created modern, responsive UI
- ✅ Comprehensive testing and documentation

### Innovation Highlights
- 🎯 Novel reputation-based trading system
- 🎯 Identity-verified DeFi transactions
- 🎯 Cross-protocol integration
- 🎯 User-friendly Web3 experience

## 📱 Demo Instructions

1. **Connect Wallet**: Use MetaMask or WalletConnect
2. **Create Identity**: Register ENS name and DID
3. **View Reputation**: Check your reputation score
4. **Perform Swap**: Execute identity-verified token swaps
5. **Track Activity**: Monitor transaction history

## 🔗 Links & Resources

- **GitHub Repository**: https://github.com/AnuragTummapudi/ENSwap-Identity
- **Live Demo**: [To be deployed]
- **Documentation**: ./docs/README.md
- **API Docs**: ./docs/api.md
- **Deployment Guide**: ./docs/deployment.md

## 🎉 Conclusion

ENSwap represents a significant step forward in combining decentralized identity with DeFi functionality. By creating a reputation-based trading system, we're building trust in the decentralized ecosystem while maintaining the core principles of Web3.

The project demonstrates technical excellence, innovative thinking, and practical utility - making it a strong contender for the ETHGlobal hackathon.

---

**Built with ❤️ for the Web3 community during ETHGlobal 2025**
