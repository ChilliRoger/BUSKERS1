# 🚰 Faucet Guide - Get TestPYUSD Tokens

## ✅ **Faucet Functionality Added!**

### **🎉 What's New:**

#### **1. Faucet Buttons Added:**
- ✅ **ArtistUpload Component** - Get tokens for minting
- ✅ **FanPurchase Component** - Get tokens for purchasing
- ✅ **One-Click Access** - No need to call contract manually
- ✅ **Real-time Updates** - Balance updates automatically

#### **2. TestPYUSD Token:**
- **Address**: `0x0aD75db1a6C8B5B6d5F0398F6bd724dd0fb920AF`
- **Symbol**: tPYUSD
- **Decimals**: 6 (like USDC)
- **Network**: Kadena EVM Testnet (Chain ID: 5920)
- **Faucet Limit**: 1,000 tPYUSD per call
- **Unlimited Calls**: Can call faucet multiple times

## 🚀 **How to Use the Faucet:**

### **Step 1: Connect Wallet**
1. **Open MetaMask**
2. **Switch to Kadena EVM Testnet** (Chain ID: 5920)
3. **Connect to the app**

### **Step 2: Get TestPYUSD Tokens**
1. **Look for the Faucet Button** - Green button with "🚰 Get 1000 tPYUSD"
2. **Click the Button** - One click to get tokens
3. **Wait for Confirmation** - Transaction will be processed
4. **Check Balance** - Balance updates automatically

### **Step 3: Use Tokens**
1. **For Minting** - Need 10 tPYUSD per NFT
2. **For Purchasing** - Need tokens to buy NFTs
3. **Get More** - Click faucet again if needed

## 🎵 **Complete User Flow:**

### **For Artists (Minting):**
1. **Connect Wallet** → See balance display
2. **Get Tokens** → Click "🚰 Get 1000 tPYUSD" button
3. **Upload Files** → MP3 + album cover
4. **Mint NFT** → Pays 10 tPYUSD, receives NFT
5. **Success** → NFT appears in wallet

### **For Fans (Purchasing):**
1. **Connect Wallet** → See balance display
2. **Get Tokens** → Click "🚰 Get 1000 tPYUSD" button
3. **Enter Token ID** → NFT to purchase
4. **Enter Price** → Amount to pay in tPYUSD
5. **Buy NFT** → Transfer ownership + payment

## 🔧 **Technical Details:**

### **Faucet Function:**
```solidity
function faucet(uint256 amount) public {
    require(amount <= 1000 * 10**_decimals, "TestPYUSD: faucet limit exceeded");
    _mint(msg.sender, amount);
}
```

### **Frontend Integration:**
```javascript
const handleFaucet = async () => {
  const result = writeContract({
    address: getPYUSDContract().address,
    abi: getPYUSDContract().abi,
    functionName: 'faucet',
    args: [ethers.parseUnits("1000", 6)], // 1000 tPYUSD
  });
};
```

### **UI Components:**
- **Balance Display** - Shows current tPYUSD balance
- **Faucet Button** - One-click token acquisition
- **Loading States** - Visual feedback during transaction
- **Error Handling** - Clear error messages

## 💰 **Token Economics:**

### **Faucet Limits:**
- **Per Call**: 1,000 tPYUSD
- **Unlimited Calls**: Can call as many times as needed
- **No Cooldown**: No waiting period between calls
- **Free Tokens**: No cost to get test tokens

### **Usage Costs:**
- **Mint Price**: 10 tPYUSD per NFT
- **Purchase Price**: Set by NFT owner
- **Gas Fees**: Paid in KDA (not tPYUSD)

## 🎯 **Key Features:**

### **User Experience:**
- ✅ **One-Click Access** - Simple button click
- ✅ **Real-time Balance** - Updates automatically
- ✅ **Loading States** - Visual feedback
- ✅ **Error Handling** - Clear error messages
- ✅ **No Manual Calls** - No need to interact with contract directly

### **Developer Experience:**
- ✅ **Easy Integration** - Simple function calls
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Error Handling** - Comprehensive error management
- ✅ **State Management** - Proper loading states

## 🚨 **Important Notes:**

### **Testing:**
- ✅ **Free Tokens** - No real value
- ✅ **Unlimited Supply** - Can get more anytime
- ✅ **Test Network** - Kadena EVM testnet only
- ✅ **No Real Money** - Safe for testing

### **Production:**
- 💰 **Real PYUSD** - Has actual USD value
- 🔒 **No Faucet** - Must buy from exchanges
- 🌉 **Bridge Required** - Must bridge from Ethereum
- 💸 **Purchase Required** - Buy from exchanges

## 📈 **Next Steps:**

### **For Testing:**
1. **✅ Faucet Ready** - Get tokens instantly
2. **✅ UI Updated** - Faucet buttons added
3. **🔄 Test Minting** - Upload files and mint NFTs
4. **🔄 Test Purchasing** - Buy/sell NFTs
5. **🔄 Test Audio** - Preview uploaded music

### **For Production:**
1. **🔄 Switch to Real PYUSD** - Update config
2. **🔄 Remove Faucet** - Hide faucet buttons
3. **🔄 Bridge Tokens** - Get real PYUSD on Kadena
4. **🔄 Deploy to Mainnet** - Production deployment

## 🎉 **Ready to Test!**

The faucet functionality is now fully integrated! Users can easily get TestPYUSD tokens with a single click and start testing the Music NFT platform immediately.

### **What You Can Do Now:**
1. **✅ Get Test Tokens** - Click faucet button
2. **✅ Upload Music** - MP3 + album cover
3. **✅ Mint NFTs** - Pay 10 tPYUSD
4. **✅ Buy/Sell NFTs** - Trade with tPYUSD
5. **✅ Preview Audio** - Listen to music

The system is now complete and ready for testing!
