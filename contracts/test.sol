// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "./safemath.sol";

contract NFTplace is ERC721URIStorage {
    uint256 private _tokenIds;
    uint256 private _unsoldItemCount;
    uint256 listingPrice = 0.0001 ether;
    address payable contract_owner;
    using SafeMath for uint256;

    mapping(uint256 => Listing) private cardToListingItem;
    struct Listing {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        uint256 cardIndex;
    }
    event ListingCreated (
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        uint256 cardIndex
    );

    event ListingRemoved (
        uint256 indexed tokenId,
        address seller
    );
    
    constructor() ERC721("Zodeck Cards", "ZDK") {
        contract_owner = payable(msg.sender);
    }
    function getContractOwner() public view returns (address) {
        return contract_owner;
    }
    function createToken(string memory tokenURI, address recipient, uint256 _cardIndex) public payable returns (uint) {
        _tokenIds = _tokenIds.add(1);
        uint256 newTokenId = _tokenIds;
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        cardToListingItem[newTokenId] = Listing(newTokenId, payable(address(0)),payable(recipient),0,true, _cardIndex);
        return newTokenId;
    }
    function getListingPrice() public view returns (uint256){
        return listingPrice;
    }
    function listCard(uint256 tokenId, uint256 price) public payable  {
        createListing(tokenId, price);
    }

    //Marketplace
    function createListing(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        _unsoldItemCount = _unsoldItemCount.add(1);
        cardToListingItem[tokenId].seller = payable(msg.sender);
        cardToListingItem[tokenId].owner = payable(address(this));
        cardToListingItem[tokenId].price = price;
        cardToListingItem[tokenId].sold = false;
        _transfer(msg.sender, address(this), tokenId);
        emit ListingCreated(tokenId,msg.sender,address(this),price,false, cardToListingItem[tokenId].cardIndex);
    }

    //Marketplace
    // function removeListing(uint256 tokenId, uint256 price) private {
    //     require(owner==msg.sender, "Only owner of NFT is allowed to remove listing");
    //     require(!cardToListingItem[tokenId].sold, "Listing cannot be removed, has been sold");
    //     //cardToListingItem[tokenId] =  Listing(tokenId,payable(msg.sender),payable(address(this)),price,false);
    //     _transfer(address(this), msg.sender, tokenId);
    //     emit ListingCreated(tokenId,msg.sender,address(this),price,false);
    // }

    //Marketplace
    // function updateListingPrice(uint _listingPrice) public payable {
    //     require(owner == msg.sender, "Only marketplace owner can update listing price.");
    //     listingPrice = _listingPrice;
    // }

    //Marketplace
    function purchaseCard(uint256 tokenId) public payable {
        //uint price = cardToListingItem[tokenId].price;
        address payable creator = cardToListingItem[tokenId].seller;
        //require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        //new owner/ buyer of card is msg.sender
        cardToListingItem[tokenId].owner = payable(msg.sender);
        cardToListingItem[tokenId].sold = true;
        //assign listing seller to null address
        cardToListingItem[tokenId].seller = payable(address(0));
        _unsoldItemCount = _unsoldItemCount.sub(1);
        //transfer of NFT from this contract to buyer (Card ownership transfer)
        _transfer(address(this), msg.sender, tokenId);
        //collect money from buyer
        //owner is NFT marketplace
        payable(contract_owner).transfer(listingPrice);
        //creator is lister of card == seller
        payable(creator).transfer(msg.value);
    }
    //all listing in this NFT marketplace (Marketplace)
    function fetchListingMarketplace() public view returns (Listing[] memory) {
        uint itemCount = _tokenIds;
        // uint unsoldItemCount = _tokenIds - _itemsSold;
        uint currentIndex = 0;
        Listing[] memory items = new Listing[](_unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            //address(this) address belonging to this contract
            if (cardToListingItem[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                Listing storage currentItem = cardToListingItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex = currentIndex.add(1);
            }
        }
        return items;
    }

    //msg.sender who call this function eg lister of card (Marketplace)
    function fetchItemsListed() public view returns (Listing[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;
        for (uint i = 0; i < totalItemCount; i++) {
            if (cardToListingItem[i + 1].seller == msg.sender) {
                itemCount = itemCount.add(1);
            }
        }
        Listing[] memory items = new Listing[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (cardToListingItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                Listing storage currentItem = cardToListingItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex = currentIndex.add(1);
            }
        }
        return items;
    }

    //collection of NFTs (Collection)
    function fetchMyNFTs() public view returns (Listing[] memory) {
        uint totalItemCount = _tokenIds;
        uint itemCount = 0;
        uint currentIndex = 0;
        for (uint i = 0; i < totalItemCount; i++) {
        // check if nft is mine
            if (cardToListingItem[i + 1].owner == msg.sender) {
                itemCount = itemCount.add(1);
            }
        }
        Listing[] memory items = new Listing[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (cardToListingItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                Listing storage currentItem = cardToListingItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex = currentIndex.add(1);
            }
        }
        return items;
    }
    

}



//collection of NFTs (Collection)
    // function fetchItems(bool myNFT) public view returns (Listing[] memory) {
    //     uint totalItemCount = _tokenIds;
    //     uint itemCount = 0;
    //     uint currentIndex = 0;
    //     for (uint i = 0; i < totalItemCount; i++) {
    //         if (myNFT){
    //             // check if nft is mine
    //             if (cardToListingItem[i + 1].owner == msg.sender) {
    //                 itemCount += 1;
    //             }
    //         } else {
    //             //msg.sender who call this function eg lister of card (Marketplace)
    //             if (cardToListingItem[i + 1].seller == msg.sender) {
    //                 itemCount += 1;
    //             }
    //         }
    //     }
    //     Listing[] memory items = new Listing[](itemCount);
    //     for (uint i = 0; i < totalItemCount; i++) {
    //         if (myNFT){
    //             // check if nft is mine
    //             if (cardToListingItem[i + 1].owner == msg.sender) {
    //                 uint currentId = i + 1;
    //                 Listing storage currentItem = cardToListingItem[currentId];
    //                 items[currentIndex] = currentItem;
    //                 currentIndex += 1;
    //             }
    //         } else {
    //             //msg.sender who call this function eg lister of card (Marketplace)
    //             if (cardToListingItem[i + 1].seller == msg.sender) {
    //                 uint currentId = i + 1;
    //                 Listing storage currentItem = cardToListingItem[currentId];
    //                 items[currentIndex] = currentItem;
    //                 currentIndex += 1;
    //             }
    //         }
    //     }
    //     return items;
    // }