require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const SmartWalletContract = await ethers.getContractFactory("SmartWalletContract");
  const smartWallet = await SmartWalletContract.deploy();

  await smartWallet.deployed();

  console.log("SmartWalletContract deployed to:", smartWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
