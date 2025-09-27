# Kadena EVM Testnet Deployment Guide

This guide outlines the steps to deploy the `MusicNFT` contract to the Kadena EVM testnet using Hardhat.

## 1. Environment Configuration

Create a `.env` file in the `hardhat-project` directory with the following variables:

```env
# Kadena EVM Testnet Configuration
KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
KADENA_CHAIN_ID=5920
PRIVATE_KEY=your_private_key_here

# NFT Contract Configuration (Optional - will use defaults if not set)
NFT_TOKEN_NAME=Buskers Music NFT
NFT_TOKEN_SYMBOL=BMNFT
NFT_BASE_URI=https://api.buskers.com/metadata/
```

**Important:** 
- Replace `your_private_key_here` with the actual private key of your Kadena testnet account
- Ensure this account has sufficient testnet KDA for gas fees
- You can get testnet KDA from the Kadena faucet

## 2. Install Dependencies

Navigate to the `hardhat-project` directory and install the dependencies:

```bash
cd hardhat-project
npm install
```

## 3. Compile Contracts

Compile the Solidity contracts:

```bash
npx hardhat compile
```

## 4. Deploy MusicNFT Contract

Run the deployment script to deploy the `MusicNFT` contract to the Kadena testnet:

```bash
npx hardhat run scripts/deploy-nft.ts --network kadenaTestnet
```

The script will:
- Validate environment variables
- Deploy the contract with your configuration
- Test the contract functionality
- Display the contract address and transaction details
- Generate environment variables for your frontend

## 5. Contract Features

The `MusicNFT` contract includes:

- **ERC-721 Standard**: Full NFT functionality
- **Walrus/Tusky Integration**: Validates tokenURIs must start with `tusky-walrus://`
- **Dynamic Configuration**: Uses environment variables for all settings
- **Owner Controls**: Only contract owner can mint NFTs
- **Event Logging**: Emits events for all mints
- **Validation**: Ensures tokenURIs follow the expected format

## 6. Frontend Integration

After deployment, copy the generated environment variables to your Next.js `.env.local`:

```env
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=deployed_contract_address_here
NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL=https://explorer.chainweb.com/testnet/tx
```

## 7. Testing the Contract

The deployment script automatically tests:
- Contract deployment
- Initial state (total supply = 0)
- Minting functionality with realistic Tusky URI
- Token URI retrieval
- Token existence checks

## 8. Verification (Optional)

After deployment, you can verify the contract on Kadena EVM Explorer:

```bash
npx hardhat verify --network kadenaTestnet CONTRACT_ADDRESS "Token Name" "Token Symbol" "Base URI"
```

## 9. Contract Address

The deployed contract address will be displayed in the console output and saved to `deployment-info.json` for reference.

## 10. Troubleshooting

If deployment fails, check:
- Sufficient KDA balance for gas fees
- Correct RPC endpoint in `.env`
- Valid private key format
- Network connectivity to Kadena testnet
- All required environment variables are set

## 11. Token URI Format

The contract expects tokenURIs in the format:
```
tusky-walrus://upload-id-here
```

This format is validated by the contract to ensure compatibility with Walrus/Tusky storage.
