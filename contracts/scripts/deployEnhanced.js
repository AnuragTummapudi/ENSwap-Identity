const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Enhanced ENSwap Contracts to Hedera Testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy ENSwapIdentity (original contract)
  console.log("\n📝 Deploying ENSwapIdentity contract...");
  const ENSwapIdentity = await ethers.getContractFactory("ENSwapIdentity");
  const ensSwapIdentity = await ENSwapIdentity.deploy();
  await ensSwapIdentity.waitForDeployment();
  const ensSwapIdentityAddress = await ensSwapIdentity.getAddress();
  console.log("✅ ENSwapIdentity deployed to:", ensSwapIdentityAddress);

  // Deploy ENSSwapIntegration (enhanced ENS features)
  console.log("\n🌐 Deploying ENSSwapIntegration contract...");
  const ENSSwapIntegration = await ethers.getContractFactory("ENSSwapIntegration");
  const ensSwapIntegration = await ENSSwapIntegration.deploy();
  await ensSwapIntegration.waitForDeployment();
  const ensSwapIntegrationAddress = await ensSwapIntegration.getAddress();
  console.log("✅ ENSSwapIntegration deployed to:", ensSwapIntegrationAddress);

  // Deploy HederaENSSwap (Hedera-specific features)
  console.log("\n🏎️ Deploying HederaENSSwap contract...");
  const HederaENSSwap = await ethers.getContractFactory("HederaENSSwap");
  const hederaENSSwap = await HederaENSSwap.deploy();
  await hederaENSSwap.waitForDeployment();
  const hederaENSSwapAddress = await hederaENSSwap.getAddress();
  console.log("✅ HederaENSSwap deployed to:", hederaENSSwapAddress);

  // Save deployment info
  const deploymentInfo = {
    network: "hederaTestnet",
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      ENSwapIdentity: {
        address: ensSwapIdentityAddress,
        description: "Core identity and reputation management"
      },
      ENSSwapIntegration: {
        address: ensSwapIntegrationAddress,
        description: "Enhanced ENS integration with creative subname features"
      },
      HederaENSSwap: {
        address: hederaENSSwapAddress,
        description: "Hedera-specific features with HTS and HBAR support"
      }
    }
  };

  const fs = require('fs');
  fs.writeFileSync('./enhanced-deployment-info.json', JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 All contracts deployed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log("- ENSwapIdentity:", ensSwapIdentityAddress);
  console.log("- ENSSwapIntegration:", ensSwapIntegrationAddress);
  console.log("- HederaENSSwap:", hederaENSSwapAddress);
  
  console.log("\n🔗 Verify contracts on Hashscan:");
  console.log(`https://hashscan.io/testnet/contract/${ensSwapIdentityAddress}`);
  console.log(`https://hashscan.io/testnet/contract/${ensSwapIntegrationAddress}`);
  console.log(`https://hashscan.io/testnet/contract/${hederaENSSwapAddress}`);

  console.log("\n📝 Next steps:");
  console.log("1. Update frontend configuration with new contract addresses");
  console.log("2. Test all contract functions");
  console.log("3. Create demo video showcasing all features");
  console.log("4. Submit to ETHGlobal with enhanced partner prize alignment");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
