'use client';

import { useState } from 'react';

interface BlobVerifierProps {
  blobId: string;
}

export function BlobVerifier({ blobId }: BlobVerifierProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    exists: boolean;
    size?: number;
    type?: string;
    url?: string;
  } | null>(null);

  const verifyBlob = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Mock verification - in production, this would call Walrus API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate verification result
      setVerificationResult({
        exists: true,
        size: 1024000, // Mock size
        type: 'audio/mpeg',
        url: `https://explorer.testnet.walrus.site/blob/${blobId}`
      });
    } catch (error) {
      setVerificationResult({
        exists: false
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 mt-4">
      <h3 className="text-lg font-semibold mb-3">Blob Verification</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Blob ID
          </label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-gray-100 p-2 rounded text-sm font-mono break-all">
              {blobId}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(blobId)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Copy
            </button>
          </div>
        </div>

        <button
          onClick={verifyBlob}
          disabled={isVerifying}
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isVerifying ? 'Verifying...' : 'Verify Blob'}
        </button>

        {verificationResult && (
          <div className={`p-3 rounded ${
            verificationResult.exists 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                verificationResult.exists ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                verificationResult.exists ? 'text-green-800' : 'text-red-800'
              }`}>
                {verificationResult.exists ? 'Blob Verified' : 'Blob Not Found'}
              </span>
            </div>
            
            {verificationResult.exists && (
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Size:</strong> {verificationResult.size ? `${(verificationResult.size / 1024).toFixed(1)} KB` : 'Unknown'}</p>
                <p><strong>Type:</strong> {verificationResult.type || 'Unknown'}</p>
                {verificationResult.url && (
                  <p>
                    <strong>Explorer:</strong>{' '}
                    <a 
                      href={verificationResult.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View in Explorer
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <h4 className="font-medium text-blue-800 mb-2">Verification Links</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Walrus Explorer:</strong>{' '}
              <a 
                href={`https://explorer.testnet.walrus.site/blob/${blobId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                https://explorer.testnet.walrus.site/blob/{blobId}
              </a>
            </div>
            <div>
              <strong>Walrus Dashboard:</strong>{' '}
              <a 
                href="https://testnet.walrus.site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                https://testnet.walrus.site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
