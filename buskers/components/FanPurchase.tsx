'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { getMusicNFTContract, getPYUSDContract, getKadenaExplorerUrl, formatPYUSDAmount, parsePYUSDAmount } from '@/lib/kadena-utils';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

interface PurchaseState {
  isApproving: boolean;
  isPurchasing: boolean;
  isSuccess: boolean;
  error: string | null;
  txHash: string | null;
  tokenId: string | null;
}

interface PreviewState {
  isPreviewing: boolean;
  audioUrl: string | null;
  error: string | null;
}

export function FanPurchase() {
  const { isConnected, address } = useAccount();
  
  // Form state
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  
  // Purchase state
  const [purchaseState, setPurchaseState] = useState<PurchaseState>({
    isApproving: false,
    isPurchasing: false,
    isSuccess: false,
    error: null,
    txHash: null,
    tokenId: null,
  });

  // Preview state
  const [previewState, setPreviewState] = useState<PreviewState>({
    isPreviewing: false,
    audioUrl: null,
    error: null,
  });

  // Faucet state
  const [faucetState, setFaucetState] = useState({
    isFauceting: false,
    faucetError: null as string | null,
  });

  // Wagmi hooks for contract interaction
  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read contract hooks
  const { data: tokenPrice, refetch: refetchTokenPrice } = useReadContract({
    address: getMusicNFTContract().address,
    abi: getMusicNFTContract().abi,
    functionName: 'getTokenPrice',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });

  const { data: isForSale, refetch: refetchIsForSale } = useReadContract({
    address: getMusicNFTContract().address,
    abi: getMusicNFTContract().abi,
    functionName: 'isForSale',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: getPYUSDContract().address,
    abi: getPYUSDContract().abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Handle purchase success
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('✅ Purchase transaction confirmed! Hash:', hash);
      setPurchaseState(prev => ({
        ...prev,
        isPurchasing: false,
        isSuccess: true,
        txHash: hash,
        error: null,
      }));
      
      // Show success toast with explorer link
      const explorerUrl = getKadenaExplorerUrl(hash);
      toast.success(
        <div>
          <p className="font-medium">NFT Purchased Successfully!</p>
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

  // Handle purchase error
  useEffect(() => {
    if (writeError) {
      console.error('❌ Purchase error:', writeError);
      const errorMessage = writeError.message || 'Purchase failed';
      setPurchaseState(prev => ({
        ...prev,
        isApproving: false,
        isPurchasing: false,
        error: errorMessage,
      }));
      
      toast.error(`Purchase failed: ${errorMessage}`, {
        duration: 5000,
        position: 'top-right',
      });
    }
  }, [writeError]);

  // Handle form submission
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

  const handlePurchase = async () => {
    if (!isConnected) {
      const errorMsg = 'Please connect your wallet to purchase NFT';
      setPurchaseState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    if (!address) {
      const errorMsg = 'Wallet address not available';
      setPurchaseState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    if (!tokenId) {
      const errorMsg = 'Please enter a token ID';
      setPurchaseState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    if (!price) {
      const errorMsg = 'Please enter a price';
      setPurchaseState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    const priceInWei = formatPYUSDAmount(parseFloat(price));
    const currentBalance = balance ? parsePYUSDAmount(balance.toString()) : 0;

    if (parseFloat(price) > currentBalance) {
      const errorMsg = `Insufficient PYUSD balance. You have ${currentBalance.toFixed(2)} PYUSD, need ${price} PYUSD`;
      setPurchaseState(prev => ({ ...prev, error: errorMsg }));
      toast.error(errorMsg);
      return;
    }

    console.log('🔍 PURCHASE DIAGNOSTICS - Starting purchase process...');
    console.log('Token ID:', tokenId);
    console.log('Price:', price, 'PYUSD');
    console.log('Price in Wei:', priceInWei);
    console.log('Buyer address:', address);
    console.log('Current balance:', currentBalance, 'PYUSD');

    try {
      // Step 1: Approve PYUSD
      setPurchaseState(prev => ({ ...prev, isApproving: true, error: null }));
      
      console.log('⛽ Approving PYUSD...');
      const musicNFTContract = getMusicNFTContract();
      
      writeContract({
        address: getPYUSDContract().address,
        abi: getPYUSDContract().abi,
        functionName: 'approve',
        args: [musicNFTContract.address, BigInt(priceInWei)],
      });

      toast.loading('Approving PYUSD...', {
        duration: 2000,
        position: 'top-right',
      });

      // Wait for approval confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 2: Buy NFT
      setPurchaseState(prev => ({ ...prev, isApproving: false, isPurchasing: true }));
      
      console.log('🛒 Buying NFT...');
      writeContract({
        address: musicNFTContract.address,
        abi: musicNFTContract.abi,
        functionName: 'buyNFT',
        args: [BigInt(tokenId), address, BigInt(priceInWei)],
      });

      toast.loading('Purchasing NFT...', {
        duration: 2000,
        position: 'top-right',
      });

    } catch (error) {
      console.error('Purchase error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
      setPurchaseState(prev => ({
        ...prev,
        isApproving: false,
        isPurchasing: false,
        error: errorMessage,
      }));
      toast.error(`Purchase failed: ${errorMessage}`);
    }
  };

  // Handle preview
  const handlePreview = async () => {
    if (!tokenId) {
      toast.error('Please enter a token ID first');
      return;
    }

    setPreviewState(prev => ({ ...prev, isPreviewing: true, error: null, audioUrl: null }));

    try {
      console.log('🔍 PREVIEW DIAGNOSTICS - Starting preview process...');
      console.log('Token ID:', tokenId);

      // Get token metadata to extract uploadId
      const response = await fetch(`/api/metadata/${tokenId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch token metadata');
      }

      const metadata = await response.json();
      console.log('Token metadata:', metadata);

      // Extract uploadId from metadata properties
      const uploadId = metadata.properties?.audio_file?.replace('tusky-walrus://', '');
      if (!uploadId) {
        throw new Error('No audio file found in token metadata');
      }

      console.log('Audio upload ID:', uploadId);

      // Call preview API
      const previewResponse = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uploadId }),
      });

      if (!previewResponse.ok) {
        const errorData = await previewResponse.json();
        throw new Error(errorData.error || 'Preview failed');
      }

      const previewData = await previewResponse.json();
      console.log('Preview data:', previewData);

      if (previewData.success && previewData.audioData) {
        // Convert base64 to audio URL
        const audioUrl = `data:audio/mpeg;base64,${previewData.audioData}`;
        setPreviewState(prev => ({
          ...prev,
          isPreviewing: false,
          audioUrl,
          error: null,
        }));
        toast.success('Audio preview loaded!');
      } else {
        throw new Error('No audio data received');
      }

    } catch (error) {
      console.error('Preview error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Preview failed';
      setPreviewState(prev => ({
        ...prev,
        isPreviewing: false,
        error: errorMessage,
      }));
      toast.error(`Preview failed: ${errorMessage}`);
    }
  };

  // Reset form
  const handleReset = () => {
    setTokenId('');
    setPrice('');
    setPurchaseState({
      isApproving: false,
      isPurchasing: false,
      isSuccess: false,
      error: null,
      txHash: null,
      tokenId: null,
    });
    setPreviewState({
      isPreviewing: false,
      audioUrl: null,
      error: null,
    });
  };

  // Format balance display
  const formatBalance = (balance: bigint | undefined) => {
    if (!balance) return '0.00';
    return parsePYUSDAmount(balance.toString()).toFixed(2);
  };

  // Format price display
  const formatPrice = (price: bigint | undefined) => {
    if (!price) return '0.00';
    return parsePYUSDAmount(price.toString()).toFixed(2);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fan Purchase</h2>
        <p className="text-gray-600">Buy Music NFTs with PYUSD</p>
      </div>

      <div className="space-y-6">
        {/* Wallet Balance */}
        {isConnected && balance !== undefined && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <div>
                  <p className="text-green-800 font-medium">TestPYUSD Balance</p>
                  <p className="text-green-700 text-sm">{formatBalance(balance)} tPYUSD</p>
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

        {/* Purchase Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700 mb-2">
              NFT Token ID
            </label>
            <input
              type="text"
              id="tokenId"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter token ID (e.g., 1, 2, 3...)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (PYUSD)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price in PYUSD"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Token Info */}
          {tokenId && tokenPrice !== undefined && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Token Information</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Token ID:</span> {tokenId}</p>
                <p><span className="font-medium">Current Price:</span> {formatPrice(tokenPrice)} PYUSD</p>
                <p><span className="font-medium">For Sale:</span> {isForSale ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePurchase}
            disabled={!isConnected || !tokenId || !price || purchaseState.isApproving || purchaseState.isPurchasing || isPending || isConfirming}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
              !isConnected || !tokenId || !price || purchaseState.isApproving || purchaseState.isPurchasing || isPending || isConfirming
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {purchaseState.isApproving ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Approving...
              </div>
            ) : purchaseState.isPurchasing || isPending || isConfirming ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isConfirming ? 'Confirming...' : 'Purchasing...'}
              </div>
            ) : (
              'Buy NFT'
            )}
          </button>

          <button
            onClick={handlePreview}
            disabled={!tokenId || previewState.isPreviewing}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              !tokenId || previewState.isPreviewing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {previewState.isPreviewing ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              'Preview File'
            )}
          </button>
        </div>

        {/* Error Message */}
        {purchaseState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{purchaseState.error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {purchaseState.isSuccess && purchaseState.txHash && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="flex-1">
                <p className="text-green-800 font-medium">NFT Purchased Successfully!</p>
                <p className="text-green-700 text-sm mt-1">
                  Transaction Hash: <a href={getKadenaExplorerUrl(purchaseState.txHash)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline break-all">{purchaseState.txHash}</a>
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Buy Another NFT
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audio Preview */}
        {previewState.audioUrl && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <div className="flex-1">
                <p className="text-purple-800 font-medium">Audio Preview</p>
                <audio controls className="w-full mt-2">
                  <source src={previewState.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        )}

        {/* Preview Error */}
        {previewState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">Preview Error: {previewState.error}</p>
            </div>
          </div>
        )}

        {/* Connection Status */}
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-800 font-medium">Please connect your wallet to purchase NFTs</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
