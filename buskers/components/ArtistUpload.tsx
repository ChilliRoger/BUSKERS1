'use client';

import { useState, useRef } from 'react';
import { createWalrusClient } from '@/lib/walrus-client';
import { BlobVerifier } from './BlobVerifier';

interface UploadState {
  isUploading: boolean;
  isSuccess: boolean;
  error: string | null;
  blobId: string | null;
  fileName: string | null;
  fileSize: number | null;
}

export function ArtistUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    isSuccess: false,
    error: null,
    blobId: null,
    fileName: null,
    fileSize: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    const walrusEndpoint = process.env.NEXT_PUBLIC_WALRUS_TESTNET_AGGREGATOR || 'https://aggregator.testnet.walrus.site:4443';
    
    console.log('Using Walrus endpoint:', walrusEndpoint);

    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      error: null,
      isSuccess: false,
    }));

    try {
      // Initialize Walrus client
      const walrusClient = createWalrusClient(walrusEndpoint);

      // Convert file to blob
      const fileBlob = new Blob([selectedFile], { type: 'audio/mpeg' });

      // Upload to Walrus testnet
      const uploadResult = await walrusClient.uploadBlob(fileBlob);

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        isSuccess: true,
        blobId: uploadResult.id,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
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

  const handleReset = () => {
    setUploadState({
      isUploading: false,
      isSuccess: false,
      error: null,
      blobId: null,
      fileName: null,
      fileSize: null,
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
        <p className="text-gray-600">Upload your music files to Walrus testnet</p>
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
                <p className="text-green-800 font-medium">Upload Successful!</p>
                <p className="text-green-700 text-sm mt-1">
                  File: {uploadState.fileName} ({uploadState.fileSize && formatFileSize(uploadState.fileSize)})
                </p>
                <div className="mt-2">
                  <p className="text-green-700 text-sm font-medium">Walrus Blob ID:</p>
                  <p className="text-green-600 text-xs font-mono bg-green-100 px-2 py-1 rounded mt-1 break-all">
                    {uploadState.blobId}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blob Verifier - Show when upload is successful */}
        {uploadState.isSuccess && uploadState.blobId && (
          <BlobVerifier blobId={uploadState.blobId} />
        )}

        {/* Walrus Configuration Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-800 font-medium">Walrus Testnet Integration</p>
              <p className="text-blue-700 text-sm mt-1">
                Connected to Walrus testnet aggregator. Files will be uploaded as blobs to the decentralized storage network.
              </p>
              <p className="text-blue-600 text-xs mt-1 font-mono">
                Endpoint: {process.env.NEXT_PUBLIC_WALRUS_TESTNET_AGGREGATOR || 'https://aggregator.testnet.walrus.site:4443'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
