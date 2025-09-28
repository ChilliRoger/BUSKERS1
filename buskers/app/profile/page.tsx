'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { FaUser, FaMusic, FaPlay, FaPause, FaPlus } from 'react-icons/fa';
import { useRole } from '@/components/RoleProvider';
import toast from 'react-hot-toast';

interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  audio: string;
  price?: string;
  mintedAt: string;
}

const mockNFTs: NFT[] = [
  {
    id: 'nft-1',
    name: 'Sunset Serenade',
    description: 'A calming instrumental piece inspired by the evening sky.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audio: '/audio/sample-1.wav',
    price: '10.00',
    mintedAt: new Date(2024, 0, 15).toISOString(),
  },
  {
    id: 'nft-2',
    name: 'Urban Rhythms',
    description: 'Energetic beats reflecting the pulse of city life.',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    audio: '/audio/sample-2.wav',
    price: '15.00',
    mintedAt: new Date(2024, 1, 20).toISOString(),
  },
  {
    id: 'nft-3',
    name: 'Forest Echoes',
    description: 'Ambient sounds blended with natural forest recordings.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audio: '/audio/sample-3.wav',
    price: '8.50',
    mintedAt: new Date(2024, 2, 10).toISOString(),
  },
  {
    id: 'nft-4',
    name: 'Cosmic Journey',
    description: 'Synthesized melodies taking you on an interstellar trip.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    audio: '/audio/sample-4.wav',
    price: '20.00',
    mintedAt: new Date(2024, 3, 5).toISOString(),
  },
  {
    id: 'nft-5',
    name: 'Jazz Reflections',
    description: 'Smooth jazz melodies that capture the essence of late night vibes.',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop',
    audio: '/audio/sample-5.wav',
    price: '12.50',
    mintedAt: new Date(2024, 4, 8).toISOString(),
  },
  {
    id: 'nft-6',
    name: 'Hip-Hop Chronicles',
    description: 'Raw beats and powerful lyrics telling stories of the streets.',
    image: 'https://images.unsplash.com/photo-1571266028243-e68f8570b3e4?w=400&h=400&fit=crop',
    audio: '/audio/sample-6.wav',
    price: '18.00',
    mintedAt: new Date(2024, 5, 12).toISOString(),
  },
];

export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const { userRole } = useRole();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-4 font-poppins">
            Please select your role first
          </h1>
          <p className="text-gray-300 font-inter">
            You need to choose between Artist or Fan to access this page.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching NFTs
    setTimeout(() => {
      setNfts(mockNFTs);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handlePlayAudio = (nft: NFT) => {
    if (playingAudio === nft.id) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(nft.id);
    }
    toast.success(`Playing: ${nft.name}`);
  };

  const handleMintFirstAlbum = () => {
    toast.success('Redirecting to minting page...');
  };

  const handleAddNewNFT = () => {
    toast.success('Adding new NFT...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-card p-8 shadow-2xl mb-8 border-2 border-indigo-400/40 hover:border-indigo-400/60 transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            {/* Profile Picture */}
            <div className="w-24 h-24 gradient-indigo-mint rounded-full flex items-center justify-center shadow-lg">
              <FaUser className="w-12 h-12 text-white" />
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-poppins">
              {userRole === 'artist' ? 'Music Artist' : 'Music Collector'}
            </h1>
              <p className="text-xl text-gray-300 font-mono mb-2">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400 font-inter">
                <span>{nfts.length} album{nfts.length !== 1 ? 's' : ''} {userRole === 'artist' ? 'minted' : 'collected'}</span>
                <span>Member since 2024</span>
                <span>Kadena EVM Testnet</span>
              </div>
            </div>

            {/* Action Buttons - Only for artists */}
            {userRole === 'artist' && (
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddNewNFT}
                  className="gradient-indigo-mint hover:scale-105 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center shadow-lg hover:shadow-xl glow-indigo"
                  aria-label="Add new NFT"
                >
                  <FaPlus className="mr-2" />
                  Add NFT
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* NFT Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="glass-card p-8 shadow-2xl border-2 border-mint-400/40 hover:border-mint-400/60 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center font-poppins">
              <FaMusic className="mr-2 text-indigo-400" />
              {userRole === 'artist' ? 'Your Albums' : 'Your Collection'}
            </h2>
            {userRole === 'artist' && (
              <button
                onClick={handleAddNewNFT}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors font-inter"
              >
                + Add New
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
              <p className="text-gray-400 font-inter">Loading your albums...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-12">
              <FaMusic className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg mb-2 font-inter">
                {userRole === 'artist' ? 'No albums yet' : 'No albums collected yet'}
              </p>
              <p className="text-gray-500 text-sm mb-6 font-inter">
                {userRole === 'artist' 
                  ? 'Start creating music NFTs to see them here!'
                  : 'Start collecting music NFTs to see them here!'
                }
              </p>
              {userRole === 'artist' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMintFirstAlbum}
                  className="gradient-indigo-mint hover:scale-105 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-lg hover:shadow-xl glow-indigo"
                >
                  Mint your first album
                </motion.button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nfts.map((nft, index) => (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6 shadow-md hover:scale-105 transition-all duration-300 hover-glow border border-gray-600/30 hover:border-gray-500/50"
                >
                  {/* Album Image */}
                  <div className="mb-4">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>

                  {/* NFT Details */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-lg font-semibold text-white font-poppins">{nft.name}</h3>
                    <p className="text-sm text-gray-300 font-inter">{nft.description}</p>

                    {nft.price && (
                      <p className="text-sm font-medium text-mint-400 font-inter">
                        {nft.price} PYUSD
                      </p>
                    )}

                    <p className="text-xs text-gray-400 font-inter">
                      Minted: {new Date(nft.mintedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Audio Player */}
                  <div className="mb-4">
                    <audio
                      controls
                      className="w-full rounded-xl"
                      aria-label={`Play ${nft.name}`}
                    >
                      <source src={nft.audio} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePlayAudio(nft)}
                        className="w-full gradient-indigo-mint hover:scale-105 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center shadow-md hover:shadow-lg glow-indigo"
                        aria-label={`${playingAudio === nft.id ? 'Pause' : 'Play'} ${nft.name}`}
                      >
                        {playingAudio === nft.id ? (
                          <>
                            <FaPause className="mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <FaPlay className="mr-2" />
                            Play Album
                          </>
                        )}
                      </motion.button>
                    </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}