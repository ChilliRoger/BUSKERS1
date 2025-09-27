# Album Cover + MetaMask Setup Guide

## 🎵 New Features Added

### 1. **Album Cover Upload**
- Upload both MP3 file and album cover image
- Supports JPG, PNG, GIF formats (max 10MB)
- Both files are uploaded to Tusky/Walrus storage
- Creates separate upload IDs for each file

### 2. **MetaMask Only Integration**
- Removed all other wallet options
- Only supports MetaMask wallet
- Configured specifically for Kadena EVM testnet

## 🔧 Environment Variables

Update your `.env.local` file with these variables:

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

## 🦊 MetaMask Setup

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

## 🎨 How to Use the New Features

### 1. **Upload Process**
1. **Select MP3 File**: Click the first upload area to select your music file
2. **Select Album Cover**: Click the second upload area to select your album cover image
3. **Upload Both Files**: Click "Upload to Walrus" (button only enables when both files are selected)
4. **Wait for Success**: Both files will be uploaded to Tusky/Walrus storage

### 2. **Mint NFT**
1. **Connect MetaMask**: Click "Connect Wallet" and select MetaMask
2. **Switch to Kadena**: Make sure you're on Kadena EVM Testnet in MetaMask
3. **Mint NFT**: Click "Mint NFT on Kadena" after successful upload
4. **Confirm Transaction**: Approve the transaction in MetaMask
5. **View NFT**: Check your MetaMask wallet for the new NFT

### 3. **Verify on Explorer**
- Click "View on Kadena Explorer" link after minting
- Verify the NFT was created with the correct tokenURI
- The NFT will contain references to both the MP3 and album cover

## 📱 What You'll See

### Upload Interface
- **MP3 Upload Area**: Purple-themed drag & drop for music files
- **Album Cover Upload Area**: Blue-themed drag & drop for images
- **File Validation**: Real-time validation for file types and sizes
- **Progress Indicators**: Loading states during upload

### Success Display
- **Both Files Listed**: Shows MP3 and album cover details
- **Upload IDs**: Displays Tusky upload IDs for both files
- **File Sizes**: Shows file sizes for both uploads
- **Mint Button**: Enabled after successful upload

### NFT in MetaMask
- **Token Name**: "Buskers Music NFT"
- **Token Symbol**: "BMNFT"
- **Token URI**: `tusky-walrus://{uploadId}` (references the MP3 file)
- **Metadata**: Contains references to both MP3 and album cover

## 🔍 Technical Details

### File Upload Process
1. **Validation**: Both files are validated for type and size
2. **Tusky Upload**: Files are uploaded to separate paths in Tusky vault
3. **Response**: API returns upload IDs for both files
4. **State Management**: Frontend stores both upload IDs for minting

### NFT Minting Process
1. **Wallet Check**: Ensures MetaMask is connected to Kadena
2. **Contract Call**: Calls `MusicNFT.mint()` with wallet address and tokenURI
3. **Transaction**: MetaMask prompts for transaction confirmation
4. **Confirmation**: Waits for transaction confirmation on Kadena
5. **Success**: NFT appears in MetaMask wallet

### Error Handling
- **File Validation**: Clear error messages for invalid files
- **Upload Errors**: Fallback to mock upload if Tusky fails
- **Wallet Errors**: Helpful messages for wallet connection issues
- **Transaction Errors**: Detailed error messages for failed transactions

## 🚀 Testing the Complete Flow

1. **Prepare Files**:
   - Get an MP3 file (max 50MB)
   - Get an album cover image (max 10MB)

2. **Upload Files**:
   - Select both files in the interface
   - Click "Upload to Walrus"
   - Wait for success message

3. **Connect Wallet**:
   - Click "Connect Wallet"
   - Select MetaMask
   - Switch to Kadena EVM Testnet

4. **Mint NFT**:
   - Click "Mint NFT on Kadena"
   - Approve transaction in MetaMask
   - Wait for confirmation

5. **Verify Results**:
   - Check MetaMask for the new NFT
   - Click "View on Kadena Explorer"
   - Verify the transaction details

## 🎉 Success!

Your NFT will now contain:
- **Music File**: Stored on Tusky/Walrus with unique ID
- **Album Cover**: Stored on Tusky/Walrus with unique ID
- **Metadata**: References to both files in the tokenURI
- **Ownership**: NFT owned by your MetaMask wallet address

The NFT will be visible in your MetaMask wallet under the "Collectibles" or "NFTs" tab!
