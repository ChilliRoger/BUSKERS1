'use client';

import { useAccount } from 'wagmi';
import { ArtistUpload } from '@/components/ArtistUpload';
import { FanPurchase } from '@/components/FanPurchase';
import { useState } from 'react';

export default function Home() {
  const { isConnected, address } = useAccount();
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const testEnvironment = () => {
    console.log('🔍 ENVIRONMENT DIAGNOSTICS:');
    console.log('================================');
    
    // Log all environment variables (mask private keys)
    const envVars = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_') || key.includes('KADENA') || key.includes('TUSKY'));
    
    envVars.forEach(key => {
      const value = process.env[key];
      if (key.toLowerCase().includes('key') || key.toLowerCase().includes('secret')) {
        console.log(`${key}:`, value ? `${value.slice(0, 8)}...` : 'undefined');
      } else {
        console.log(`${key}:`, value || 'undefined');
      }
    });
    
    console.log('================================');
    console.log('Wallet Status:');
    console.log('Connected:', isConnected);
    console.log('Address:', address || 'Not connected');
    console.log('================================');
    
    setShowDiagnostics(true);
    setTimeout(() => setShowDiagnostics(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Buskers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              The decentralized music platform where artists and fans connect
            </p>
            {isConnected && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-sm">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
            )}
            
            {/* Test Environment Button */}
            <div className="mt-4">
              <button
                onClick={testEnvironment}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showDiagnostics
                    ? 'bg-green-600 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {showDiagnostics ? '✅ Environment Tested' : '🔍 Test Env'}
              </button>
              <p className="text-xs text-purple-200 mt-2">
                Check console for diagnostics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Artist Upload Section */}
          <div id="artist">
            <ArtistUpload />
          </div>

          {/* Fan Purchase Section */}
          <div id="fan">
            <FanPurchase />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h3>
          <p className="text-gray-600 mb-8">
            Connect your wallet to start uploading music or purchasing tracks
          </p>
          {!isConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-yellow-800 text-sm">
                Please connect your wallet to access all features
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
