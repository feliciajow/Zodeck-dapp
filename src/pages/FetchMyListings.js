import React, { useEffect } from 'react';
import './Landing.js';
const ethers = require('ethers');
require("dotenv").config();
//require('./Landing.css'); 
 

const CONTRACT_ADDRESS = "0x617D607f74b5F17D50a2356521a1b25574Cf667c";

// For Hardhat 
const contract = require("../abi/NFTplace.json");

const uri = "https://localhost:3000/Images/Images/"

const priceTag = "0.0005" ;

//console.log(JSON.stringify(contract.abi));

// Provider
//const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
//const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
//const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

const FetchMyListing = ({ setListings }) => {
    useEffect(() => {
        const fetchListings = async () => {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const nftMarketplaceContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);
            const myListings = await nftMarketplaceContract.fetchItemsListed(); 
            // Store the fetched listings in state
            setListings(myListings); 
          } catch (error) {
            console.error("Error in fetch listing", error);
          }
    };
        fetchListings();
        
    }, [setListings]);
    //no need display the logic, just the ui
    return ( null );
};

export default FetchMyListing;

// async function main() {
//     const myListings = await nftMarketplaceContract.fetchItemsListed(); 
//     console.log(myListings)
// }
// main();