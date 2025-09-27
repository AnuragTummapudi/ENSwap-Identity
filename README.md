# ENSwap - Decentralized Identity & Token Exchange Platform

ENSwap is a comprehensive Web3 platform that combines decentralized identity management with seamless token swapping capabilities. Built on Hedera Testnet, it provides users with ENS-based identities and reputation systems for secure, identity-verified transactions.

## 🚀 Features

- **Decentralized Identity Management**: Create and manage ENS-based identities with reputation scoring
- **Secure Token Swapping**: Powered by 1inch API for optimal swap rates
- **Reputation System**: Build trust through transaction history and identity verification
- **Multi-Network Support**: Currently deployed on Hedera Testnet with plans for Ethereum mainnet
- **Modern UI/UX**: Clean, professional interface with responsive design

## 🏗️ Architecture

```
ENSwap/
├── frontend/          # React + TypeScript frontend application
├── contracts/         # Smart contracts (Solidity + Hardhat)
├── docs/             # Documentation and guides
└── scripts/          # Deployment and utility scripts
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Wagmi** + **RainbowKit** for Web3 integration
- **1inch API** for token swapping

### Smart Contracts
- **Solidity** for contract development
- **Hardhat** for development and deployment
- **OpenZeppelin** for security standards
- **Hedera Testnet** for deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Smart Contract Setup
```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

## 📖 Documentation

- [Frontend Documentation](./frontend/README.md)
- [Smart Contract Documentation](./contracts/README.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🔧 Configuration

### Environment Variables
Create `.env` files in both frontend and contracts directories:

**Frontend (.env)**
```
VITE_ONE_INCH_API_KEY=your_1inch_api_key
VITE_CONTRACT_ADDRESS=deployed_contract_address
VITE_PROJECT_ID=walletconnect_project_id
```

**Contracts (.env)**
```
PRIVATE_KEY=your_private_key
HEDERA_NETWORK=testnet
```

## 🌐 Networks

- **Hedera Testnet**: Primary deployment network
- **Ethereum Mainnet**: Planned for production
- **Sepolia Testnet**: For testing and development

## 📝 Smart Contract Details

**Contract Address**: `0xEe58d185f59e01034527d95FDd85236fa245Ea9f`
**Network**: Hedera Testnet
**Deployment**: September 27, 2025

### Key Functions
- `createIdentity(ensName, did)` - Create decentralized identity
- `getIdentity(address)` - Retrieve user identity
- `logReceipt(user, ensName, swapDetails, timestamp)` - Log transaction receipts
- `getReputationScore(address)` - Get user reputation score

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [1inch](https://1inch.io/) for DEX aggregation
- [Hedera](https://hedera.com/) for blockchain infrastructure
- [OpenZeppelin](https://openzeppelin.com/) for smart contract standards
- [RainbowKit](https://www.rainbowkit.com/) for wallet connection UI

## 📞 Support

For support and questions:
- Create an issue in this repository
- Join our Discord community
- Contact: [tummapudianurag@gmail.com]

---

**Built with ❤️ for the Web3 community**
