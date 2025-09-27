#!/bin/bash

# ENSwap Deployment Script
# This script deploys the ENSwap smart contracts

echo "🚀 Deploying ENSwap contracts..."

# Check if we're in the right directory
if [ ! -d "contracts" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

cd contracts

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it with your configuration."
    exit 1
fi

# Check if contracts are compiled
if [ ! -d "artifacts" ]; then
    echo "🔨 Compiling contracts..."
    npx hardhat compile
    if [ $? -ne 0 ]; then
        echo "❌ Failed to compile contracts"
        exit 1
    fi
fi

# Run tests first
echo "🧪 Running tests..."
npx hardhat test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Please fix issues before deploying."
    exit 1
fi

echo "✅ Tests passed"

# Deploy to Hedera Testnet
echo "🌐 Deploying to Hedera Testnet..."
npx hardhat run scripts/deploy.js --network hedera-testnet

if [ $? -eq 0 ]; then
    echo "✅ Contract deployed successfully!"
    echo ""
    echo "📋 Deployment Summary:"
    echo "- Network: Hedera Testnet"
    echo "- Contract Address: Check deployment-info.json"
    echo "- Transaction Hash: Check console output above"
    echo ""
    echo "🔗 Verify on Hedera Explorer: https://hashscan.io/testnet"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update frontend/.env with the new contract address"
    echo "2. Test the deployment with the frontend application"
    echo "3. Consider running security tests"
else
    echo "❌ Deployment failed"
    exit 1
fi
