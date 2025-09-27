# PYUSDC Integration & Deployment Guide

## 🚀 **Complete PYUSDC Integration for Music NFTs**

This guide covers the complete integration of PayPal's PYUSDC token for minting and purchasing Music NFTs on Kadena EVM testnet.

### **🔧 What Was Fixed & Updated:**

#### **1. Fixed NFT Minting Issues:**
- ✅ **Removed `onlyOwner` restriction** - Now anyone can mint NFTs
- ✅ **Added PYUSDC payment requirement** - Must pay 10 PYUSDC to mint
- ✅ **Public minting function** - No longer requires contract owner
- ✅ **Balance validation** - Checks sufficient PYUSDC before minting

#### **2. Created New Contracts:**
- ✅ **MusicNFTV2.sol** - Updated contract with PYUSDC payment
- ✅ **PYUSDC.sol** - PayPal USD Coin ERC-20 token
- ✅ **Deployment script** - Automated deployment with airdrop

#### **3. Updated Frontend:**
- ✅ **ArtistUpload.tsx** - Shows PYUSDC balance, validates payment
- ✅ **FanPurchase.tsx** - Uses PYUSDC for purchasing NFTs
- ✅ **Balance displays** - Real-time PYUSDC balance
- ✅ **Payment validation** - Checks sufficient funds

### **📋 Contract Details:**

#### **MusicNFTV2 Features:**
```solidity
// Public minting with PYUSDC payment
function mint(address to, string memory tokenUriString) public returns (uint256)

// PYUSDC payment integration
IERC20 public immutable pyusdc;
uint256 public mintPrice; // 10 PYUSDC

// Payment validation
require(pyusdc.balanceOf(msg.sender) >= mintPrice, "Insufficient PYUSDC balance");
require(pyusdc.allowance(msg.sender, address(this)) >= mintPrice, "Insufficient PYUSDC allowance");
```

#### **PYUSDC Token Features:**
```solidity
// Standard ERC-20 with 6 decimals (like USDC)
contract PYUSDC is ERC20, Ownable {
    uint8 private _decimals = 6;
    
    // Airdrop functionality
    function airdrop(address[] memory recipients, uint256[] memory amounts) public onlyOwner
    
    // Minting for testing
    function mint(address to, uint256 amount) public onlyOwner
}
```

### **🚀 Deployment Steps:**

#### **Step 1: Deploy Contracts**
```bash
cd hardhat-project
npm install
npx hardhat compile
npx hardhat run scripts/deploy-pyusdc-nft.ts --network kadena-testnet
```

#### **Step 2: Update Environment Variables**
```bash
# .env.local
NEXT_PUBLIC_PYUSDC_CONTRACT_ADDRESS=0x[deployed_address]
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0x[deployed_address]
NEXT_PUBLIC_KADENA_CHAIN_ID=5920
NEXT_PUBLIC_KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
```

#### **Step 3: Update Config.json**
```json
{
  "kadena": {
    "pyusdcAddress": "0x[deployed_pyusdc_address]",
    "contractAddress": "0x[deployed_nft_address]"
  }
}
```

### **💰 PYUSDC Token Details:**

#### **Token Specifications:**
- **Name**: PayPal USD Coin
- **Symbol**: PYUSDC
- **Decimals**: 6 (like USDC)
- **Initial Supply**: 1,000,000 PYUSDC
- **Mint Price**: 10 PYUSDC per NFT

#### **Airdrop Distribution:**
- **Test Accounts**: 1,000 PYUSDC each
- **Deployer**: 1,000,000 PYUSDC
- **Additional**: Can be airdropped to more accounts

### **🎵 User Experience:**

#### **For Artists (Minting):**
1. **Connect Wallet** → See PYUSDC balance
2. **Upload Files** → MP3 + album cover
3. **Check Balance** → Must have ≥10 PYUSDC
4. **Click Mint** → Pays 10 PYUSDC, receives NFT
5. **Success** → NFT appears in wallet

