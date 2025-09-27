# Fan Purchase System Documentation

## 🛒 **Complete NFT Purchase System with MockPYUSD**

This system allows fans to purchase Music NFTs using MockPYUSD tokens, with audio preview functionality.

### **System Overview:**

#### **1. Purchase Flow:**
```
Fan enters Token ID + Price → Approve MockPYUSD → Buy NFT → View Transaction
```

#### **2. Preview Flow:**
```
Fan enters Token ID → Preview File → Fetch Audio from Tusky → Play in Browser
```

### **Key Features:**

✅ **MockPYUSD Integration**: Buy NFTs with MockPYUSD tokens  
✅ **Two-Step Transaction**: Approve → Buy (standard ERC-20 pattern)  
✅ **Audio Preview**: Preview audio files before purchasing  
✅ **Real-time Balance**: Shows current MockPYUSD balance  
✅ **Token Information**: Displays token price and availability  
✅ **Transaction Tracking**: Links to Kadena explorer  
✅ **Error Handling**: Comprehensive error messages  
✅ **Loading States**: Visual feedback during transactions  

### **Components Created:**

#### **1. FanPurchase.tsx**
- **Form**: Token ID input, price input
- **Balance Display**: Shows MockPYUSD balance
- **Token Info**: Displays current token price and availability
- **Purchase Button**: Handles approval + purchase flow
- **Preview Button**: Fetches and plays audio preview
- **Status Messages**: Success/error feedback

#### **2. /api/preview**
- **Input**: `{ uploadId: string }`
- **Process**: Fetches audio from Tusky, converts to base64
- **Output**: `{ success: true, audioData: base64, uploadId: string }`
- **Fallback**: Mock preview for development

### **Contract Integration:**

#### **MusicNFT Contract Functions:**
```solidity
function buyNFT(uint256 tokenId, address buyer, uint256 amount) public
function getTokenPrice(uint256 tokenId) public view returns (uint256)
function isForSale(uint256 tokenId) public view returns (bool)
```

#### **MockPYUSD Contract Functions:**
```solidity
function approve(address spender, uint256 amount) public returns (bool)
function balanceOf(address account) public view returns (uint256)
function allowance(address owner, address spender) public view returns (uint256)
```

### **API Endpoints:**

#### **POST /api/preview**
```json
// Request
{
  "uploadId": "tusky-1234567890-abc123"
}

// Response
{
  "success": true,
  "audioData": "base64-encoded-audio-data",
  "uploadId": "tusky-1234567890-abc123",
  "message": "Audio file preview loaded successfully"
}
```

### **Configuration:**

#### **Environment Variables:**
```bash
NEXT_PUBLIC_MOCK_PYUSD_CONTRACT_ADDRESS=0x45fD5d31E2D015d5E97CD1D9cd94B0bcE354A867
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0xCF9C0C4c9E7C0b2BEAFc0Be2182115F2d386B313
TUSKY_API_KEY=your_tusky_api_key
```

#### **Config.json Fallback:**
```json
{
  "kadena": {
    "mockPYUSDAddress": "0x45fD5d31E2D015d5E97CD1D9cd94B0bcE354A867",
    "contractAddress": "0xCF9C0C4c9E7C0b2BEAFc0Be2182115F2d386B313"
  }
}
```

### **User Experience:**

#### **1. Purchase Process:**
1. **Connect Wallet**: MetaMask connection required
2. **Enter Token ID**: Input the NFT token ID to purchase
3. **Enter Price**: Input the price in MockPYUSD
4. **View Token Info**: See current price and availability
5. **Approve**: Approve MockPYUSD spending (first transaction)
6. **Buy**: Purchase the NFT (second transaction)
7. **Success**: View transaction hash and explorer link

#### **2. Preview Process:**
1. **Enter Token ID**: Input the NFT token ID to preview
2. **Click Preview**: Fetches audio file from Tusky
3. **Play Audio**: HTML5 audio player with the preview
4. **Error Handling**: Clear error messages if preview fails

### **Error Handling:**

#### **Purchase Errors:**
- ❌ Wallet not connected
- ❌ Insufficient MockPYUSD balance
- ❌ Token not for sale
- ❌ Invalid token ID
- ❌ Transaction failed

#### **Preview Errors:**
- ❌ Token ID required
- ❌ No audio file in metadata
- ❌ Tusky API failure
- ❌ Invalid upload ID

### **Loading States:**

#### **Purchase States:**
- 🔄 **Approving**: MockPYUSD approval in progress
- 🔄 **Purchasing**: NFT purchase in progress
- 🔄 **Confirming**: Transaction confirmation pending

#### **Preview States:**
- 🔄 **Loading**: Fetching audio from Tusky
- ✅ **Success**: Audio loaded and ready to play
- ❌ **Error**: Preview failed with error message

### **Transaction Flow:**

#### **Step 1: Approve MockPYUSD**
```javascript
writeContract({
  address: mockPYUSDContract.address,
  abi: mockPYUSDContract.abi,
  functionName: 'approve',
  args: [musicNFTContract.address, BigInt(priceInWei)],
});
```

#### **Step 2: Buy NFT**
```javascript
writeContract({
  address: musicNFTContract.address,
  abi: musicNFTContract.abi,
  functionName: 'buyNFT',
  args: [BigInt(tokenId), buyerAddress, BigInt(priceInWei)],
});
```

### **Testing Flow:**

#### **Complete Test Scenario:**
1. **Mint NFT**: Use ArtistUpload to create a new Music NFT
2. **Set Price**: Owner sets price for the NFT (via contract)
3. **Buy NFT**: Use FanPurchase to purchase with MockPYUSD
4. **Preview Audio**: Use preview functionality to play audio
5. **Verify**: Check transaction on Kadena explorer

### **Security Features:**

✅ **Balance Validation**: Checks sufficient MockPYUSD before purchase  
✅ **Price Validation**: Ensures payment meets token price  
✅ **Owner Validation**: Prevents buying own tokens  
✅ **Token Existence**: Validates token exists before purchase  
✅ **Sale Status**: Checks if token is actually for sale  

### **Dynamic Configuration:**

- **No Hardcoding**: All addresses loaded from environment/config
- **Fallback System**: Environment variables → config.json → defaults
- **Error Messages**: Clear configuration error messages
- **Diagnostics**: Console logging for debugging

This system provides a complete, production-ready NFT marketplace experience for music NFTs with MockPYUSD integration!
