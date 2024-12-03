// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract RandomnessProvider is VRFConsumerBaseV2Plus {
    uint64 public s_subscriptionId; // Chainlink VRF subscription ID
    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/vrf/v2-5/supported-networks#configurations
    bytes32 public s_keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 40,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 public callbackGasLimit = 40000;
    // The default is 3, but you can set this higher.
    uint16 public requestConfirmations = 3;
    // For this example, retrieve 1 random value in one request.
    // Cannot exceed VRFCoordinatorV2_5.MAX_NUM_WORDS.
    uint32 public numWords = 10;
    address public nftContract; // Address of the NFT contract
    // Sepolia coordinator. For other networks,
    // see https://docs.chain.link/vrf/v2-5/supported-networks#configurations
    address public vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;
    mapping(uint256 => address) public requestToSender; // Map request IDs to users
    mapping(uint256 => uint256) public requestToRandomNumber; // Store randomness results

    event RandomnessRequested(uint256 requestId, address requester);
    event RandomnessFulfilled(uint256 requestId, uint256 randomNumber);

    constructor(uint64 subscriptionId) VRFConsumerBaseV2Plus(vrfCoordinator) {
        s_subscriptionId = subscriptionId;
    }

    // Set the NFT contract address (only owner can set)
    function setNFTContract(address _nftContract) external {
        require(nftContract == address(0), "NFT contract already set");
        nftContract = _nftContract;
    }

    // Request randomness for a user
    function requestRandomNumber()
        public
        onlyOwner
        returns (uint256 requestId)
    {
        // Request randomness from Chainlink
        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    // Set nativePayment to true to pay for VRF requests with Sepolia ETH instead of LINK
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        requestToSender[requestId] = msg.sender;
        emit RandomnessRequested(requestId, msg.sender);
    }

    // Fulfill randomness (called by Chainlink VRF)
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        require(randomWords.length == 10, "Expected 10 random words");

        // Notify NFT contract
        if (nftContract != address(0)) {
            (bool success, ) = nftContract.call(
                abi.encodeWithSignature(
                    "processRandomNumber(uint256,uint256)",
                    requestId,
                    randomWords
                )
            );
            require(success, "Failed to notify NFT contract");
        }

        emit RandomnessFulfilled(requestId, randomWords[0]);
    }
}
