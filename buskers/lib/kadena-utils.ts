import { ethers } from 'ethers';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import appConfig from '../config.json';

// MusicNFT Contract ABI (complete for minting and buying)
const MUSIC_NFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "buyNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getTokenPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "isForSale",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// PYUSD Contract ABI (PayPal USD)
const PYUSD_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "faucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Get contract instance dynamically
export function getMusicNFTContract() {
  try {
    console.log('🔍 KADENA UTILS - Loading contract...');
    
    // Try environment variable first, then fallback to config
    const contractAddress = process.env.NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS || appConfig.kadena.contractAddress;
    
    if (!contractAddress) {
      const error = 'Contract address not configured. Please set NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS or update config.json';
      console.error('❌ CONTRACT LOAD FAILED:', error);
      throw new Error(error);
    }

    console.log('✅ Contract loaded at:', contractAddress);
    console.log('Contract ABI functions:', MUSIC_NFT_ABI.map(f => f.name));

    return {
      address: contractAddress as `0x${string}`,
      abi: MUSIC_NFT_ABI,
    };
  } catch (error) {
    console.error('❌ KADENA UTILS ERROR:', error);
    throw error;
  }
}

// Get Kadena explorer URL dynamically
export function getKadenaExplorerUrl(txHash: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL || appConfig.kadena.explorerBaseUrl;
  return `${baseUrl}/${txHash}`;
}

// Generate token URI for Walrus upload
// Get PYUSD contract instance (PayPal USD)
export function getPYUSDContract() {
  try {
    console.log('🔍 KADENA UTILS - Loading PYUSD contract...');
    
    const contractAddress = process.env.NEXT_PUBLIC_PYUSD_CONTRACT_ADDRESS || appConfig.kadena.pyusdAddress;
    
    if (!contractAddress) {
      const error = 'PYUSD contract address not configured. Please set NEXT_PUBLIC_PYUSD_CONTRACT_ADDRESS or update config.json';
      console.error('❌ PYUSD CONTRACT LOAD FAILED:', error);
      throw new Error(error);
    }

    console.log('✅ PYUSD contract loaded at:', contractAddress);

    return {
      address: contractAddress as `0x${string}`,
      abi: PYUSD_ABI,
    };
  } catch (error) {
    console.error('❌ PYUSD UTILS ERROR:', error);
    throw error;
  }
}

// Function to generate the token URI for the NFT
export function generateTokenURI(uploadId: string): string {
  return `tusky-walrus://${uploadId}`;
}

// Function to format PYUSD amount (6 decimals like USDC)
export function formatPYUSDAmount(amount: number): string {
  return (amount * 1e6).toString();
}

// Function to parse PYUSD amount from wei
export function parsePYUSDAmount(weiAmount: string): number {
  return parseFloat(weiAmount) / 1e6;
}
