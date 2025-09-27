// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MusicNFTV4 is ERC721, Ownable {
    // Token ID counter
    uint256 private _tokenIdCounter;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // PYUSD token contract
    IERC20 public pyusd;
    
    // Mint price in PYUSD (6 decimals)
    uint256 public mintPrice;
    
    // Mapping to store token prices
    mapping(uint256 => uint256) private _tokenPrices;
    
    // Mapping to track if token is for sale
    mapping(uint256 => bool) private _isForSale;
    
    // Mapping to store custom token URIs
    mapping(uint256 => string) private _tokenURIs;
    
    // Events
    event TokenMinted(uint256 indexed tokenId, address indexed to, string tokenURI, uint256 pyusdPaid);
    event TokenPriceSet(uint256 indexed tokenId, uint256 price);
    event TokenPurchased(uint256 indexed tokenId, address indexed buyer, uint256 price);
    event MintPriceUpdated(uint256 newPrice);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address _pyusdAddress,
        uint256 _mintPrice
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        _tokenIdCounter = 1; // Start from 1
        pyusd = IERC20(_pyusdAddress);
        mintPrice = _mintPrice; // Price in PYUSD (6 decimals)
    }
    
    // Minting function with PYUSD payment
    function mint(address to, string memory customTokenURI) public returns (uint256) {
        require(to != address(0), "MusicNFT: mint to the zero address");
        
        // Check PYUSD balance
        require(pyusd.balanceOf(msg.sender) >= mintPrice, "MusicNFT: insufficient PYUSD balance");
        
        // Transfer PYUSD from user to contract
        require(pyusd.transferFrom(msg.sender, address(this), mintPrice), "MusicNFT: PYUSD transfer failed");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, customTokenURI);
        
        emit TokenMinted(tokenId, to, customTokenURI, mintPrice);
        
        return tokenId;
    }
    
    // Set token price (only owner can set price)
    function setTokenPrice(uint256 tokenId, uint256 price) public {
        require(_ownerOf(tokenId) == msg.sender, "MusicNFT: not the owner");
        _tokenPrices[tokenId] = price;
        _isForSale[tokenId] = true;
        emit TokenPriceSet(tokenId, price);
    }
    
    // Purchase NFT with PYUSD
    function buyNFT(uint256 tokenId, uint256 pyusdAmount) public {
        require(_ownerOf(tokenId) != address(0), "MusicNFT: token does not exist");
        require(_isForSale[tokenId], "MusicNFT: token is not for sale");
        require(pyusdAmount >= _tokenPrices[tokenId], "MusicNFT: insufficient PYUSD payment");
        
        address seller = _ownerOf(tokenId);
        require(seller != msg.sender, "MusicNFT: cannot buy your own token");
        
        // Transfer PYUSD from buyer to seller
        require(pyusd.transferFrom(msg.sender, seller, pyusdAmount), "MusicNFT: PYUSD transfer failed");
        
        // Transfer token
        _transfer(seller, msg.sender, tokenId);
        
        // Remove from sale
        _isForSale[tokenId] = false;
        
        emit TokenPurchased(tokenId, msg.sender, pyusdAmount);
    }
    
    // Get token price
    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
    }
    
    // Check if token is for sale
    function isForSale(uint256 tokenId) public view returns (bool) {
        return _isForSale[tokenId];
    }
    
    // Get total supply
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    // Update mint price (only owner)
    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
        emit MintPriceUpdated(_newPrice);
    }
    
    // Withdraw PYUSD (only owner)
    function withdrawPYUSD() public onlyOwner {
        uint256 balance = pyusd.balanceOf(address(this));
        require(balance > 0, "MusicNFT: no PYUSD to withdraw");
        require(pyusd.transfer(owner(), balance), "MusicNFT: PYUSD withdrawal failed");
    }
    
    // Override tokenURI to use custom URIs
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "MusicNFT: URI query for nonexistent token");
        
        string memory customURI = _tokenURIs[tokenId];
        if (bytes(customURI).length > 0) {
            return customURI;
        }
        
        return string(abi.encodePacked(_baseTokenURI, _toString(tokenId)));
    }
    
    // Internal function to set custom token URI
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        require(_ownerOf(tokenId) != address(0), "MusicNFT: URI set of nonexistent token");
        _tokenURIs[tokenId] = uri;
    }
    
    // Convert uint256 to string
    function _toString(uint256 value) internal pure returns (string memory) {
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
