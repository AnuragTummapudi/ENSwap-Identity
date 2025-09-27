# ENSwap Documentation

This directory contains comprehensive documentation for the ENSwap project.

## 📚 Documentation Structure

- [API Documentation](./api.md) - Complete API reference
- [Deployment Guide](./deployment.md) - Step-by-step deployment instructions
- [Architecture](./architecture.md) - System architecture and design decisions
- [Smart Contracts](./smart-contracts.md) - Smart contract documentation
- [Frontend Guide](./frontend.md) - Frontend development guide
- [Integration Guide](./integration.md) - How to integrate with ENSwap

## 🚀 Quick Start

1. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Smart Contract Development**
   ```bash
   cd contracts
   npm install
   npx hardhat compile
   npx hardhat test
   ```

3. **Deployment**
   ```bash
   cd contracts
   npx hardhat run scripts/deploy.js --network hedera-testnet
   ```

## 🔧 Configuration

### Environment Variables

Create `.env` files in the respective directories:

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
HEDERA_ACCOUNT_ID=your_account_id
HEDERA_PRIVATE_KEY=your_private_key
```

## 📝 Smart Contract Details

- **Contract Address**: `0xEe58d185f59e01034527d95FDd85236fa245Ea9f`
- **Network**: Hedera Testnet
- **Deployment Date**: September 27, 2025

## 🌐 Supported Networks

- Hedera Testnet (Primary)
- Ethereum Mainnet (Planned)
- Sepolia Testnet (Development)

## 🤝 Contributing

Please read our [Contributing Guidelines](../CONTRIBUTING.md) before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
