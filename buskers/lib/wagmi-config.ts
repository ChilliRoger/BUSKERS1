import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { createStorage, noopStorage } from 'wagmi';

// Define Kadena EVM testnet chain
const kadenaTestnet = defineChain({
  id: Number(process.env.KADENA_CHAIN_ID) || 1,
  name: 'Kadena EVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Kadena',
    symbol: 'KDA',
  },
  rpcUrls: {
    default: {
      http: [process.env.KADENA_TESTNET_RPC || 'https://api.testnet.chainweb.com/evm'],
    },
    public: {
      http: [process.env.KADENA_TESTNET_RPC || 'https://api.testnet.chainweb.com/evm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Kadena Explorer',
      url: 'https://explorer.chainweb.com/testnet',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Buskers',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'af795a67e519c60d96a18987b1b081fd',
  chains: [kadenaTestnet, mainnet, polygon, optimism, arbitrum, base, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
  storage: createStorage({
    storage: noopStorage, // This disables auto-connect by not persisting connection state
  }),
});