#### **For Fans (Purchasing):**
1. **Connect Wallet** → See PYUSDC balance
2. **Enter Token ID** → NFT to purchase
3. **Enter Price** → Amount to pay
4. **Approve PYUSDC** → Allow contract to spend
5. **Buy NFT** → Transfer ownership + payment

### **🔍 Key Features:**

#### **Payment Integration:**
- ✅ **Automatic Payment** - PYUSDC deducted on mint
- ✅ **Balance Validation** - Checks sufficient funds
- ✅ **Allowance Management** - Handles ERC-20 approvals
- ✅ **Real-time Balance** - Shows current PYUSDC balance

#### **Error Handling:**
- ❌ **Insufficient Balance** - Clear error messages
- ❌ **No Allowance** - Guides user to approve
- ❌ **Invalid Token ID** - Validates token exists
- ❌ **Not For Sale** - Checks sale status

#### **User Interface:**
- 💰 **Balance Display** - Shows PYUSDC balance prominently
- 🔄 **Loading States** - Visual feedback during transactions
- ✅ **Success Messages** - Confirmation with explorer links
- ❌ **Error Messages** - Clear, actionable error messages

### **🧪 Testing Flow:**

#### **Complete Test Scenario:**
1. **Deploy Contracts** → Get contract addresses
2. **Update Config** → Set addresses in environment
3. **Connect Wallet** → MetaMask on Kadena testnet
4. **Check Balance** → Should show PYUSDC balance
5. **Upload Files** → MP3 + album cover
6. **Mint NFT** → Pay 10 PYUSDC, receive NFT
7. **Set Price** → Owner sets NFT for sale
8. **Buy NFT** → Another user purchases with PYUSDC
9. **Preview Audio** → Listen to audio file

### **📊 Contract Functions:**

#### **MusicNFTV2 Functions:**
```solidity
// Public minting (anyone can call)
function mint(address to, string memory tokenUriString) public returns (uint256)

// Purchase NFTs
function buyNFT(uint256 tokenId, address buyer, uint256 amount) public

// Price management
function setTokenPrice(uint256 tokenId, uint256 price) public onlyOwner
function getTokenPrice(uint256 tokenId) public view returns (uint256)

// Contract management
function setMintPrice(uint256 newPrice) public onlyOwner
function withdrawPYUSDC(uint256 amount) public onlyOwner
```

#### **PYUSDC Functions:**
```solidity
// Standard ERC-20
function balanceOf(address account) public view returns (uint256)
function approve(address spender, uint256 amount) public returns (bool)
function transfer(address to, uint256 amount) public returns (bool)

// Admin functions
function mint(address to, uint256 amount) public onlyOwner
function airdrop(address[] memory recipients, uint256[] memory amounts) public onlyOwner
```

### **🔗 Integration Points:**

#### **Frontend Integration:**
- **ArtistUpload.tsx** → Minting with PYUSDC payment
- **FanPurchase.tsx** → Purchasing with PYUSDC
- **Balance Display** → Real-time PYUSDC balance
- **Error Handling** → User-friendly error messages

#### **Backend Integration:**
- **Contract Calls** → Direct blockchain interaction
- **Balance Queries** → Real-time balance checking
- **Transaction Tracking** → Monitor mint/purchase status
- **Explorer Links** → Link to Kadena explorer

### **🎯 Benefits of PYUSDC Integration:**

✅ **Real Payment System** - Uses actual PayPal token  
✅ **Standard Compliance** - ERC-20 standard with 6 decimals  
✅ **Easy Testing** - Airdrop functionality for test accounts  
✅ **Production Ready** - Can be deployed to mainnet  
✅ **User Friendly** - Clear balance and payment displays  
✅ **Secure** - Proper allowance and balance validation  

### **🚨 Important Notes:**

1. **Contract Addresses** - Must be updated after deployment
2. **PYUSDC Balance** - Users need PYUSDC to mint/purchase
3. **Network** - Must be on Kadena EVM testnet (Chain ID: 5920)
4. **Gas Fees** - Still paid in KDA, PYUSDC is for NFT payments
5. **Testing** - Use testnet PYUSDC, not real PayPal tokens

This integration provides a complete, production-ready system for Music NFTs with PayPal PYUSDC payment integration!
