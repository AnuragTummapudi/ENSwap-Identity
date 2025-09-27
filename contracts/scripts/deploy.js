const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ENSwap with account:", deployer.address);

  const ENSwap = await ethers.getContractFactory("ENSwapIdentity");
  const enswap = await ENSwap.deploy();
  await enswap.waitForDeployment();

  console.log("ENSwap deployed to:", await enswap.getAddress());
  
  // Save the contract address for frontend integration
  const contractInfo = {
    address: await enswap.getAddress(),
    network: "hederaTestnet",
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('./deployment-info.json', JSON.stringify(contractInfo, null, 2));
  console.log("Contract info saved to deployment-info.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
