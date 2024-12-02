const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy the contract
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace"); 
    console.log("Deploying NFTMarketplace...");
    const nftMarketplace = await NFTMarketplace.deploy(); // Deploy transaction

    console.log("NFTMarketplace deployed to:", nftMarketplace.address); // Log the address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
