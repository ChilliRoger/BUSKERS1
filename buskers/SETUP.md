# Buskers Setup Instructions

## Environment Configuration

Create a `.env.local` file in the `buskers` directory with the following configuration:

```env
# Kadena EVM Testnet Configuration
KADENA_TESTNET_RPC=https://api.testnet.chainweb.com/evm
KADENA_CHAIN_ID=1

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=Buskers
NEXT_PUBLIC_APP_DESCRIPTION=Decentralized Music Platform

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=af795a67e519c60d96a18987b1b081fd
```

## Getting a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create an account or sign in
3. Create a new project
4. Copy the Project ID and add it to your `.env.local` file

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **Wallet Connection**: Connect with MetaMask and other supported wallets
- **Kadena EVM Testnet**: Configured to work with Kadena's EVM testnet
- **Artist Upload Section**: Placeholder for music upload functionality
- **Fan Purchase Section**: Placeholder for music discovery and purchase
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Testing Wallet Connection

1. Make sure you have MetaMask installed in your browser
2. Click the "Connect Wallet" button in the navbar
3. Select MetaMask from the wallet options
4. Approve the connection in MetaMask
5. Your wallet address should appear in the navbar and hero section
