// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CardCollectingNFT is ERC721URIStorage, Ownable {
    constructor() ERC721("CardCollectingNFT", "CCN") Ownable(msg.sender) {}

    uint256 public nextTokenId;
    address public randomnessProvider;

    struct Card {
        string rarity;
        string feature;
    }

    mapping(uint256 => Card) public cardDetails;

    event CardMinted(
        uint256 tokenId,
        address owner,
        string rarity,
        string feature
    );

    // Process random number from the VRF contract
    function processRandomNumbers(
        uint256 requestId,
        uint256[] calldata randomNumbers
    ) external {
        require(
            msg.sender == randomnessProvider,
            "Caller is not the randomness provider"
        );
        require(randomNumbers.length == 10, "Expected 10 random numbers");

        for (uint256 i = 0; i < randomNumbers.length; i++) {
            // Use randomness to generate traits
            string memory rarity = _randomRarity(randomNumbers[i]);
            string memory feature = _randomFeature(randomNumbers[i]);

            // Mint the NFT
            uint256 tokenId = nextTokenId;
            nextTokenId++;
            _safeMint(tx.origin, tokenId); // Mint to the user who initiated the randomness request

            // Store card details
            cardDetails[tokenId] = Card(rarity, feature);

            emit CardMinted(tokenId, tx.origin, rarity, feature);
        }
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
}
