# MusicNFT Deployment Guide

## Overview
This guide explains how to deploy the MusicNFT contract to Kadena EVM Testnet.

## Prerequisites
1. Node.js and npm installed
2. Hardhat project dependencies installed
3. KDA tokens for gas fees on Kadena testnet
4. Private key for deployment

## Environment Setup

Create a `.env` file in the `hardhat-project` directory with the following variables:

```env
# Kadena EVM Testnet Configuration
KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
KADENA_CHAIN_ID=5920

# Private Key for Deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Gas Configuration (optional)
GAS_LIMIT=8000000
GAS_PRICE=1000000000

# Contract Configuration
CONTRACT_NAME=MusicNFT
TOKEN_NAME=Buskers Music NFT
TOKEN_SYMBOL=BMNFT
BASE_TOKEN_URI=https://api.buskers.com/metadata/
```

## Contract Features

### MusicNFT Contract
- **ERC-721 Standard**: Full OpenZeppelin ERC-721 implementation
- **Mint Function**: `mint(address to, string memory tokenURI)`
- **Dynamic TokenURI**: Accepts pre-formatted URIs from frontend
- **Walrus Integration**: Designed for `tusky-walrus://` URI format
- **Owner Controls**: Only owner can mint and set base URI
- **Event Logging**: Emits `MusicMinted` events for tracking

### Key Functions
```solidity
function mint(address to, string memory tokenURI) public onlyOwner returns (uint256)
function setBaseURI(string memory baseURI) public onlyOwner
function totalSupply() public view returns (uint256)
function nextTokenId() public view returns (uint256)
function exists(uint256 tokenId) public view returns (bool)
```

## Deployment Commands

### 1. Install Dependencies
```bash
cd hardhat-project
npm install
```

### 2. Compile Contracts
```bash
npx hardhat compile
```

### 3. Run Tests
```bash
npx hardhat test
```

### 4. Deploy to Kadena Testnet
```bash
npx hardhat run scripts/deploy-nft.ts --network kadenaTestnet
```

### 5. Verify Contract (Optional)
```bash
npx hardhat verify --network kadenaTestnet <CONTRACT_ADDRESS> "Buskers Music NFT" "BMNFT" "https://api.buskers.com/metadata/"
```

## Frontend Integration

After deployment, update your frontend environment variables:

```env
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=<DEPLOYED_CONTRACT_ADDRESS>
NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL=https://explorer.chainweb.com/testnet/tx
```

## Token URI Format

The contract expects pre-formatted token URIs from the frontend:

```javascript
// Frontend generates the URI
const uploadId = "abc123def456";
const tokenURI = `tusky-walrus://${uploadId}`;

// Contract receives the complete URI
await musicNFT.mint(userAddress, tokenURI);
```

## Kadena Qualifications

✅ **Deployed on Testnet**: Uses Kadena EVM testnet
✅ **Dynamic Configuration**: No hardcoded values in contract
✅ **Walrus Integration**: TokenURIs reference Walrus storage
✅ **TypeScript**: Full TypeScript support with type generation
✅ **OpenZeppelin**: Uses industry-standard ERC-721 implementation

## Troubleshooting

### Common Issues
1. **Insufficient Gas**: Ensure you have enough KDA for gas fees
2. **Network Issues**: Check RPC endpoint connectivity
3. **Private Key**: Verify private key format (no 0x prefix)
4. **Chain ID**: Confirm correct Kadena testnet chain ID (5920)

### Debug Commands
```bash
# Check network connection
npx hardhat console --network kadenaTestnet

# Get account balance
npx hardhat run scripts/get-balance.ts --network kadenaTestnet

# Test contract interaction
npx hardhat run scripts/test-contract.ts --network kadenaTestnet
```

## Deployment Output

The deployment script will output:
- Contract address
- Transaction hash
- Gas used
- Environment variables for frontend
- Verification command

Example output:
```
✅ MusicNFT deployed successfully!
Contract Address: 0x1234567890123456789012345678901234567890
Token Name: Buskers Music NFT
Token Symbol: BMNFT
Base URI: https://api.buskers.com/metadata/
```

## Next Steps

1. Update frontend with new contract address
2. Test minting functionality
3. Verify contract on Kadena explorer
4. Integrate with Walrus/Tusky upload flow
5. Deploy to mainnet when ready

