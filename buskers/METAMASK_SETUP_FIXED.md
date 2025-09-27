# MetaMask Wallet Connection Fix

## 🔧 Issues Fixed

1. **Auto-Connect Disabled**: Wallet will no longer auto-connect when you visit localhost
2. **MetaMask Only**: Removed all other wallet options, only MetaMask is supported
3. **Manual Connection**: You must manually click "Connect MetaMask" to connect
4. **Better Error Handling**: Improved error messages and connection flow

## 🦊 MetaMask Setup Steps

### 1. Install MetaMask (if not already installed)
- Visit: https://metamask.io/
- Install the browser extension
- Create a new wallet or import existing one

### 2. Add Kadena EVM Testnet to MetaMask

1. **Open MetaMask Extension**
2. **Click Network Dropdown** (top of the extension)
3. **Click "Add network"** or "Add a network manually"
4. **Enter these exact details**:

```
Network Name: Kadena EVM Testnet
RPC URL: https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
Chain ID: 5920
Currency Symbol: KDA
Block Explorer URL: https://explorer.chainweb.com/testnet
```

5. **Click "Save"**

### 3. Get Testnet KDA Tokens

1. **Visit Kadena Faucet**: https://faucet.testnet.chainweb.com/
2. **Enter your MetaMask wallet address**
3. **Request testnet KDA tokens** (you need these for gas fees)
4. **Wait for tokens to arrive** (usually within a few minutes)

### 4. Switch to Kadena EVM Testnet

1. **In MetaMask**, click the network dropdown
2. **Select "Kadena EVM Testnet"**
3. **Verify you see "KDA" as the currency symbol**

## 🚀 How to Use the App

### 1. **Start the App**
```bash
cd buskers
npm run dev
```

### 2. **Open in Browser**
- Go to: http://localhost:3000
- **Wallet will NOT auto-connect** (this is fixed!)

### 3. **Connect Wallet Manually**
- Click the **"Connect MetaMask"** button in the top right
- MetaMask will pop up asking for permission
- Click **"Connect"** in MetaMask
- You should see your wallet address in the top right

### 4. **Upload Files**
- Select an MP3 file
- Select an album cover image
- Click "Upload to Walrus"
- Wait for success message

### 5. **Mint NFT**
- After successful upload, click "Mint NFT on Kadena"
- MetaMask will pop up for transaction confirmation
- Click "Confirm" in MetaMask
- Wait for transaction confirmation

### 6. **Verify NFT**
- Check your MetaMask wallet
- Go to "Collectibles" or "NFTs" tab
- You should see your new music NFT!

## 🔍 Troubleshooting

### "Connect MetaMask" Button Not Working
- **Check MetaMask is installed** and unlocked
- **Refresh the page** and try again
- **Make sure you're on Kadena EVM Testnet** in MetaMask

### "Unsupported Chain" Error
- **Switch to Kadena EVM Testnet** in MetaMask
- **Make sure Chain ID is 5920**
- **Refresh the page** after switching

### "Insufficient Funds" Error
- **Get testnet KDA** from the faucet
- **Wait a few minutes** for tokens to arrive
- **Check your balance** in MetaMask

### "Transaction Failed" Error
- **Check you have enough KDA** for gas fees
- **Make sure you're on Kadena EVM Testnet**
- **Try increasing gas limit** in MetaMask

### Wallet Not Connecting
- **Close and reopen MetaMask**
- **Refresh the browser page**
- **Check browser console** for error messages
- **Make sure MetaMask is unlocked**

## ✅ What You Should See

### Before Connecting
- **"Connect MetaMask"** button in top right
- **No wallet address** displayed
- **Upload areas** for MP3 and album cover

### After Connecting
- **Your wallet address** in top right (e.g., 0x1234...5678)
- **"Disconnect"** button next to address
- **"Mint NFT on Kadena"** button enabled after upload

### After Minting
- **Success toast** notification
- **"View on Kadena Explorer"** link
- **NFT appears** in MetaMask wallet

## 🎯 Key Features

- ✅ **No Auto-Connect**: Wallet only connects when you click the button
- ✅ **MetaMask Only**: No other wallet options cluttering the interface
- ✅ **Manual Control**: You decide when to connect/disconnect
- ✅ **Clear Status**: Always shows connection status clearly
- ✅ **Error Handling**: Helpful error messages for common issues

The wallet connection is now completely manual and under your control!
