import { ethers } from 'ethers';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// MusicNFT Contract ABI (simplified for minting)
const MUSIC_NFT_ABI = [
  {
    "inputs": [
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
  }
] as const;

// Get contract instance
export function getMusicNFTContract() {
  const contractAddress = process.env.NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    throw new Error('MUSIC_NFT_CONTRACT_ADDRESS not configured');
  }

  return {
    address: contractAddress as `0x${string}`,
    abi: MUSIC_NFT_ABI,
  };
}

// Get Kadena explorer URL
export function getKadenaExplorerUrl(txHash: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL || 'https://explorer.chainweb.com/testnet/tx';
  return `${baseUrl}/${txHash}`;
}

// Generate token URI for Walrus upload
export function generateTokenURI(uploadId: string): string {
  return `tusky-walrus://${uploadId}`;
}
