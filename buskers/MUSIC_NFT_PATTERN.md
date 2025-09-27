# Music NFT Pattern Documentation

## 🎵 **Simple Music NFT Pattern**

This system creates a clean, simple pattern for music NFTs where:

### **NFT Structure:**
- **NFT Image**: Album cover artwork (the visual representation)
- **NFT Metadata**: Links to the audio file and contains all relevant information
- **Audio File**: Stored separately and linked via metadata

### **How It Works:**

#### **1. Upload Process:**
```
User uploads:
├── MP3 Audio File → Stored on Tusky/Walrus → Gets uploadId
└── Album Cover Image → Stored on Tusky/Walrus → Gets albumCoverUploadId
```

#### **2. NFT Creation:**
```
NFT Metadata contains:
├── image: /api/image/{albumCoverUploadId} (Album cover as NFT image)
├── external_url: /api/music/{uploadId} (Link to audio file)
├── attributes: File names, upload IDs, etc.
└── properties: Direct links to both files
```

#### **3. NFT Display:**
- **In MetaMask**: Shows album cover as the NFT image
- **In Explorers**: Album cover displays as the main NFT image
- **Clicking NFT**: Links to audio file page
- **Metadata**: Contains all file references and attributes

### **Benefits of This Pattern:**

✅ **Simple**: Album cover is the visual, audio is linked
✅ **Standard**: Follows ERC-721 metadata standards
✅ **Clean**: Clear separation between visual and audio
✅ **Accessible**: Works in all wallets and explorers
✅ **Scalable**: Easy to add more metadata later

### **File Structure:**
```
/api/image/[uploadId] → Serves album cover images
/api/music/[uploadId] → Serves audio file pages
/api/metadata/[tokenId] → Serves NFT metadata
```

### **Metadata Example:**
```json
{
  "name": "My Song NFT",
  "description": "Music NFT containing 'my-song.mp3' with album cover artwork...",
  "image": "http://localhost:3000/api/image/album-cover-123",
  "external_url": "http://localhost:3000/music/audio-file-456",
  "attributes": [
    {"trait_type": "Type", "value": "Music NFT"},
    {"trait_type": "Audio File", "value": "my-song.mp3"},
    {"trait_type": "Audio ID", "value": "audio-file-456"},
    {"trait_type": "Album Cover ID", "value": "album-cover-123"}
  ],
  "properties": {
    "audio_file": "tusky-walrus://audio-file-456",
    "album_cover": "tusky-walrus://album-cover-123",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### **User Experience:**
1. **Upload**: User uploads MP3 + album cover
2. **Mint**: Creates NFT with album cover as image
3. **View**: Album cover shows in wallet/explorer
4. **Access**: Clicking NFT links to audio file
5. **Own**: User owns both the visual and audio rights

This pattern is simple, clean, and follows NFT standards while making music NFTs easy to understand and use!

