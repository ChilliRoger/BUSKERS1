# 🎵 Buskers - Decentralized Music Platform

A modern, blockchain-powered music platform that connects artists and fans through NFTs, built with Next.js and deployed on Kadena EVM Testnet.

![Buskers Logo](./public/11.png)

## 🌟 Features

### 🎭 **Dual Role System**
- **Artist Mode**: Upload music, mint NFTs, manage events, create posts
- **Fan Mode**: Discover music, purchase NFTs, book event tickets, follow artists
- **Role Switching**: Seamlessly switch between Artist and Fan perspectives

### 🎨 **Neo-Modern Minimalism Design**
- **Dark Immersive Theme**: Professional dark background with vibrant accents
- **Color Palette**: Indigo + Mint Green + Coral accents
- **Glassmorphism Effects**: Translucent cards with blur effects
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Typography**: Poppins + Inter fonts for modern readability

### 🔗 **Blockchain Integration**
- **Kadena EVM Testnet**: Fast, secure blockchain infrastructure
- **MetaMask Wallet**: Seamless wallet connection and management
- **PYUSD Payments**: PayPal's official USD stablecoin integration
- **NFT Minting**: Create music NFTs with album covers
- **Smart Contracts**: Automated royalty and payment distribution

### 🎵 **Music Features**
- **Audio Upload**: MP3 file upload with Tusky decentralized storage
- **Album Covers**: Image upload support (JPG, PNG, GIF)
- **Audio Preview**: Listen to tracks before purchasing
- **NFT Marketplace**: Buy and sell music NFTs
- **Event Management**: Artists can register for events, fans can book tickets

### 📱 **User Experience**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live balance and transaction status
- **Error Handling**: Comprehensive error messages and fallbacks
- **Loading States**: Visual feedback during blockchain operations
- **Toast Notifications**: User-friendly success/error messages

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MetaMask wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buskers
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the `buskers` directory:
   ```env
   # Kadena EVM Testnet Configuration
   NEXT_PUBLIC_KADENA_TESTNET_RPC=https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc
   NEXT_PUBLIC_KADENA_CHAIN_ID=5920
   NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL=https://explorer.chainweb.com/testnet/tx
   
   # Contract Addresses
   NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS=0xbC07F61eE3C14e9EDC3004eDFa0163937d1BfAE6
   NEXT_PUBLIC_PYUSD_ADDRESS=0x0aD75db1a6C8B5B6d5F0398F6bd724dd0fb920AF
   NEXT_PUBLIC_MOCK_PYUSD_ADDRESS=0x45fD5d31E2D015d5E97CD1D9cd94B0bcE354A867
   
   # WalletConnect Configuration
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=af795a67e519c60d96a18987b1b081fd
   
   # App Configuration
   NEXT_PUBLIC_APP_NAME=Buskers
   NEXT_PUBLIC_APP_DESCRIPTION=Decentralized Music Platform
   
   # Tusky Storage (Optional - has fallback)
   TUSKY_API_KEY=487f9ba3-aea5-4277-8e29-8eccb7e346de
   TUSKY_NETWORK=testnet
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🦊 MetaMask Setup

### 1. Add Kadena EVM Testnet
1. Open MetaMask
2. Click network dropdown → "Add network manually"
3. Enter these details:
   - **Network Name**: Kadena EVM Testnet
   - **RPC URL**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc`
   - **Chain ID**: `5920`
   - **Currency Symbol**: `KDA`
   - **Block Explorer**: `https://explorer.chainweb.com/testnet`

