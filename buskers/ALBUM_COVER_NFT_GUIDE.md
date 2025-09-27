# Album Cover as NFT Image - Complete Guide

## 🎨 What's New

Your uploaded album cover image will now be displayed as the NFT image in:
- **MetaMask Wallet** (in the Collectibles/NFTs tab)
- **Kadena Explorer** (instead of the placeholder)
- **Any NFT marketplace** that supports the NFT

## 🔧 How It Works

### 1. **Upload Process**
- Upload MP3 file → Gets upload ID (e.g., `tusky-1234567890-abc123`)
- Upload album cover → Gets upload ID (e.g., `tusky-cover-1234567890-def456`)
- Both files are stored on Tusky/Walrus decentralized storage

### 2. **NFT Metadata Generation**
- Creates proper ERC-721 metadata JSON
- Uses album cover upload ID as the main NFT image
- Includes both MP3 and album cover references
- Generates attributes for the NFT

### 3. **NFT Minting**
- Mints NFT with metadata URI containing album cover image
- Album cover becomes the visual representation of the NFT
- MP3 file is referenced in the metadata properties

## 🚀 Testing the New Feature

### Step 1: Upload Files
1. **Select MP3 file** (your music)
2. **Select album cover image** (JPG, PNG, GIF)
3. **Click "Upload to Walrus"**
4. **Wait for success** - you'll see both upload IDs

### Step 2: Connect Wallet
1. **Click "Connect MetaMask"**
2. **Switch to Kadena EVM Testnet** in MetaMask
3. **Verify connection** - you should see your address

### Step 3: Mint NFT
1. **Click "Mint NFT on Kadena"**
2. **Approve transaction** in MetaMask
3. **Wait for confirmation**

### Step 4: Verify NFT
1. **Check MetaMask** → Collectibles/NFTs tab
2. **Look for your NFT** - it should show the album cover image
3. **Click "View on Kadena Explorer"** to see it on the blockchain

## 📱 What You'll See

### In MetaMask Wallet
- **NFT Image**: Your uploaded album cover
- **NFT Name**: "{filename} - Music NFT #{tokenId}"
- **Description**: Details about the music and artwork
- **Attributes**: File type, audio file name, album cover ID, etc.

### In Kadena Explorer
- **Main Image**: Your album cover (instead of placeholder)
- **Token Details**: All metadata and attributes
- **Transfer History**: Transaction details

### In the App
- **Success Message**: Shows both upload IDs
- **Mint Button**: Only enabled after both files uploaded
- **Explorer Link**: Direct link to view the NFT

## 🔍 Technical Details

### Metadata Structure
```json
{
  "name": "My Song - Music NFT #3",
  "description": "Music NFT containing 'My Song.mp3' with album cover artwork...",
  "image": "http://localhost:3000/api/image/tusky-cover-1234567890-def456",
  "external_url": "http://localhost:3000/nft/3",
  "attributes": [
    {
      "trait_type": "Type",
      "value": "Music NFT"
    },
    {
      "trait_type": "Audio File", 
      "value": "My Song.mp3"
    },
    {
      "trait_type": "Album Cover ID",
      "value": "tusky-cover-1234567890-def456"
    }
  ],
  "properties": {
    "music_file": "tusky-walrus://tusky-1234567890-abc123",
    "album_cover": "tusky-walrus://tusky-cover-1234567890-def456",
    "created_at": "2024-01-27T10:30:00.000Z"
  }
}
```

### API Endpoints
- **`/api/image/[uploadId]`**: Serves the album cover image
- **`/api/metadata/[tokenId]`**: Serves NFT metadata
- **`/api/upload`**: Handles file uploads to Tusky

## 🎯 Key Features

- ✅ **Album Cover as NFT Image**: Your uploaded image becomes the NFT visual
- ✅ **Dual File Upload**: Both MP3 and album cover required
- ✅ **Proper Metadata**: ERC-721 compliant metadata structure
- ✅ **Decentralized Storage**: Files stored on Tusky/Walrus
- ✅ **MetaMask Integration**: NFT appears in your wallet
- ✅ **Explorer Support**: Visible on Kadena blockchain explorer

## 🔧 Troubleshooting

### Album Cover Not Showing
- **Check upload success**: Both files must upload successfully
- **Verify upload IDs**: Should see both MP3 and album cover IDs
- **Refresh MetaMask**: Sometimes needs a refresh to show new NFTs

### NFT Not Appearing in MetaMask
- **Check network**: Must be on Kadena EVM Testnet
- **Wait for confirmation**: Transaction needs to be confirmed
- **Refresh wallet**: Close and reopen MetaMask

### Image Not Loading
- **Check API endpoint**: Visit `/api/image/[uploadId]` directly
- **Verify upload ID**: Make sure the ID is correct
- **Check network**: Ensure you're on the right network

## 🎉 Success!

When everything works correctly, you'll have:
- **A beautiful NFT** with your album cover as the image
- **Music file reference** in the metadata
- **Ownership proof** on the blockchain
- **Transferable asset** you can send to others

The NFT will look professional and represent your music properly in any wallet or marketplace that supports ERC-721 tokens!
