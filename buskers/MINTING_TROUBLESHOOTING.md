# Minting Troubleshooting Guide

## 🔧 Fixed Issues

### 1. **Wallet Connection Problems**
- ✅ **Auto-connect disabled**: Wallet only connects when you click the button
- ✅ **Network switching**: Automatic detection and switching to Kadena EVM Testnet
- ✅ **Error handling**: Clear error messages for connection issues
- ✅ **Chain validation**: Prevents minting on wrong network

### 2. **Minting Transaction Issues**
- ✅ **Gas parameters**: Added proper gas limit and gas price
- ✅ **Chain validation**: Ensures you're on Kadena EVM Testnet before minting
- ✅ **Better error handling**: Clear error messages for failed transactions
- ✅ **Transaction validation**: Checks all required parameters before minting

## 🚀 How to Test the Fixed System

### Step 1: Connect Wallet Properly
1. **Click "Connect MetaMask"**
2. **If on wrong network**: Click "Switch Network" button
3. **Verify connection**: Should show "Connected to Kadena EVM Testnet"
4. **Check address**: Your wallet address should be displayed

### Step 2: Upload Files
1. **Select MP3 file** (your music)
2. **Select album cover image** (JPG, PNG, GIF)
3. **Click "Upload to Walrus"**
4. **Wait for success**: Both upload IDs should be displayed

### Step 3: Mint NFT
1. **Verify network**: Must be on Kadena EVM Testnet (Chain ID: 5920)
2. **Click "Mint NFT on Kadena"**
3. **Approve transaction** in MetaMask
4. **Wait for confirmation**: Transaction should succeed

## 🔍 Common Issues and Solutions

### Issue: "Transaction Dropped"
**Cause**: Wrong network or insufficient gas
**Solution**:
1. Switch to Kadena EVM Testnet (Chain ID: 5920)
2. Get testnet KDA from faucet
3. Try minting again

### Issue: "Failed to connect wallet"
**Cause**: MetaMask not installed or locked
**Solution**:
1. Install MetaMask extension
2. Unlock your wallet
3. Refresh the page and try again

### Issue: "Wrong Network"
**Cause**: Connected to wrong blockchain
**Solution**:
1. Click "Switch Network" button
2. Or manually switch to Kadena EVM Testnet in MetaMask

### Issue: "Insufficient funds"
**Cause**: Not enough KDA for gas fees
**Solution**:
1. Get testnet KDA from https://faucet.testnet.chainweb.com/
2. Wait for tokens to arrive
3. Try minting again

### Issue: "Contract not found"
**Cause**: Wrong contract address or network
**Solution**:
1. Verify you're on Kadena EVM Testnet
2. Check contract address in environment variables
3. Redeploy contract if needed

## 🎯 What You Should See

### Before Connecting
- **"Connect MetaMask"** button
- **No wallet address** displayed
- **Upload areas** for MP3 and album cover

### After Connecting (Wrong Network)
- **"Switch Network"** button
- **"Wrong Network"** status in yellow
- **Wallet address** displayed

### After Connecting (Correct Network)
- **"Connected to Kadena EVM Testnet"** status in green
- **Wallet address** displayed
- **"Disconnect"** button

### After Upload
- **Both upload IDs** displayed
- **"Mint NFT on Kadena"** button enabled
- **Success message** with file details

### During Minting
- **Loading spinner** on mint button
- **"Minting NFT on Kadena..."** toast
- **MetaMask popup** for transaction approval

### After Successful Mint
- **Success toast** with explorer link
- **NFT appears** in MetaMask wallet
- **Album cover** as NFT image

## 🔧 Technical Details

### Gas Parameters
- **Gas Limit**: 500,000
- **Gas Price**: 1 gwei
- **Network**: Kadena EVM Testnet (Chain ID: 5920)

### Contract Requirements
- **Contract Address**: Must be deployed on Kadena EVM Testnet
- **ABI**: Complete ABI with mint, totalSupply, and tokenURI functions
- **Owner**: Must be the connected wallet address

### Environment Variables
```env
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0xCF9C0C4c9E7C0b2BEAFc0Be2182115F2d386B313
NEXT_PUBLIC_KADENA_CHAIN_ID=5920
NEXT_PUBLIC_KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
```

## 🎉 Success Indicators

### Wallet Connection
- ✅ Green "Connected to Kadena EVM Testnet" status
- ✅ Wallet address displayed
- ✅ No error messages

### File Upload
- ✅ Both MP3 and album cover upload IDs
- ✅ Success toast notification
- ✅ File details displayed

### NFT Minting
- ✅ Transaction confirmed on blockchain
- ✅ Success toast with explorer link
- ✅ NFT appears in MetaMask wallet
- ✅ Album cover shows as NFT image

## 🚨 If Still Having Issues

1. **Check browser console** for error messages
2. **Verify MetaMask** is unlocked and on correct network
3. **Check contract address** is correct
4. **Ensure sufficient KDA** for gas fees
5. **Try refreshing** the page and reconnecting

The system should now work reliably with proper error handling and network validation!

