// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {VRFV2WrapperConsumerBase} from "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";

contract CardCollectingNFT is
    ERC721Enumerable,
    Ownable,
    VRFV2WrapperConsumerBase
{
    uint256 public nextTokenId;

    struct Card {
        string rarity;
        string feature;
    }

    mapping(uint256 => Card) public cardDetails; // Token ID to Card mapping
    mapping(bytes32 => address) private requestToSender; // VRF request ID to user mapping

    uint32 public callbackGasLimit = 100000; // Gas limit for the callback
    uint16 public requestConfirmations = 3; // Number of confirmations
    uint32 public numWords = 1; // Number of random words to request
    uint256 public fee = 0.1 * 10 ** 18; // Fee in LINK (adjust based on your network)

    // Constructor
    constructor(
        address linkAddress,
        address vrfV2Wrapper
    )
        ERC721("CardCollectingNFT", "CCNFT")
        VRFV2WrapperConsumerBase(linkAddress, vrfV2Wrapper)
        Ownable(msg.sender)
    {}

    function mintCard() external payable returns (uint256 requestId) {
        require(msg.value >= fee, "Insufficient payment for minting");

        // Request randomness from Chainlink
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );

        // Map the request ID to the user's address
        requestToSender[bytes32(requestId)] = msg.sender;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address minter = requestToSender[bytes32(requestId)];
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        // Generate card traits based on randomness
        uint256 randomness = randomWords[0];
        string memory rarity = _randomRarity(randomness);
        string memory feature = _randomFeature(randomness);

        // Save the card details
        cardDetails[tokenId] = Card(rarity, feature);

        // Mint the NFT
        _safeMint(minter, tokenId);
    }

    function _randomRarity(
        uint256 randomness
    ) private pure returns (string memory) {
        uint256 rand = randomness % 100;
        if (rand < 60) return "Common";
        if (rand < 90) return "Rare";
        return "Legendary";
    }

    function _randomFeature(
        uint256 randomness
    ) private pure returns (string memory) {
        uint256 rand = (randomness / 100) % 5;
        if (rand == 0) return "Fire";
        if (rand == 1) return "Water";
        if (rand == 2) return "Earth";
        if (rand == 3) return "Air";
        return "Electric";
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
