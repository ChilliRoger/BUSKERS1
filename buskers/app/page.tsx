'use client';

import { useAccount } from 'wagmi';
import { ArtistUpload } from '@/components/ArtistUpload';

export default function Home() {
  const { isConnected, address } = useAccount();

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
          <div id="fan" className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fan Purchase</h2>
              <p className="text-gray-600">Discover and support your favorite artists</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Featured Tracks</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">Amazing Song</p>
                        <p className="text-xs text-gray-500">by Artist Name</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      Buy
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"></div>
                      <div>
                        <p className="font-medium text-sm">Cool Beat</p>
                        <p className="text-xs text-gray-500">by Another Artist</p>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Music
                </button>
                <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                  My Library
                </button>
              </div>
            </div>
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
