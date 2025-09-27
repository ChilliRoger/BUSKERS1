# Tusky API Setup Guide

This guide will help you set up the Tusky API for file uploads in your Next.js application.

## 1. Get Tusky API Key

1. Visit [Tusky Dashboard](https://app.tusky.io/)
2. Sign up or log in to your account
3. Navigate to **Account Settings** → **API Keys**
4. Generate a new API key for your application
5. Copy the API key (it will look like: `3311a6a5-f561-4868-9819-edd3bd93c57b`)

## 2. Environment Configuration

Create a `.env.local` file in your `buskers` directory with the following variables:

```env
# Tusky Configuration
TUSKY_API_KEY=your_actual_api_key_here
TUSKY_NETWORK=testnet

# Kadena Configuration
NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0xCF9C0C4c9E7C0b2BEAFc0Be2182115F2d386B313
NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL=https://explorer.chainweb.com/testnet/tx

# App Configuration
NEXT_PUBLIC_APP_NAME=Buskers
NEXT_PUBLIC_APP_DESCRIPTION=Decentralized Music Platform
```

## 3. API Route Features

The updated `/api/upload` route now includes:

### ✅ Dynamic Configuration
- Uses `process.env.TUSKY_API_KEY` for authentication
- Configurable network via `process.env.TUSKY_NETWORK` (defaults to 'testnet')
- Proper error handling for missing API key

### ✅ File Validation
- **File Type**: Only MP3 files allowed
- **File Size**: Maximum 50MB limit
- **FormData Parsing**: Handles multipart form data correctly

### ✅ Vault Management
- **Cached Vault**: Reuses existing vault to avoid creating multiple vaults
- **Public Vault**: Creates unencrypted vault for music files
- **Path Structure**: Files uploaded to `/music/{filename}`

### ✅ Upload Process
1. Validates API key and file
2. Creates or reuses vault
3. Converts file to buffer
4. Uploads to Tusky with proper path
5. Returns upload ID and metadata

### ✅ Error Handling
- **500 Error**: Missing API key or server configuration issues
- **400 Error**: Invalid file type or size
- **Detailed Logging**: Console logs for debugging

## 4. Testing the Upload

### Test with curl:
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@your-music-file.mp3"
```

### Expected Response:
```json
{
  "success": true,
  "uploadId": "tusky-1234567890-abcdef123",
  "fileName": "your-music-file.mp3",
  "fileSize": 5242880,
  "vaultId": "vault-1234567890",
  "path": "/music/your-music-file.mp3",
  "message": "File uploaded to Walrus storage via Tusky"
}
```

## 5. Verify Upload

1. Visit [Tusky Files Dashboard](https://app.tusky.io/files)
2. Look for your uploaded file in the "Buskers Music Vault"
3. Verify the file path matches `/music/{filename}`

## 6. Integration with Frontend

The upload API is now ready to work with your `ArtistUpload` component. The component will:

1. Upload file to `/api/upload`
2. Receive `uploadId` from Tusky
3. Use `uploadId` to mint NFT with `tusky-walrus://{uploadId}` URI
4. Display success message with Kadena explorer link

## 7. Troubleshooting

### Common Issues:

**"Server configuration error"**
- Check that `TUSKY_API_KEY` is set in `.env.local`
- Verify the API key is valid

**"Invalid file type"**
- Ensure you're uploading MP3 files only
- Check file extension and MIME type

**"File upload failed"**
- Check Tusky API status
- Verify network connectivity
- Check file size (must be < 50MB)

**"Failed to create storage vault"**
- Verify API key permissions
- Check Tusky service status
- Try again after a few minutes

## 8. Production Considerations

- **API Key Security**: Never commit API keys to version control
- **Rate Limiting**: Consider implementing rate limiting for uploads
- **File Validation**: Add virus scanning for production
- **Monitoring**: Set up logging and monitoring for upload failures
- **Backup**: Consider implementing backup strategies for uploaded files
