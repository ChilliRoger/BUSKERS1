# Simple Wallet Connection Setup

## 🎯 Clean & Simple Approach

No automatic features, no complex switching - just a basic wallet connection that works.

## 🦊 MetaMask Setup (Manual)

### 1. Add Kadena EVM Testnet to MetaMask

1. **Open MetaMask**
2. **Click Network Dropdown** (top of extension)
3. **Click "Add network"** or "Add a network manually"
4. **Enter these details**:

```
Network Name: Kadena EVM Testnet
RPC URL: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
Chain ID: 5920
Currency Symbol: KDA
Block Explorer URL: https://explorer.chainweb.com/testnet
```

5. **Click "Save"**

### 2. Get Testnet KDA Tokens

1. **Visit**: https://faucet.testnet.chainweb.com/
2. **Enter your MetaMask address**
3. **Request testnet KDA tokens**
4. **Wait for tokens to arrive**

### 3. Switch to Kadena EVM Testnet

1. **In MetaMask**, click network dropdown
2. **Select "Kadena EVM Testnet"**
3. **Verify you see "KDA" as currency**

## 🚀 How to Use the App

### Step 1: Start the App
```bash
cd buskers
npm run dev
```

### Step 2: Open Browser
- Go to: http://localhost:3000
- **No auto-connection** - clean start

### Step 3: Connect Wallet
- Click **"Connect MetaMask"** button
- MetaMask will pop up asking for permission
- Click **"Connect"** in MetaMask
- You'll see "Connected" with your address

### Step 4: Upload Files
- Select MP3 file
- Select album cover image
- Click "Upload to Walrus"
- Wait for success message

### Step 5: Mint NFT
- Click "Mint NFT on Kadena"
- **Make sure you're on Kadena EVM Testnet** in MetaMask
- Approve transaction in MetaMask
- Wait for confirmation

## 📱 What You'll See

### Before Connecting
- **"Connect MetaMask"** button only
- Clean, simple interface

### After Connecting
- **"Connected"** status
- Your wallet address (e.g., 0x1234...5678)
- **"Disconnect"** button

### During Upload
- Two upload areas (MP3 + Album Cover)
- File validation
- Success message with upload IDs

### During Minting
- Loading spinner
- MetaMask popup for approval
- Success toast with explorer link

## ✅ Key Features

- ✅ **No Auto-Connect**: Manual connection only
- ✅ **No Auto-Switching**: Manual network switching
- ✅ **Clean Interface**: Simple, uncluttered UI
- ✅ **Manual Control**: You control everything
- ✅ **Basic Functionality**: Just connect, upload, mint

## 🔧 Troubleshooting

### "Connect MetaMask" Not Working
- Make sure MetaMask is installed and unlocked
- Refresh the page and try again

### Transaction Fails
- Make sure you're on Kadena EVM Testnet (Chain ID: 5920)
- Check you have enough KDA for gas fees
- Try again

### No KDA Tokens
- Get testnet KDA from the faucet
- Wait a few minutes for tokens to arrive

## 🎉 Success!

When everything works:
1. **Wallet connects** cleanly
2. **Files upload** successfully
3. **NFT mints** with your album cover as the image
4. **NFT appears** in your MetaMask wallet

Simple, clean, and works exactly as expected!

