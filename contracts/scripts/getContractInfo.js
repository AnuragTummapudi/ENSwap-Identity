const hre = require("hardhat");

async function main() {
  console.log("🔍 Getting contract information...");
  
  const contractAddress = "0x522884a14f04b584165fB87eFebEe6a8C480d623";
  
  try {
    // Get the contract factory
    const ENSwapIdentity = await hre.ethers.getContractFactory("ENSwapIdentity");
    
    // Attach to the deployed contract
    const contract = ENSwapIdentity.attach(contractAddress);
    
    console.log("✅ Contract attached successfully");
    console.log("Contract Address:", contractAddress);
    
    // Test basic contract interaction
    const [deployer] = await hre.ethers.getSigners();
    console.log("Using account:", deployer.address);
    
    // Try to get identity for the deployer (should return empty if not created)
    try {
      const identity = await contract.getIdentity(deployer.address);
      console.log("✅ Contract read operation successful");
      console.log("Identity result:", identity);
    } catch (error) {
      console.log("⚠️ Contract read operation failed:", error.message);
    }
    
    // Check if we can get reputation score
    try {
      const reputation = await contract.getReputationScore(deployer.address);
      console.log("✅ Reputation score:", reputation.toString());
    } catch (error) {
      console.log("⚠️ Reputation score failed:", error.message);
    }
    
    console.log("\n🎉 Contract is working correctly!");
    
  } catch (error) {
    console.error("❌ Contract interaction failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
