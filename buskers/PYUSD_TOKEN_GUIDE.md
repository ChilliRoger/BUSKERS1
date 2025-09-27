# PYUSD Token Guide - How to Get PYUSD for Testing

## 🎉 **TestPYUSD Successfully Deployed!**

### **✅ TestPYUSD Token Details:**
- **Address**: `0x0aD75db1a6C8B5B6d5F0398F6bd724dd0fb920AF`
- **Symbol**: tPYUSD
- **Decimals**: 6 (like USDC)
- **Network**: Kadena EVM Testnet (Chain ID: 5920)
- **Total Supply**: 1,000,000 tPYUSD
- **Status**: ✅ Ready for Testing

## 🚀 **How to Get PYUSD Tokens:**

### **Option 1: Use TestPYUSD (Recommended for Testing)**

#### **✅ Already Deployed:**
The TestPYUSD token is already deployed and ready to use! You have several ways to get tokens:

#### **A. Faucet Function (Anyone can use):**
```javascript
// Connect to the contract
const testPyusd = new ethers.Contract(
  "0x0aD75db1a6C8B5B6d5F0398F6bd724dd0fb920AF",
  TestPYUSD_ABI,
  signer
);

// Get up to 1,000 tPYUSD (can be called multiple times)
await testPyusd.faucet(ethers.parseUnits("1000", 6));
```

#### **B. Airdrop (Already done):**
- **Deployer**: 1,000,000 tPYUSD
- **Test Account**: 10,000 tPYUSD (if address is valid)

#### **C. Direct Transfer:**
If you know someone with tPYUSD, they can transfer it to you.

### **Option 2: Real PYUSD (Production)**

#### **A. Buy from Exchanges:**
1. **Coinbase** - Buy PYUSD directly
2. **Kraken** - Trade for PYUSD
3. **Binance** - Purchase PYUSD
4. **Other Exchanges** - Check PYUSD availability

#### **B. Bridge from Ethereum:**
1. **Get PYUSD on Ethereum** - Buy from exchanges
2. **Use Bridges** - Bridge to Kadena EVM (when available)
3. **Cross-chain Solutions** - Use LayerZero or other bridges

#### **C. Testnet Faucets:**
- **Kadena Faucet**: https://tatum.io/faucets/kadena (for KDA tokens)
- **Check Kadena EVM Portal**: https://evm.kadena.io/ for token faucets

## 🔧 **Configuration Update:**

### **For Testing (TestPYUSD):**
```bash
# .env.local
NEXT_PUBLIC_PYUSD_CONTRACT_ADDRESS=0x0aD75db1a6C8B5B6d5F0398F6bd724dd0fb920AF
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0x4a98E109082C2ca61bfA83b20CffDfe3CefbB5b3
NEXT_PUBLIC_KADENA_CHAIN_ID=5920
NEXT_PUBLIC_KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
```

### **For Production (Real PYUSD):**
```bash
# .env.local
NEXT_PUBLIC_PYUSD_CONTRACT_ADDRESS=0x6c3ea9036406852006290770bedfcaba0e23a0e8
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0x4a98E109082C2ca61bfA83b20CffDfe3CefbB5b3
NEXT_PUBLIC_KADENA_CHAIN_ID=5920
NEXT_PUBLIC_KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
```

## 🎵 **Testing the Complete Flow:**

### **Step 1: Connect Wallet**
1. **Open MetaMask**
2. **Switch to Kadena EVM Testnet** (Chain ID: 5920)
3. **Connect to the app**

### **Step 2: Get TestPYUSD Tokens**
1. **Use Faucet**: Call the faucet function to get 1,000 tPYUSD
2. **Check Balance**: Should show tPYUSD balance in the app
3. **Get More**: Call faucet again if needed

### **Step 3: Test Minting**
1. **Upload Files**: MP3 + album cover
2. **Check Balance**: Must have ≥10 tPYUSD
3. **Click Mint**: Pays 10 tPYUSD, receives NFT
4. **Success**: NFT appears in wallet

### **Step 4: Test Purchasing**
1. **Set Price**: Owner sets NFT for sale
2. **Enter Token ID**: NFT to purchase
3. **Enter Price**: Amount to pay in tPYUSD
4. **Approve tPYUSD**: Allow contract to spend
5. **Buy NFT**: Transfer ownership + payment

## 💰 **Token Economics:**

### **TestPYUSD (Testing):**
- **Mint Price**: 10 tPYUSD per NFT
- **Faucet Limit**: 1,000 tPYUSD per call
- **Total Supply**: 1,000,000 tPYUSD
- **Decimals**: 6 (like USDC)

### **Real PYUSD (Production):**
- **Mint Price**: 10 PYUSD per NFT
- **Real Value**: 1 PYUSD = 1 USD
- **Regulated**: NYDFS regulated
- **Audited**: Regularly audited

## 🔍 **Contract Functions:**

### **TestPYUSD Functions:**
```solidity
// Faucet - anyone can get tokens
function faucet(uint256 amount) public

// Standard ERC-20
function balanceOf(address account) public view returns (uint256)
function approve(address spender, uint256 amount) public returns (bool)
function transfer(address to, uint256 amount) public returns (bool)

// Admin functions
function mint(address to, uint256 amount) public onlyOwner
function airdrop(address[] memory recipients, uint256[] memory amounts) public onlyOwner
```

### **MusicNFTV2 Functions:**
```solidity
// Mint with PYUSD payment
function mint(address to, string memory tokenUriString) public returns (uint256)

// Buy NFT with PYUSD
function buyNFT(uint256 tokenId, address buyer, uint256 amount) public

// Price management
function setTokenPrice(uint256 tokenId, uint256 price) public onlyOwner
function getTokenPrice(uint256 tokenId) public view returns (uint256)
```

## 🎯 **Quick Start Guide:**

### **For Developers:**
1. **Deploy TestPYUSD** ✅ (Already done)
2. **Update Config** ✅ (Already done)
3. **Get Test Tokens** - Use faucet function
4. **Test Minting** - Upload files and mint
5. **Test Purchasing** - Buy NFTs with tPYUSD

### **For Users:**
1. **Connect Wallet** - MetaMask on Kadena testnet
2. **Get Tokens** - Use faucet or ask for transfer
3. **Upload Music** - MP3 + album cover
4. **Mint NFT** - Pay 10 tPYUSD
5. **Buy/Sell** - Trade NFTs with tPYUSD

## 🚨 **Important Notes:**

### **Testing:**
- ✅ **Use TestPYUSD** - Free tokens for testing
- ✅ **Faucet Available** - Get tokens anytime
- ✅ **No Real Value** - Test tokens only
- ✅ **Unlimited Supply** - Can mint more if needed

### **Production:**
- 💰 **Real PYUSD** - Has actual USD value
- 🔒 **Regulated** - NYDFS regulated
- 🌉 **Bridge Required** - Must bridge from Ethereum
- 💸 **Purchase Required** - Buy from exchanges

## 📈 **Next Steps:**

1. **✅ TestPYUSD Deployed** - Ready for testing
2. **✅ Config Updated** - Using test token
3. **🔄 Test Minting** - Upload files and mint NFTs
4. **🔄 Test Purchasing** - Buy/sell NFTs
5. **🔄 Test Audio** - Preview uploaded music
6. **🔄 Production Ready** - Switch to real PYUSD when ready

## 🎉 **Ready to Test!**

The TestPYUSD token is now deployed and ready for testing. You can start minting and purchasing Music NFTs with tPYUSD tokens right away!
