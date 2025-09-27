// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MusicNFT
 * @dev ERC-721 token for music files stored on Walrus/Tusky
 * @notice This contract allows minting NFTs with pre-formatted tokenURIs
 *         that reference files stored on Walrus decentralized storage
 */
contract MusicNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // Base URI for token metadata (can be overridden)
    string private _baseTokenURI;
    
    // MockPYUSD token contract
    IERC20 public immutable mockPYUSD;
    
    // Token prices (tokenId => price in MockPYUSD)
    mapping(uint256 => uint256) public tokenPrices;
    
    // Events
    event MusicMinted(address indexed to, uint256 indexed tokenId, string tokenURI);
    event MusicPurchased(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event PriceSet(uint256 indexed tokenId, uint256 price);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI,
        address _mockPYUSD
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
        mockPYUSD = IERC20(_mockPYUSD);
    }
    
    /**
     * @dev Mint a new music NFT to the specified address
     * @param to The address to mint the NFT to
     * @param tokenUriString The pre-formatted token URI (e.g., "tusky-walrus://uploadId")
     * @return tokenId The ID of the newly minted token
     */
    function mint(address to, string memory tokenUriString) public onlyOwner returns (uint256) {
        require(to != address(0), "MusicNFT: cannot mint to zero address");
        require(bytes(tokenUriString).length > 0, "MusicNFT: tokenURI cannot be empty");
        
        // Validate that the tokenURI follows the expected format for Walrus/Tusky
        require(
            _isValidWalrusURI(tokenUriString), 
            "MusicNFT: tokenURI must be a valid Walrus/Tusky URI (tusky-walrus://...)"
        );
        
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenUriString);
        
        emit MusicMinted(to, tokenId, tokenUriString);
        
        return tokenId;
    }
    
    /**
     * @dev Validate that the tokenURI follows the expected Walrus/Tusky format
     * @param tokenUriString The token URI to validate
     * @return True if the URI is valid
     */
    function _isValidWalrusURI(string memory tokenUriString) internal pure returns (bool) {
        bytes memory uriBytes = bytes(tokenUriString);
        if (uriBytes.length < 15) return false; // Minimum length for "tusky-walrus://"
        
        // Check if it starts with "tusky-walrus://"
        bytes memory prefix = "tusky-walrus://";
        if (uriBytes.length < prefix.length) return false;
        
        for (uint i = 0; i < prefix.length; i++) {
            if (uriBytes[i] != prefix[i]) return false;
        }
        
        return true;
    }
    
    /**
     * @dev Set the base URI for all tokens
     * @param baseURI The new base URI
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Override _baseURI to return the custom base URI
     * @return The base URI for token metadata
     */
    function _baseURI() internal view override(ERC721) returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Override tokenURI to handle both base URI and individual token URIs
     * @param tokenId The token ID
     * @return The token URI
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override supportsInterface to handle multiple inheritance
     * @param interfaceId The interface ID to check
     * @return True if the interface is supported
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Get the total number of tokens minted
     * @return The current token count
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
    
    /**
     * @dev Get the next token ID that will be minted
     * @return The next token ID
     */
    function nextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }
    
    /**
     * @dev Check if a token exists
     * @param tokenId The token ID to check
     * @return True if the token exists
     */
    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Set the price for a token (only owner)
     * @param tokenId The token ID
     * @param price The price in MockPYUSD
     */
    function setTokenPrice(uint256 tokenId, uint256 price) public onlyOwner {
        require(exists(tokenId), "MusicNFT: token does not exist");
        tokenPrices[tokenId] = price;
        emit PriceSet(tokenId, price);
    }
    
    /**
     * @dev Buy an NFT with MockPYUSD
     * @param tokenId The token ID to buy
     * @param buyer The address buying the NFT
     * @param amount The amount of MockPYUSD to pay
     */
    function buyNFT(uint256 tokenId, address buyer, uint256 amount) public {
        require(exists(tokenId), "MusicNFT: token does not exist");
        require(tokenPrices[tokenId] > 0, "MusicNFT: token not for sale");
        require(amount >= tokenPrices[tokenId], "MusicNFT: insufficient payment");
        require(buyer != address(0), "MusicNFT: invalid buyer address");
        
        address currentOwner = ownerOf(tokenId);
        require(currentOwner != buyer, "MusicNFT: cannot buy own token");
        
        // Transfer MockPYUSD from buyer to current owner
        require(
            mockPYUSD.transferFrom(buyer, currentOwner, tokenPrices[tokenId]),
            "MusicNFT: MockPYUSD transfer failed"
        );
        
        // Transfer NFT to buyer
        _transfer(currentOwner, buyer, tokenId);
        
        // Remove from sale
        tokenPrices[tokenId] = 0;
        
        emit MusicPurchased(buyer, tokenId, tokenPrices[tokenId]);
    }
    
    /**
     * @dev Get the price of a token
     * @param tokenId The token ID
     * @return The price in MockPYUSD
     */
    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        return tokenPrices[tokenId];
    }
    
    /**
     * @dev Check if a token is for sale
     * @param tokenId The token ID
     * @return True if the token is for sale
     */
    function isForSale(uint256 tokenId) public view returns (bool) {
        return tokenPrices[tokenId] > 0;
    }
}

