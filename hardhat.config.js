require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.ALCHEMY_API_KEY,
      accounts: process.env.PRIVATE_KEY,
    },
  },
};