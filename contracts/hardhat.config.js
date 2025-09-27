require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hederaTestnet: {
      url: "https://testnet.hashio.io/api",
      accounts: ["0x0f6951fa0d47cf3463411ff689666ee8a00cf3ba5b4c9578cb2eb39d19340509"],
      chainId: 296,
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
};
