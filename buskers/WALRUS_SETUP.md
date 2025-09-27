# Walrus Testnet Setup

## Environment Configuration

Add the following to your `.env.local` file:

```env
# Walrus Testnet Configuration
NEXT_PUBLIC_WALRUS_TESTNET_AGGREGATOR=https://aggregator.testnet.walrus.site:4443
NEXT_PUBLIC_WALRUS_SUI_RPC=https://fullnode.testnet.sui.io:443
NEXT_PUBLIC_WALRUS_SUI_FAUCET=https://faucet.testnet.sui.io/gas
```

## Walrus Testnet Endpoints

The following endpoints are configured for Walrus testnet integration:

- **Aggregator**: `https://aggregator.testnet.walrus.site:4443` - Main Walrus testnet aggregator
- **Sui RPC**: `https://fullnode.testnet.sui.io:443` - Sui testnet RPC for SDK operations
- **Sui Faucet**: `https://faucet.testnet.sui.io/gas` - For getting SUI tokens (needed for WAL exchange)

## Features

The ArtistUpload component includes:

- ✅ **File Upload**: Drag & drop MP3 file upload
- ✅ **Walrus Integration**: Uploads files to Walrus testnet as blobs
- ✅ **File Validation**: MP3 format and size validation (max 50MB)
- ✅ **Loading States**: Upload progress indicators
- ✅ **Error Handling**: Comprehensive error messages
- ✅ **Success Feedback**: Blob ID display and file info
- ✅ **Dynamic Configuration**: Uses environment variables
- ✅ **Responsive Design**: Mobile-friendly interface

## Usage

1. Set the `NEXT_PUBLIC_WALRUS_TESTNET_ENDPOINT` environment variable
2. The component will automatically use the Walrus SDK
3. Users can upload MP3 files directly to Walrus testnet
4. Blob IDs are displayed for further use

## Walrus Quals Compliance

- ✅ **Uploads to testnet**: Uses Walrus testnet endpoint
- ✅ **Newly developed**: Built specifically for this project
- ✅ **Dynamic**: No hardcoded endpoints or authentication
