# 🎶 BUSKERS

A decentralized platform for **artists around the world** to showcase, share, and store their work (music, art, media).  
Powered by **Walrus for storage**, **Kadena blockchain integration**, **PayPal USD (PYUSD) stablecoin**, and a **Next.js frontend** with a **neo-modern minimalist UI**.  

---

## 🚀 Features  
- 🌍 **Global Artist Profiles** – Music, art, and creations from all over the world  
- 🎵 **Audio/Video Uploads** – Stored securely with [Walrus](https://walrus.site)  
- 🔗 **Blockchain Integration** – Kadena network for authentication & smart contracts  
- 💸 **PYUSD Stablecoin Payments** – Fans can support artists, buy tickets, or purchase NFTs using **PayPal USD (PYUSD)** on Ethereum  
- 🎨 **Modern UI** – Neo-modern minimalist theme (Spotify x Behance vibes)  
- 💡 **Artist Discovery** – Explore new creators with search & category filters  
- 🏆 **Gamification** – Earn points, badges, and achievements as an artist or fan  

---

## 📂 Project Structure  

2️⃣ Install dependencies
npm install
# or
yarn install

3️⃣ Setup environment variables

Create a .env.local file in the root with:

# Walrus Storage
WALRUS_API_KEY=your_api_key_here

# Kadena Blockchain
KADENA_NETWORK=testnet04
KADENA_API=https://api.testnet.chainweb.com
KADENA_CHAIN_ID=0

# PYUSD Token (Ethereum)
NEXT_PUBLIC_PYUSD_CONTRACT=0x6c3ea9036406852006290770BEdFcAbA0e23A0e8

# App Config
NEXT_PUBLIC_APP_NAME="Global Art & Music Platform"

4️⃣ Run development server
npm run dev


Then open http://localhost:3000
.

🔗 Blockchain Setup
Kadena

Since Kadena is not natively supported in MetaMask, you’ll need to use:

Chainweaver Wallet
 (official Kadena wallet)

Or Kadena-compatible integration (kadena.js).

This repo includes hooks under /src/hooks/useKadena.ts to handle:

Wallet connection

Transaction signing

Smart contract interaction

PYUSD Token (Ethereum)

Contract Address: 0x6c3ea9036406852006290770BEdFcAbA0e23A0e8

Add PYUSD to MetaMask as a custom token to test transactions.

Fans can pay for:

🎟️ Tickets to live events

💿 Artist NFTs (songs, albums, artwork)

💖 Direct support/donations

📦 Storage Setup (Walrus)

Create an account on Walrus

Get your API key

Store files via walrus-client in /lib/storage.ts:

import { WalrusClient } from "walrus-client";

const client = new WalrusClient(process.env.WALRUS_API_KEY);

export async function uploadFile(file: File) {
  const res = await client.upload(file);
  return res.url;
}

🛠️ Tech Stack

Frontend: Next.js, React, TailwindCSS

UI Animations: Framer Motion

Blockchain: Kadena (identity, smart contracts)

Payments: PayPal USD (PYUSD) on Ethereum

Storage: Walrus (decentralized)

Auth: Wallet-based login

🤝 Contributing

Fork this repo

Create a new branch: feature/amazing-feature

Commit your changes:

git commit -m "Add amazing feature"


Push to the branch:

git push origin feature/amazing-feature


Open a Pull Request 🚀

📜 License

MIT License © 2025 [Your Name / Team Name]


---


