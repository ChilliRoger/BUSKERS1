// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockPYUSD
 * @dev Mock ERC-20 token for testing purposes
 * @notice This is a test token that mimics PYUSD functionality
 */
contract MockPYUSD is ERC20, Ownable {
    uint8 private constant DECIMALS = 6; // Same as PYUSD
    uint256 private constant INITIAL_SUPPLY = 1000000 * 10**DECIMALS; // 1M tokens

    /**
     * @dev Constructor that initializes the token
     * @param initialOwner The address that will own the contract
     */
    constructor(address initialOwner) 
        ERC20("MockPYUSD", "MPYUSD") 
        Ownable(initialOwner) 
    {
        // Mint initial supply to the owner
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @dev Returns the number of decimals used by the token
     * @return The number of decimals
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @dev Mints tokens to the caller (for testing purposes)
     * @param amount The amount of tokens to mint
     * @notice This function allows anyone to mint tokens for testing
     */
    function mint(uint256 amount) external {
        require(amount > 0, "MockPYUSD: Amount must be greater than 0");
        require(amount <= 1000000 * 10**DECIMALS, "MockPYUSD: Cannot mint more than 1M tokens at once");
        
        _mint(msg.sender, amount);
    }

    /**
     * @dev Mints tokens to a specific address (owner only)
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mintTo(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "MockPYUSD: Cannot mint to zero address");
        require(amount > 0, "MockPYUSD: Amount must be greater than 0");
        
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from the caller
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) external {
        require(amount > 0, "MockPYUSD: Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "MockPYUSD: Insufficient balance to burn");
        
        _burn(msg.sender, amount);
    }

    /**
     * @dev Returns the total supply cap (for reference)
     * @return The maximum supply that can be minted
     */
    function getMaxSupply() external pure returns (uint256) {
        return 10000000 * 10**DECIMALS; // 10M tokens max supply
    }
}
