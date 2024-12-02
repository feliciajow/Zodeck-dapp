require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // Make sure this matches your Solidity version
  networks: {
    sepolia: {
      url: process.env.API_URL, // Replace with your Infura endpoint
      accounts: [process.env.PRIVATE_KEY], // Replace with the private key of your account (without 0x)
      gas: 3000000,
      gasPrice: 1000000000,
    }
  }
};
