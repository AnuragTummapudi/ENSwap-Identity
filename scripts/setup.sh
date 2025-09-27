#!/bin/bash

# ENSwap Setup Script
# This script sets up the entire ENSwap project for development

echo "🚀 Setting up ENSwap project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -f package.json ]; then
    echo "❌ Frontend package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Install contract dependencies
echo "📦 Installing contract dependencies..."
cd ../contracts
if [ ! -f package.json ]; then
    echo "❌ Contracts package.json not found!"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install contract dependencies"
    exit 1
fi

echo "✅ Contract dependencies installed"

# Compile contracts
echo "🔨 Compiling smart contracts..."
npx hardhat compile
if [ $? -ne 0 ]; then
    echo "❌ Failed to compile contracts"
    exit 1
fi

echo "✅ Smart contracts compiled"

# Check for environment files
echo "🔧 Checking environment configuration..."

cd ../frontend
if [ ! -f .env ]; then
    echo "⚠️  Frontend .env file not found. Creating template..."
    cat > .env << EOF
# 1inch API Configuration
VITE_ONE_INCH_API_KEY=your_1inch_api_key_here

# Smart Contract Configuration
VITE_CONTRACT_ADDRESS=0xEe58d185f59e01034527d95FDd85236fa245Ea9f

# WalletConnect Project ID
VITE_PROJECT_ID=your_walletconnect_project_id_here
EOF
    echo "📝 Created frontend/.env template. Please update with your actual values."
fi

cd ../contracts
if [ ! -f .env ]; then
    echo "⚠️  Contracts .env file not found. Creating template..."
    cat > .env << EOF
# Hedera Configuration
PRIVATE_KEY=your_private_key_here
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=your_account_id_here
HEDERA_PRIVATE_KEY=your_private_key_here
EOF
    echo "📝 Created contracts/.env template. Please update with your actual values."
fi

# Run tests
echo "🧪 Running contract tests..."
npx hardhat test
if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed. Check the output above."
else
    echo "✅ All tests passed"
fi

cd ..

echo ""
echo "🎉 ENSwap setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update environment variables in frontend/.env and contracts/.env"
echo "2. Get your 1inch API key from https://portal.1inch.dev/"
echo "3. Get your WalletConnect Project ID from https://cloud.walletconnect.com/"
echo "4. Start development server: cd frontend && npm run dev"
echo "5. Deploy contracts: cd contracts && npx hardhat run scripts/deploy.js --network hedera-testnet"
echo ""
echo "📚 Documentation: ./docs/README.md"
echo "🔗 GitHub: https://github.com/AnuragTummapudi/ENSwap-Identity"
echo ""