### 2. Get Testnet Tokens
1. Visit [Kadena Testnet Faucet](https://faucet.testnet.chainweb.com/)
2. Enter your MetaMask wallet address
3. Request testnet KDA tokens for gas fees

## 🎯 How to Use

### For Artists 🎤

1. **Connect Wallet**: Click "Connect Wallet" in the navbar
2. **Select Artist Role**: Choose "Artist" when prompted
3. **Upload Music**: 
   - Select MP3 file
   - Upload album cover image
   - Click "Mint NFT" (costs 10 PYUSD)
4. **Manage Events**: Register to perform at events
5. **Create Posts**: Share updates with fans
6. **View Profile**: See your minted NFTs and statistics

### For Fans 🎧

1. **Connect Wallet**: Click "Connect Wallet" in the navbar
2. **Select Fan Role**: Choose "Fan" when prompted
3. **Discover Music**: Browse available NFTs
4. **Preview Tracks**: Listen to audio previews
5. **Purchase NFTs**: Buy music NFTs with PYUSD
6. **Book Events**: Purchase tickets for live performances
7. **Follow Artists**: Stay updated with new releases

## 🏗️ Project Structure

```
buskers/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── upload/        # File upload endpoint
│   │   ├── preview/       # Audio preview endpoint
│   │   ├── music/         # Music file serving
│   │   ├── image/         # Image file serving
│   │   ├── metadata/      # NFT metadata
│   │   └── test/          # Environment testing
│   ├── events/            # Events page
│   ├── posts/             # Posts page
│   ├── profile/           # Profile page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ArtistUpload.tsx   # Artist upload form
│   ├── FanPurchase.tsx    # Fan purchase form
│   ├── Navbar.tsx         # Navigation bar
│   ├── Footer.tsx         # Footer component
│   ├── WalletConnect.tsx  # Wallet connection
│   ├── RoleProvider.tsx   # Role context
│   └── RoleSelectionModal.tsx # Role selection
├── public/                # Static assets
│   └── 11.png            # Logo image
├── config.json           # Configuration file
└── package.json          # Dependencies
```

## 🔧 API Endpoints

### File Upload
- **POST** `/api/upload` - Upload MP3 and image files to Tusky storage

### Audio Preview
- **POST** `/api/preview` - Get audio preview for NFT purchase

### File Serving
- **GET** `/api/music/[uploadId]` - Serve audio files
- **GET** `/api/image/[uploadId]` - Serve image files
- **GET** `/api/metadata/[tokenId]` - Get NFT metadata

### Testing
- **GET** `/api/test` - Test environment variables and API status

## 🎨 Design System

### Colors
- **Background**: `#0f0f23` (Dark immersive)
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#10b981` (Mint Green)
- **Accent**: `#f97316` (Coral)
- **Text**: `#f8fafc` (Light)

### Typography
- **Headings**: Poppins (300-800 weights)
- **Body**: Inter (300-700 weights)

### Effects
- **Glassmorphism**: `backdrop-blur-xl` with transparency
- **Glow Effects**: Custom CSS variables for hover states
- **Animations**: Framer Motion for smooth transitions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animation library
- **React Hot Toast** - Notification system

### Blockchain
- **Kadena EVM Testnet** - Blockchain network
- **MetaMask** - Wallet integration
- **Ethers.js** - Ethereum library
- **PYUSD** - PayPal USD stablecoin
- **Smart Contracts** - NFT minting and trading

### Storage
- **Tusky Protocol** - Decentralized file storage
- **Fallback System** - Mock uploads for development

### Development
- **Turbopack** - Fast bundling
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Update the following in your production environment:
- `NEXT_PUBLIC_KADENA_TESTNET_RPC`
- `NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_PYUSD_ADDRESS`
- `TUSKY_API_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Wallet Connection Failed**
- Ensure MetaMask is installed and unlocked
- Check that Kadena EVM Testnet is added
- Verify you have testnet KDA for gas fees

**Upload Failed**
- Check internet connection
- Verify Tusky API key is correct
- Try refreshing the page

**Transaction Failed**
- Ensure sufficient PYUSD balance
- Check gas fees (KDA balance)
- Verify contract addresses are correct

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page
- Join our Discord community
- Email support at support@buskers.com

## 🎵 Roadmap

### Phase 1 (Current)
- ✅ Basic NFT minting and trading
- ✅ Role-based user interface
- ✅ Event management system
- ✅ Audio preview functionality

### Phase 2 (Planned)
- 🔄 Social features (following, comments)
- 🔄 Advanced search and filtering
- 🔄 Mobile app development
- 🔄 Analytics dashboard

### Phase 3 (Future)
- 🔄 AI-powered music recommendations
- 🔄 Live streaming integration
- 🔄 Cross-chain compatibility
- 🔄 DAO governance system

---

**Built with ❤️ by the Buskers Team**

*Empowering artists, connecting fans, revolutionizing music through blockchain technology.*