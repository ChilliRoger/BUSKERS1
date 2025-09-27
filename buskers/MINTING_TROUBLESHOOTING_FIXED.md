# Minting Troubleshooting Guide - Fixed Version

## 🎯 Dynamic Configuration System

The app now uses a completely dynamic configuration system with no hardcoding:

### Configuration Sources (in order of priority):
1. **Environment Variables** (`.env.local` or system env)
2. **Config File** (`config.json` fallback)
3. **Default Values** (hardcoded fallbacks)

## 🔧 Key Fixes Applied

### 1. **Dynamic Contract Address**
```javascript
// Before: Hardcoded
const contractAddress = '0xCF9C0C4c9E7C0b2BEAFc0Be2182115F2d386B313';

// After: Dynamic
const contractAddress = process.env.NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS || config.kadena.contractAddress;
```

### 2. **Dynamic Chain ID**
```javascript
// Before: Hardcoded
if (chainId !== 5920) { ... }

// After: Dynamic
const expectedChainId = Number(process.env.NEXT_PUBLIC_KADENA_CHAIN_ID) || 5920;
if (chainId !== expectedChainId) { ... }
```

### 3. **Dynamic Metadata URI**
```javascript
// Before: Hardcoded simple URI
const simpleMetadataURI = "data:application/json;base64,...";

// After: Dynamic metadata using uploaded files
const metadata = {
  name: `${uploadState.fileName?.replace('.mp3', '') || 'Music'} NFT`,
  description: `Music NFT: ${uploadState.fileName || 'Unknown file'}`,
  image: `${appUrl}/api/image/${uploadState.albumCoverBlobId}`,
  attributes: [...]
};
```

### 4. **Enhanced Error Handling**
- Better error messages with specific details
- Console logging for debugging
- Toast notifications with clear feedback

## 🚀 How to Test the Fixed System

### Step 1: Start the App
```bash
cd buskers
npm run dev
```

### Step 2: Check Configuration
The app will automatically load configuration from:
- Environment variables (if set)
- `config.json` file
- Default values

### Step 3: Test Upload Flow
1. **Connect MetaMask** to Kadena EVM Testnet
2. **Upload MP3 file** and **album cover image**
3. **Click "Mint NFT on Kadena"**
4. **Approve transaction** in MetaMask

### Step 4: Verify Success
- Check MetaMask activity for "Confirmed" status
- Click the explorer link to verify on Kadena Explorer
- NFT should appear in your MetaMask wallet

## 🔍 Debugging Steps

### If Minting Still Fails:

1. **Check Console Logs**
   ```javascript
   // Look for these debug messages:
   console.log('=== DYNAMIC MINTING DEBUG ===');
   console.log('Contract address:', contractAddress);
   console.log('Minting to address:', address);
   console.log('Metadata URI length:', metadataURI.length);
   ```

2. **Verify Network Connection**
   - Ensure you're on Kadena EVM Testnet (Chain ID: 5920)
   - Check MetaMask network dropdown

3. **Check Contract Address**
   - Verify contract is deployed and accessible
   - Test with: `node test-dynamic-config.js`

4. **Verify Gas Fees**
   - Ensure you have enough KDA for gas
   - Get testnet KDA from faucet if needed

5. **Check Metadata URI**
   - Ensure metadata URI is not too long
   - Verify base64 encoding is correct

## 🛠️ Configuration Files

### `config.json` (Fallback Configuration)
```json
{
  "kadena": {
    "testnetRpc": "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc",
    "chainId": 5920,
    "explorerBaseUrl": "https://explorer.chainweb.com/testnet/tx",
    "contractAddress": "0xCF9C0C4c9E7C0b2BEAFc0Be2182115F2d386B313"
  },
  "app": {
    "name": "Buskers",
    "description": "Decentralized Music Platform",
    "url": "http://localhost:3000"
  },
  "wallet": {
    "projectId": "af795a67e519c60d96a18987b1b081fd"
  },
  "tusky": {
    "apiKey": "your_tusky_api_key_here",
    "network": "testnet"
  }
}
```

### Environment Variables (Optional)
Create `.env.local` file:
```bash
NEXT_PUBLIC_KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
NEXT_PUBLIC_KADENA_CHAIN_ID=5920
NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL=https://explorer.chainweb.com/testnet/tx
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0xCF9C0C4c9E7C0b2BEAFc0Be2182115F2d386B313
NEXT_PUBLIC_APP_NAME=Buskers
NEXT_PUBLIC_APP_DESCRIPTION=Decentralized Music Platform
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=af795a67e519c60d96a18987b1b081fd
TUSKY_API_KEY=your_tusky_api_key_here
TUSKY_NETWORK=testnet
```

## ✅ Expected Behavior

### Successful Minting Flow:
1. **Upload Files** → Success toast appears
2. **Click Mint** → MetaMask popup appears
3. **Approve Transaction** → Transaction shows "Pending"
4. **Confirmation** → Transaction shows "Confirmed"
5. **Success Toast** → Shows explorer link
6. **NFT in Wallet** → Appears in MetaMask NFTs tab

### Error Handling:
- **Network Error**: Clear message to switch networks
- **Contract Error**: Specific error message with details
- **Transaction Drop**: Enhanced debugging information
- **Gas Error**: Clear instructions to get more KDA

## 🎉 Success Indicators

- ✅ Transaction shows "Confirmed" in MetaMask
- ✅ Success toast with explorer link appears
- ✅ NFT appears in MetaMask wallet
- ✅ Explorer link shows transaction details
- ✅ NFT metadata displays correctly

The system is now completely dynamic and should handle minting without the previous drop issues!

