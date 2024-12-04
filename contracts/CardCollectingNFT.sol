// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./safemath.sol";
import "./ownable.sol";

contract CardCollectingNFT is ERC721URIStorage, Ownable {
    using SafeMath for uint256;

    constructor() ERC721("CardCollectingNFT", "CCNFT") {}

    uint256 public nextTokenId;
    address public randomnessProvider;
    string public baseURI = "https://localhost:3000/Images/Images/";

    mapping(uint256 => string) public cardImages; // Maps tokenId to card image URI
    // Mapping to track the NFTs minted by each user
    mapping(address => uint256[]) private userMintedTokens;
    // Mapping to check if a token has already been minted
    mapping(uint256 => bool) private tokenExists;

    event CardMinted(uint256 tokenId, address owner, string image);

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function setRandomnessProvider(address _provider) public onlyOwner {
        randomnessProvider = _provider;
    }

    function getRandomnessProvider() external view returns (address) {
        return randomnessProvider;
    }

    // Process an array of 10 random numbers from the VRF contract
    function processRandomNumbers(
        address recipient,
        uint256 requestId,
        uint256[] calldata randomNumbers
    ) external {
        require(
            randomnessProvider != address(0),
            "Randomness provider not set"
        );
        require(
            msg.sender == randomnessProvider,
            "Caller is not the randomness provider"
        );
        require(randomNumbers.length == 10, "Expected 10 random numbers");
        for (uint256 i = 0; i < randomNumbers.length; i++) {
            // Mod each random number by 20 to get the card index (0-19)
            uint256 cardIndex = (randomNumbers[i] % 20);

            // Generate the card image name (e.g., "Card 1.png")
            string memory cardImage = string(
                abi.encodePacked("Card ", _uintToString(cardIndex), ".png")
            );

            // Mint the NFT
            uint256 tokenId = nextTokenId;
            nextTokenId = nextTokenId + 1;
            _safeMint(recipient, tokenId);
            _setTokenURI(
                tokenId,
                string(
                    abi.encodePacked(
                        baseURI,
                        "Card ",
                        _uintToString(cardIndex),
                        ".png"
                    )
                )
            );

            // Store the card image
            cardImages[tokenId] = cardImage;
            userMintedTokens[recipient].push(tokenId);
            emit CardMinted(tokenId, recipient, cardImage);
        }
    }

    // Function to get all tokens minted by a user
    function getMintedTokens(
        address user
    ) public view returns (uint256[] memory) {
        return userMintedTokens[user];
    }

    // Helper function to convert uint256 to string
    function _uintToString(uint256 value) private pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
