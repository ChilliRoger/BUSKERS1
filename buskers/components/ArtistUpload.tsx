'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useReadContract } from 'wagmi';
import { getMusicNFTContract, getPYUSDContract, getKadenaExplorerUrl, generateTokenURI, formatPYUSDAmount, parsePYUSDAmount } from '@/lib/kadena-utils';
import { ethers } from 'ethers';
import { createSimpleMetadataURI } from '@/lib/nft-metadata';
import toast from 'react-hot-toast';

interface UploadState {
  isUploading: boolean;
  isSuccess: boolean;
  error: string | null;
  blobId: string | null;
  fileName: string | null;
  fileSize: number | null;
  albumCoverBlobId: string | null;
  albumCoverFileName: string | null;
  albumCoverFileSize: number | null;
}

interface MintState {
  isMinting: boolean;
  isMintSuccess: boolean;
  mintError: string | null;
  txHash: string | null;
  tokenId: string | null;
}

export function ArtistUpload() {
  const { isConnected, address, chainId } = useAccount();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isSuccess: false,
    error: null,
    blobId: null,
    fileName: null,
    fileSize: null,
    albumCoverBlobId: null,
    albumCoverFileName: null,
    albumCoverFileSize: null,
  });

  const [mintState, setMintState] = useState<MintState>({
    isMinting: false,
    isMintSuccess: false,
    mintError: null,
    txHash: null,
    tokenId: null,
  });


  const fileInputRef = useRef<HTMLInputElement>(null);
  const albumCoverInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAlbumCover, setSelectedAlbumCover] = useState<File | null>(null);

  // Wagmi hooks for contract interaction
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read PYUSD balance
  const { data: pyusdBalance, refetch: refetchPyusdBalance } = useReadContract({
    address: getPYUSDContract().address,
    abi: getPYUSDContract().abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Faucet state
  const [faucetState, setFaucetState] = useState({
    isFauceting: false,
    faucetError: null as string | null,
  });

  // Handle minting success
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('✅ Transaction confirmed! Hash:', hash);
      setMintState(prev => ({
        ...prev,
        isMinting: false,
        isMintSuccess: true,
        txHash: hash,
        mintError: null,
      }));
      
      // Show success toast with explorer link
      const explorerUrl = getKadenaExplorerUrl(hash);
      toast.success(
        <div>
          <p className="font-medium">NFT Minted Successfully!</p>
          <a 
            href={explorerUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            View on Kadena Explorer
          </a>
        </div>,
        {
          duration: 8000,
          position: 'top-right',
        }
      );
    }
  }, [isConfirmed, hash]);

  // Handle minting error
  useEffect(() => {
    if (writeError) {
      console.error('❌ Write contract error:', writeError);
      const errorMessage = writeError.message || 'Minting failed';
      setMintState(prev => ({
        ...prev,
        isMinting: false,
        isMintSuccess: false,
        mintError: errorMessage,
      }));
      
      toast.error(`Minting failed: ${errorMessage}`, {
        duration: 5000,
        position: 'top-right',
      });
    }
  }, [writeError]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!file.type.includes('audio/mpeg') && !file.name.toLowerCase().endsWith('.mp3')) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select a valid MP3 file',
        isSuccess: false,
      }));
      setSelectedFile(null);
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setUploadState(prev => ({
        ...prev,
        error: 'File size must be less than 50MB',
        isSuccess: false,
      }));
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadState(prev => ({
      ...prev,
      error: null,
      isSuccess: false,
    }));
  };

  const handleAlbumCoverSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      setSelectedAlbumCover(null);
      return;
    }

    // Validate file type (images only)
    if (!file.type.startsWith('image/')) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select an image file for album cover',
        isSuccess: false,
      }));
      setSelectedAlbumCover(null);
      return;
    }

    // Validate file size (max 10MB for images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadState(prev => ({
        ...prev,
        error: 'Album cover image size must be less than 10MB',
        isSuccess: false,
      }));
      setSelectedAlbumCover(null);
      return;
    }

    setSelectedAlbumCover(file);
    setUploadState(prev => ({
      ...prev,
      error: null,
      isSuccess: false,
    }));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select an MP3 file to upload',
      }));
      return;
    }

    if (!selectedAlbumCover) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select an album cover image',
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      error: null,
      isSuccess: false,
    }));

    try {
      console.log('Uploading files to Tusky via API...');
      console.log('MP3 file details:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
      console.log('Album cover details:', {
        name: selectedAlbumCover.name,
        size: selectedAlbumCover.size,
        type: selectedAlbumCover.type,
      });

      // Create FormData for API request
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('albumCover', selectedAlbumCover);

      // Make API request to /api/upload
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      if (!result.success) {
        throw new Error('Upload was not successful');
      }

      console.log('Upload completed via API:', result);

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        isSuccess: true,
        blobId: result.uploadId, // Store uploadId for minting
        fileName: result.fileName,
        fileSize: result.fileSize,
        albumCoverBlobId: result.albumCoverUploadId,
        albumCoverFileName: result.albumCoverFileName,
        albumCoverFileSize: result.albumCoverFileSize,
        error: null,
      }));

      // Show success toast
      toast.success('Files uploaded to Walrus storage via Tusky', {
        duration: 4000,
        position: 'top-right',
      });

      // Reset file inputs
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (albumCoverInputRef.current) {
        albumCoverInputRef.current.value = '';
      }
      setSelectedFile(null);
      setSelectedAlbumCover(null);

    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        isSuccess: false,
        error: errorMessage,
      }));

      // Show error toast
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right',
      });
    }
  };

  const handleFaucet = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setFaucetState(prev => ({
      ...prev,
      isFauceting: true,
      faucetError: null,
    }));

    try {
      console.log('🚰 Getting TestPYUSD from faucet...');
      
      const result = writeContract({
        address: getPYUSDContract().address,
        abi: getPYUSDContract().abi,
        functionName: 'faucet',
        args: [ethers.parseUnits("1000", 6)], // 1000 tPYUSD
      });

      console.log('Faucet transaction result:', result);

      toast.loading('Getting 1000 tPYUSD from faucet...', {
        duration: 2000,
        position: 'top-right',
      });

    } catch (error) {
      console.error('Faucet error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Faucet failed';
      setFaucetState(prev => ({
        ...prev,
        isFauceting: false,
        faucetError: errorMessage,
      }));
      toast.error(`Faucet failed: ${errorMessage}`);
    }
  };

  const handleMint = async () => {
    console.log('🔍 MINT DIAGNOSTICS - Starting mint process...');
    
    // Pre-mint validation with alerts
    if (!isConnected) {
      const errorMsg = 'Wallet not connected';
      alert(errorMsg);
      console.error('❌ MINT FAILED:', errorMsg);
      setMintState(prev => ({
        ...prev,
        mintError: errorMsg,
      }));
      toast.error(errorMsg);
      return;
    }

    if (!address) {
      const errorMsg = 'Wallet address not available';
      alert(errorMsg);
      console.error('❌ MINT FAILED:', errorMsg);
      setMintState(prev => ({
        ...prev,
        mintError: errorMsg,
      }));
      toast.error(errorMsg);
      return;
    }

    if (!uploadState.blobId) {
      const errorMsg = 'Upload first - No music file upload ID available';
      alert(errorMsg);
      console.error('❌ MINT FAILED:', errorMsg);
      setMintState(prev => ({
        ...prev,
        mintError: errorMsg,
      }));
      toast.error(errorMsg);
      return;
    }

    if (!uploadState.albumCoverBlobId) {
      const errorMsg = 'Upload first - No album cover upload ID available';
      alert(errorMsg);
      console.error('❌ MINT FAILED:', errorMsg);
      setMintState(prev => ({
        ...prev,
        mintError: errorMsg,
      }));
      toast.error(errorMsg);
      return;
    }

    console.log('✅ Pre-mint checks passed');
    console.log('Wallet connected:', isConnected);
    console.log('Wallet address:', address);
    console.log('Music upload ID:', uploadState.blobId);
    console.log('Album cover upload ID:', uploadState.albumCoverBlobId);

    // Check if we're on the right network and switch automatically
    const expectedChainId = Number(process.env.NEXT_PUBLIC_KADENA_CHAIN_ID) || 5920;
    if (chainId && chainId !== expectedChainId) {
      try {
        toast.loading('Switching to Kadena EVM Testnet...', {
          duration: 3000,
          position: 'top-right',
        });
        
        await switchChain({ chainId: expectedChainId });
        
        toast.success('Switched to Kadena EVM Testnet', {
          duration: 2000,
          position: 'top-right',
        });
        
        // Wait a moment for the network switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error('Failed to switch network:', error);
        const errorMsg = `Failed to switch to Kadena EVM Testnet. Please switch manually in MetaMask.`;
        setMintState(prev => ({
          ...prev,
          mintError: errorMsg,
        }));
        toast.error(errorMsg);
        return;
      }
    }

    setMintState(prev => ({
      ...prev,
      isMinting: true,
      mintError: null,
      isMintSuccess: false,
    }));

    try {
      const contract = getMusicNFTContract();
      const pyusdContract = getPYUSDContract();
      
      // Check PYUSD balance
      const currentBalance = pyusdBalance ? parsePYUSDAmount(pyusdBalance.toString()) : 0;
      const mintPrice = 10; // 10 PYUSD mint price
      
      if (currentBalance < mintPrice) {
        const errorMsg = `Insufficient PYUSD balance. You have ${currentBalance.toFixed(2)} PYUSD, need ${mintPrice} PYUSD`;
        setMintState(prev => ({
          ...prev,
          isMinting: false,
          mintError: errorMsg,
        }));
        toast.error(errorMsg);
        return;
      }

      // Create simple metadata with album cover as NFT image and audio file linked
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const metadata = {
        name: `${uploadState.fileName?.replace('.mp3', '') || 'Music'} NFT`,
        description: `Music NFT containing "${uploadState.fileName || 'Unknown file'}" with album cover artwork. This NFT represents ownership of the music and its associated artwork.`,
        image: `${appUrl}/api/image/${uploadState.albumCoverBlobId}`, // Album cover as main NFT image
        external_url: `${appUrl}/music/${uploadState.blobId}`, // Link to audio file
        attributes: [
          {
            trait_type: "Type",
            value: "Music NFT"
          },
          {
            trait_type: "Audio File",
            value: uploadState.fileName || 'Unknown'
          },
          {
            trait_type: "Audio ID",
            value: uploadState.blobId || 'Unknown'
          },
          {
            trait_type: "Album Cover ID", 
            value: uploadState.albumCoverBlobId || 'Unknown'
          }
        ],
        properties: {
          audio_file: `tusky-walrus://${uploadState.blobId}`, // Direct link to audio
          album_cover: `tusky-walrus://${uploadState.albumCoverBlobId}`, // Direct link to cover
          created_at: new Date().toISOString()
        }
      };

      const metadataJson = JSON.stringify(metadata);
      const metadataURI = `data:application/json;base64,${Buffer.from(metadataJson).toString('base64')}`;

      console.log('🔍 MINTING WITH PYUSD PAYMENT');
      console.log('=== DYNAMIC MINTING DEBUG ===');
      console.log('Contract address:', contract.address);
      console.log('PYUSD address:', pyusdContract.address);
      console.log('Minting to address:', address);
      console.log('PYUSD balance:', currentBalance, 'PYUSD');
      console.log('Mint price:', mintPrice, 'PYUSD');
      console.log('Metadata URI length:', metadataURI.length);
      console.log('=============================');

      // Use writeContract with PYUSD payment
      const result = writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'mint',
        args: [address, metadataURI],
      });

      console.log('Write contract result:', result);

      toast.loading('Minting NFT with PYUSD payment...', {
        duration: 2000,
        position: 'top-right',
      });

    } catch (error) {
      console.error('Mint error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Minting failed';
      setMintState(prev => ({
        ...prev,
        isMinting: false,
        mintError: errorMessage,
      }));
      toast.error(`Minting failed: ${errorMessage}`);
    }
  };


  const handleReset = () => {
    setUploadState({
      isUploading: false,
      isSuccess: false,
      error: null,
      blobId: null,
      fileName: null,
      fileSize: null,
      albumCoverBlobId: null,
      albumCoverFileName: null,
      albumCoverFileSize: null,
    });
    setMintState({
      isMinting: false,
      isMintSuccess: false,
      mintError: null,
      txHash: null,
      tokenId: null,
    });
    setSelectedFile(null);
    setSelectedAlbumCover(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (albumCoverInputRef.current) {
      albumCoverInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12h6m-6 4h6" />
          </svg>
        </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Music NFT Creator</h2>
              <p className="text-gray-600">Upload your music + album cover to create a Music NFT</p>
              
              {/* PYUSD Balance Display */}
              {isConnected && pyusdBalance !== undefined && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <div>
                        <p className="text-blue-800 font-medium">TestPYUSD Balance</p>
                        <p className="text-blue-700 text-sm">{parsePYUSDAmount(pyusdBalance.toString()).toFixed(2)} tPYUSD</p>
                        <p className="text-blue-600 text-xs">Mint Price: 10 tPYUSD</p>
                      </div>
                    </div>
                    <button
                      onClick={handleFaucet}
                      disabled={faucetState.isFauceting || isPending || isConfirming}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        faucetState.isFauceting || isPending || isConfirming
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {faucetState.isFauceting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Getting...
                        </div>
                      ) : (
                        '🚰 Get 1000 tPYUSD'
                      )}
                    </button>
                  </div>
                  {faucetState.faucetError && (
                    <div className="mt-2 text-red-600 text-xs">
                      {faucetState.faucetError}
                    </div>
                  )}
                </div>
              )}
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,audio/mpeg"
            onChange={handleFileSelect}
            className="hidden"
            id="music-upload"
            disabled={uploadState.isUploading}
          />
          <label
            htmlFor="music-upload"
            className={`cursor-pointer ${uploadState.isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-500 mb-2">
              {selectedFile ? selectedFile.name : 'Click to select MP3 file'}
            </p>
            <p className="text-sm text-gray-400">
              Supports MP3 format, max 50MB
            </p>
          </label>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="text-red-500 hover:text-red-700"
                disabled={uploadState.isUploading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Album Cover Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <input
            ref={albumCoverInputRef}
            type="file"
            accept="image/*"
            onChange={handleAlbumCoverSelect}
            className="hidden"
            id="album-cover-upload"
            disabled={uploadState.isUploading}
          />
          <label
            htmlFor="album-cover-upload"
            className={`cursor-pointer ${uploadState.isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 mb-1">
              {selectedAlbumCover ? selectedAlbumCover.name : 'Click to select album cover'}
            </p>
            <p className="text-sm text-gray-400">
              Supports JPG, PNG, GIF, max 10MB
            </p>
          </label>
        </div>

        {/* Selected Album Cover Info */}
        {selectedAlbumCover && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedAlbumCover.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedAlbumCover.size)}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedAlbumCover(null);
                  if (albumCoverInputRef.current) {
                    albumCoverInputRef.current.value = '';
                  }
                }}
                className="text-red-500 hover:text-red-700"
                disabled={uploadState.isUploading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || !selectedAlbumCover || uploadState.isUploading}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              !selectedFile || !selectedAlbumCover || uploadState.isUploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {uploadState.isUploading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </div>
              ) : (
                'Upload to Walrus'
              )}
          </button>
          
          {uploadState.isSuccess && (
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Upload Another
            </button>
          )}
        </div>

        {/* Error Message */}
        {uploadState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm">{uploadState.error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadState.isSuccess && uploadState.blobId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
                  <div className="flex-1">
                    <p className="text-green-800 font-medium">Files uploaded! Ready to create Music NFT</p>
                    <p className="text-green-700 text-sm mt-1">Album cover will be the NFT image, audio file will be linked</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <p className="text-green-700 text-sm font-medium">MP3 File:</p>
                    <p className="text-green-600 text-sm">
                      {uploadState.fileName} ({uploadState.fileSize && formatFileSize(uploadState.fileSize)})
                    </p>
                    <p className="text-green-600 text-xs font-mono bg-green-100 px-2 py-1 rounded mt-1 break-all">
                      ID: {uploadState.blobId}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-700 text-sm font-medium">Album Cover:</p>
                    <p className="text-green-600 text-sm">
                      {uploadState.albumCoverFileName} ({uploadState.albumCoverFileSize && formatFileSize(uploadState.albumCoverFileSize)})
                    </p>
                    <p className="text-green-600 text-xs font-mono bg-green-100 px-2 py-1 rounded mt-1 break-all">
                      ID: {uploadState.albumCoverBlobId}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleMint}
                    disabled={!isConnected || isSwitching || mintState.isMinting || isPending || isConfirming}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !isConnected || isSwitching || mintState.isMinting || isPending || isConfirming
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSwitching ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Switching Network...
                      </div>
                    ) : mintState.isMinting || isPending || isConfirming ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isConfirming ? 'Confirming...' : 'Minting NFT...'}
                      </div>
                    ) : (
                      'Mint NFT on Kadena'
                    )}
                  </button>
                  {!isConnected && (
                    <p className="text-yellow-600 text-xs mt-2">
                      Connect your wallet to mint NFT
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Minting Error Message */}
        {mintState.mintError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 text-sm">{mintState.mintError}</p>
            </div>
          </div>
        )}

        {/* Minting Success Message */}
        {mintState.isMintSuccess && mintState.txHash && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="flex-1">
                <p className="text-green-800 font-medium">NFT Minted Successfully!</p>
                <p className="text-green-700 text-sm mt-1">
                  Your music NFT has been minted on Kadena blockchain.
                </p>
                <div className="mt-2">
                  <p className="text-green-700 text-sm font-medium">Transaction Hash:</p>
                  <p className="text-green-600 text-xs font-mono bg-green-100 px-2 py-1 rounded mt-1 break-all">
                    {mintState.txHash}
                  </p>
                  <div className="mt-3">
                    <a
                      href={getKadenaExplorerUrl(mintState.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on Kadena Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Tusky Configuration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-800 font-medium">Tusky SDK Integration</p>
              <p className="text-blue-700 text-sm mt-1">
                Complete file system on Walrus with API key authentication and file management.
              </p>
              <p className="text-blue-600 text-xs mt-1">
                SDK: @tusky-io/ts-sdk/web
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Auth: API Key (configured)
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Features: Vault creation, file upload, Kadena minting
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
