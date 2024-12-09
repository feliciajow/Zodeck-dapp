// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ownable.sol";
import "./test.sol";
import "contracts/safemath.sol";

contract CardMintPack is ERC721URIStorage, VRFConsumerBaseV2Plus, NFTplace {
    using SafeMath for uint256;
    //Keeps track of minted NFTS
    uint256 private _tokenIds;
    uint256[] public s_randomWords;
    uint256 public nextTokenId;

    // Chainlink VRF variables
    uint256 public s_subscriptionId;
    bytes32 public s_keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 public callbackGasLimit = 2000000;
    uint16 public requestConfirmations = 3;
    uint32 public numWords = 5;
    string public baseURI = "https://apricot-cheerful-alpaca-636.mypinata.cloud/ipfs/bafybeif4wde6i453uhad2bs63ay4nip3ml2q7x3jhffmo4lkd2z52uipmi/";
    bool enableNativePayment;

    // Pack supply control variables
    uint256 public packPrice = 0.001 ether;
    uint256 public packsAvailable = 100;
    uint256 public totalPacksSold;


    mapping(uint256 => address) public s_requestToSender; // Maps requestId to user
    mapping(uint256 => bool) private tokenExists; // Prevent duplicate token minting
    mapping(address => uint256[]) private userMintedTokens; // Tracks tokens per user
    mapping(uint256 => uint256[]) private requestIdToTokenIds; // Maps requestId to tokenIds
    mapping(uint256 => uint256) public cardIndexes; // maps tokenId to cardIndex

    event RandomnessRequested(uint256 requestId, address requester);
    event RandomnessFulfilled(uint256 requestId, uint256[] randomWords);
    event CardMinted(uint256 tokenId, address owner, string metadataURI);
    event PackPurchased(address indexed buyer, uint256 packId, uint256 requestId);


    constructor(
        uint256 subscriptionId
    )
        VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B) 
    {
        s_subscriptionId = subscriptionId;
        totalPacksSold = 0;
    }

    receive() external payable {
        require(packsAvailable > 0, "All card packs are currently sold out");
        require(msg.value == packPrice, "Incorrect payment amount");
        
        totalPacksSold = totalPacksSold.add(1);
        packsAvailable = packsAvailable.sub(1);

        requestRandomWords();
    }

    // Request random numbers
    function requestRandomWords() public returns (uint256 requestId) {
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: enableNativePayment})
                )
            })
        );
        s_requestToSender[requestId] = msg.sender;
        emit RandomnessRequested(requestId, msg.sender);
        return requestId;
    }

    // Fulfill random numbers from VRF
    function fulfillRandomWords(uint256 _requestId, uint256[] calldata _randomWords) internal override {
        s_randomWords = _randomWords;
        batchMint(_randomWords, s_requestToSender[_requestId], _requestId);
    }

function batchMint(
        uint256[] memory _randomWords, address recipient, uint256 requestId
    ) public {
        require(_randomWords.length == numWords, "Expected X random numbers");
        require(recipient != address(0), "Recipient address is invalid");

        uint256[] memory mintedTokenIds = new uint256[](_randomWords.length);

        for (uint256 i = 0; i < _randomWords.length; i++) {
            uint256 cardIndex = _randomWords[i] % 20; // Determine card index
            string memory uri = string(abi.encodePacked(baseURI, "Card ", Strings.toString(cardIndex), ".png"));

            // Track the minted token and increment the token ID
            uint256 tokenId = createToken(uri, recipient, cardIndex);
            mintedTokenIds[i] = tokenId;
            cardIndexes[tokenId] = cardIndex;

            emit CardMinted(tokenId, recipient, uri);
        }

        // Track minted tokens for the recipient
        for (uint256 i = 0; i < mintedTokenIds.length; i++) {
            userMintedTokens[recipient].push(mintedTokenIds[i]);
            requestIdToTokenIds[requestId].push(mintedTokenIds[i]);
        }
    }

    // Helper to fetch minted tokens for a user
    function getMintedTokens(address user) public view returns (uint256[] memory) {
        return userMintedTokens[user];
    }

    // Helper to fetch minted tokens for a request
    function getMintedTokensFromRequest(uint256 requestId) public view returns (uint256[] memory) {
        return requestIdToTokenIds[requestId];
    }

    // Helper to fetch cardIndex for a tokenId
    function getCardIndexFromId(uint256 tokenId) public view returns (uint256) {
        return cardIndexes[tokenId];
    }

    // Update the base URI for metadata
    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function withdraw() external onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    function updatePacksAvailable(uint256 newQty) external onlyOwner {
        // reset the number of packs available
        packsAvailable = newQty;
    }    
    
    function updatePackPrice(uint256 newPrice) external onlyOwner {
        // newPrice in wei
        packPrice = newPrice;
    }

    function getPacksAvailable() external view returns (uint) {
        return packsAvailable;
    }

    function getTotalPacksSold() external view returns (uint) {
        return totalPacksSold;
    }

    function getNativePayment() external view returns (string memory) {
        if (enableNativePayment) {
            return "VRF gas fees in ETH";
        }
        else {
            return "VRF gas fees in LINK";
        }
    }

    function setNativePayment(bool _enableNativePayment) external onlyOwner {
        enableNativePayment = _enableNativePayment;
    }
}
