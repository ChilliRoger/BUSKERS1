'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getMusicNFTContract, getKadenaExplorerUrl, generateTokenURI } from '@/lib/kadena-utils';
import { uploadToTusky } from '@/lib/tusky-utils';

interface UploadState {
  isUploading: boolean;
  isSuccess: boolean;
  error: string | null;
  blobId: string | null;
  fileName: string | null;
  fileSize: number | null;
}

interface MintState {
  isMinting: boolean;
  isMintSuccess: boolean;
  mintError: string | null;
  txHash: string | null;
  tokenId: string | null;
}

export function ArtistUpload() {
  const { isConnected, address } = useAccount();
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isSuccess: false,
    error: null,
    blobId: null,
    fileName: null,
    fileSize: null,
  });

  const [mintState, setMintState] = useState<MintState>({
    isMinting: false,
    isMintSuccess: false,
    mintError: null,
    txHash: null,
    tokenId: null,
  });


  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Wagmi hooks for contract interaction
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle minting success
  useEffect(() => {
    if (isConfirmed && hash) {
      setMintState(prev => ({
        ...prev,
        isMinting: false,
        isMintSuccess: true,
        txHash: hash,
        mintError: null,
      }));
    }
  }, [isConfirmed, hash]);

  // Handle minting error
  useEffect(() => {
    if (writeError) {
      setMintState(prev => ({
        ...prev,
        isMinting: false,
        isMintSuccess: false,
        mintError: writeError.message || 'Minting failed',
      }));
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

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadState(prev => ({
        ...prev,
        error: 'Please select a file to upload',
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
      console.log('Uploading to Tusky...');
      console.log('File details:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      // Upload to Tusky (with built-in fallback to mock)
      const uploadResult = await uploadToTusky(selectedFile);

      console.log('Upload completed:', uploadResult);

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        isSuccess: true,
        blobId: uploadResult.uploadId,
        fileName: uploadResult.fileName,
        fileSize: uploadResult.fileSize,
        error: null,
      }));

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : 'Upload failed. Please try again.',
      }));
    }
  };

  const handleMint = async () => {
    if (!uploadState.blobId) {
      setMintState(prev => ({
        ...prev,
        mintError: 'No upload ID available for minting',
      }));
      return;
    }

    if (!isConnected) {
      setMintState(prev => ({
        ...prev,
        mintError: 'Please connect your wallet to mint NFT',
      }));
      return;
    }

    setMintState(prev => ({
      ...prev,
      isMinting: true,
      mintError: null,
      isMintSuccess: false,
    }));

    try {
      const contract = getMusicNFTContract();
      const tokenURI = generateTokenURI(uploadState.blobId);

      console.log('Minting NFT with tokenURI:', tokenURI);
      console.log('Contract address:', contract.address);

      writeContract({
        address: contract.address,
        abi: contract.abi,
        functionName: 'mint',
        args: [tokenURI],
      });

    } catch (error) {
      console.error('Mint error:', error);
      setMintState(prev => ({
        ...prev,
        isMinting: false,
        mintError: error instanceof Error ? error.message : 'Minting failed',
      }));
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
    });
    setMintState({
      isMinting: false,
      isMintSuccess: false,
      mintError: null,
      txHash: null,
      tokenId: null,
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Artist Upload</h2>
          <p className="text-gray-600">Upload your music files to Tusky and mint on Kadena</p>
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

        {/* Upload Button */}
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadState.isUploading}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              !selectedFile || uploadState.isUploading
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
                <p className="text-green-800 font-medium">File uploaded to Walrus storage</p>
                <p className="text-green-700 text-sm mt-1">
                  File: {uploadState.fileName} ({uploadState.fileSize && formatFileSize(uploadState.fileSize)})
                </p>
                <div className="mt-2">
                  <p className="text-green-700 text-sm font-medium">Tusky Upload ID:</p>
                  <p className="text-green-600 text-xs font-mono bg-green-100 px-2 py-1 rounded mt-1 break-all">
                    {uploadState.blobId}
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleMint}
                    disabled={!isConnected || mintState.isMinting || isPending || isConfirming}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      !isConnected || mintState.isMinting || isPending || isConfirming
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {mintState.isMinting || isPending || isConfirming ? (
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
