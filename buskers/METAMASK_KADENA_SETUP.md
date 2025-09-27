# MetaMask + Kadena Testnet Setup Guide

## Environment Variables Update

Update your `.env.local` file with these additional variables:

```env
TUSKY_API_KEY=3311a6a5-f561-4868-9819-edd3bd93c57b
TUSKY_NETWORK=testnet
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0xCF9C0C4c9E7C0b2BEAFc0Be2182115F2d386B313
NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL=https://explorer.chainweb.com/testnet/tx
NEXT_PUBLIC_KADENA_CHAIN_ID=5920
NEXT_PUBLIC_KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=af795a67e519c60d96a18987b1b081fd
NEXT_PUBLIC_APP_NAME=Buskers
NEXT_PUBLIC_APP_DESCRIPTION=Decentralized Music Platform
```

## MetaMask Configuration

### 1. Add Kadena EVM Testnet to MetaMask

1. Open MetaMask
2. Click on the network dropdown (top of the extension)
3. Click "Add network" or "Add a network manually"
4. Enter these details:

**Network Name:** Kadena EVM Testnet
**RPC URL:** https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
**Chain ID:** 5920
**Currency Symbol:** KDA
**Block Explorer URL:** https://explorer.chainweb.com/testnet

### 2. Get Testnet KDA Tokens

1. Visit the Kadena testnet faucet: https://faucet.testnet.chainweb.com/
2. Enter your MetaMask wallet address
3. Request testnet KDA tokens (you'll need these for gas fees)

### 3. Connect Wallet

1. Open your Buskers app at http://localhost:3000
2. Click "Connect Wallet" in the top right
3. Select MetaMask from the wallet options
4. Approve the connection in MetaMask

## Testing the Complete Flow

1. **Upload File:**
   - Select an MP3 file
   - Click "Upload to Walrus"
   - Wait for success message

2. **Mint NFT:**
   - After successful upload, click "Mint NFT on Kadena"
   - MetaMask will pop up asking to confirm the transaction
   - Approve the transaction (requires KDA for gas)
   - Wait for confirmation

3. **Verify on Explorer:**
   - Click the "View on Kadena Explorer" link
   - Verify the NFT was minted with the correct tokenURI

## Troubleshooting

- **"Unsupported chain" error:** Make sure you've added Kadena EVM Testnet to MetaMask
- **"Insufficient funds" error:** Get testnet KDA from the faucet
- **"Contract not found" error:** Check that the contract address is correct in .env.local
- **Upload fails:** The system will fallback to mock upload if Tusky API is unavailable

## Dynamic Features

✅ **Real Tusky Integration:** Tries real Tusky SDK first, falls back to mock if needed
✅ **MetaMask Wallet:** Full MetaMask integration for Kadena EVM testnet
✅ **Dynamic Configuration:** All settings from environment variables
✅ **Error Handling:** Comprehensive error handling and user feedback
✅ **Toast Notifications:** Real-time feedback for all operations
