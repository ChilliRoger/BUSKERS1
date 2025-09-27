import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { createStorage, noopStorage } from 'wagmi';
import appConfig from '../config.json';

// Diagnostic logging
console.log('🔍 WAGMI CONFIG DIAGNOSTICS:');
console.log('Loaded RPC:', process.env.NEXT_PUBLIC_KADENA_TESTNET_RPC || appConfig.kadena.testnetRpc);
console.log('Chain ID:', process.env.NEXT_PUBLIC_KADENA_CHAIN_ID || appConfig.kadena.chainId);
console.log('Contract Address:', process.env.NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS || appConfig.kadena.contractAddress);
console.log('App Name:', process.env.NEXT_PUBLIC_APP_NAME || appConfig.app.name);
console.log('================================');

// Define Kadena EVM testnet chain dynamically
const kadenaTestnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_KADENA_CHAIN_ID) || appConfig.kadena.chainId,
  name: 'Kadena EVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Kadena',
    symbol: 'KDA',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_KADENA_TESTNET_RPC || appConfig.kadena.testnetRpc],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_KADENA_TESTNET_RPC || appConfig.kadena.testnetRpc],
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
  appName: process.env.NEXT_PUBLIC_APP_NAME || appConfig.app.name,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || appConfig.wallet.projectId,
  chains: [kadenaTestnet], // Only Kadena EVM testnet
  ssr: true, // If your dApp uses server side rendering (SSR)
  storage: createStorage({
    storage: noopStorage, // This disables auto-connect by not persisting connection state
  }),
});
