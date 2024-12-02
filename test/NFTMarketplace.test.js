const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
    let nftMarketplace, mockNFT, deployer, seller, buyer;

    beforeEach(async function () {
        [deployer, seller, buyer] = await ethers.getSigners();

        // Deploy MockNFT contract
        // Deploy MockNFT contract
        const MockNFT = await ethers.getContractFactory("MockERC721");
        mockNFT = await MockNFT.deploy();
        await mockNFT.deployed();

        // Deploy NFTMarketplace contract
        // Deploy NFTMarketplace contract
        const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        nftMarketplace = await NFTMarketplace.deploy();
        await nftMarketplace.deployed();
    });

    it("Should list an NFT for sale", async function () {
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        const listing = await nftMarketplace.cardToListingItem(1);
        expect(listing.tokenId.toString()).to.equal(tokenId.toString());
        expect(listing.listPrice.toString()).to.equal(price.toString());
        expect(listing.seller).to.equal(seller.address);
    });

    it("Should allow a buyer to purchase a listed NFT", async function () {
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        await nftMarketplace.connect(buyer).buyCard(1, { value: price });

        const newOwner = await mockNFT.ownerOf(tokenId);
        expect(newOwner).to.equal(buyer.address);

        const listing = await nftMarketplace.cardToListingItem(1);
        expect(listing.owner).to.equal(buyer.address);
    });

    it("Should allow the seller to cancel an NFT listing", async function () {
    it("Should allow the seller to cancel an NFT listing", async function () {
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;
    
    
        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);
    
        // Cancel the listing
        await nftMarketplace.connect(seller).cancelListing(1);
    
        // Verify NFT is returned to the seller
        const owner = await mockNFT.ownerOf(tokenId);
        expect(owner).to.equal(seller.address);
    
        // Verify the listing is removed (check for default values)
        const listing = await nftMarketplace.cardToListingItem(1);
        expect(listing.cardItemId.toString()).to.equal("0"); // Use toString() for comparison
        expect(listing.nftAddress).to.equal(ethers.constants.AddressZero); // Default address
        expect(listing.seller).to.equal(ethers.constants.AddressZero); // Default address
        expect(listing.owner).to.equal(ethers.constants.AddressZero); // Default address
        expect(listing.listPrice.toString()).to.equal("0"); // Use toString() for comparison
    });
    
    
    

    it("Should revert if a non-seller tries to cancel a listing", async function () {
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        try {
            await nftMarketplace.connect(buyer).cancelListing(1);
        } catch (error) {
            expect(error.message).to.include("Only card sellers are allowed to cancel listing");
        }
    });

    it("Should revert if a canceled NFT is already sold", async function () {
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        await nftMarketplace.connect(buyer).buyCard(1, { value: price });

        try {
            await nftMarketplace.connect(seller).cancelListing(1);
        } catch (error) {
            expect(error.message).to.include("Card already has a new owner unable to delete listing");
        }
    
        // Cancel the listing
        await nftMarketplace.connect(seller).cancelListing(1);
    
        // Verify NFT is returned to the seller
        const owner = await mockNFT.ownerOf(tokenId);
        expect(owner).to.equal(seller.address);
    
        // Verify the listing is removed (check for default values)
        const listing = await nftMarketplace.cardToListingItem(1);
        expect(listing.cardItemId.toString()).to.equal("0"); // Use toString() for comparison
        expect(listing.nftAddress).to.equal(ethers.constants.AddressZero); // Default address
        expect(listing.seller).to.equal(ethers.constants.AddressZero); // Default address
        expect(listing.owner).to.equal(ethers.constants.AddressZero); // Default address
        expect(listing.listPrice.toString()).to.equal("0"); // Use toString() for comparison
    });
    
    
    

    it("Should revert if a non-seller tries to cancel a listing", async function () {
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        try {
            await nftMarketplace.connect(buyer).cancelListing(1);
        } catch (error) {
            expect(error.message).to.include("Only card sellers are allowed to cancel listing");
        }
    });

    it("Should revert if a canceled NFT is already sold", async function () {
        const tx = await mockNFT.connect(seller).mint(seller.address);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId;

        await mockNFT.connect(seller).approve(nftMarketplace.address, tokenId);
        const price = ethers.utils.parseEther("1");
        await nftMarketplace.connect(seller).listCard(mockNFT.address, tokenId, price);

        await nftMarketplace.connect(buyer).buyCard(1, { value: price });

        try {
            await nftMarketplace.connect(seller).cancelListing(1);
        } catch (error) {
            expect(error.message).to.include("Card already has a new owner unable to delete listing");
        }
    });
});