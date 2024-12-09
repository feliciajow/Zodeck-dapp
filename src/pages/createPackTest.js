const ethers = require('ethers');
require("dotenv").config();

const config = require('../abi/config.json');
const CONTRACT_ADDRESS = config.MINT_CONTRACT_ADDRESS;
const contract = require("../abi/CardMintPack.json");

// Provider
const provider = new ethers.JsonRpcProvider(process.env.API_URL);
// Signer
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// Contract
const packContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {
  // const checkRequestFulfillment = async (contract, requestId) => {
  //   for (let i = 0; i < MAX_RETRIES; i++) {
  //     console.log(`Checking fulfillment attempt ${i + 1}...`);
  //     const { fulfilled } = await contract.getRequestStatus(requestId);
  //     if (fulfilled) {
  //       console.log("Randomness request fulfilled.");
  //       return true;
  //     }
  //     await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS)); // Wait before next check
  //   }
  //   return false;
  // };
  // // Request randomness from Chainlink VRF
  // const tx = await packContract.requestRandomWords();
  // const receipt = await tx.wait();

  // const iface = new ethers.Interface(contract.abi);
  // const eventTopic = iface.getEvent("RandomnessRequested").topicHash;

  // // Find the log with the matching topic
  // const log = receipt.logs.find((log) =>
  //   log.topics.includes(eventTopic)
  // );

  // if (!log) {
  //   throw new Error("Randomness request event not found.");
  // }

  // // Decode the log
  // const decodedLog = iface.decodeEventLog("RandomnessRequested", log.data, log.topics);

  // const requestId = decodedLog.requestId.toString();

  // // Retry checking fulfillment
  // const isFulfilled = await checkRequestFulfillment(packContract, requestId);
  // if (!isFulfilled) {
  //   throw new Error("Randomness request not fulfilled.");
  // }

  // // Batch mint the cards
  // const mintTx = await packContract.batchMint(requestId);
  // await mintTx.wait();
  // console.log("Minted new cards successfully!");

  // // Return the account that minted the cards
  // const account = await signer.getAddress();
  // return account;

  ////////////////

  // const native = await packContract.getNativePayment();
  // console.log(native);
  // // const tx = await packContract.setNativePayment(true);
  // const tx = await packContract.requestRandomWords();
  // console.log(tx);

  // const withdraw = await packContract.withdraw();
  // console.log(withdraw);
  const tx = await packContract.fetchMyNFTs();
  console.log(tx);

}
main();
