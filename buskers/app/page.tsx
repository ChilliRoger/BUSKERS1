'use client';

import { useAccount } from 'wagmi';
import { ArtistUpload } from '@/components/ArtistUpload';
import { FanPurchase } from '@/components/FanPurchase';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MdEvent } from 'react-icons/md';
import { FaImage, FaUser } from 'react-icons/fa';
import { useRole } from '@/components/RoleProvider';

export default function Home() {
  const { isConnected, address } = useAccount();
  const { userRole } = useRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-mint-500/20 to-coral-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-poppins drop-shadow-2xl">
              Welcome to{' '}
              <span className="text-white drop-shadow-lg">
                Buskers
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 font-inter max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              "Where every beat tells a story, every melody creates memories, and every artist finds their voice in the decentralized symphony of music."
            </p>
            {isConnected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card p-4 inline-block border border-white/20"
              >
                <p className="text-sm text-indigo-300 font-inter">Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </motion.div>
            )}

                {/* Floating Sponsor Tiles */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="mt-12 relative"
                >
                  <div className="flex justify-center items-center space-x-8 flex-wrap gap-6">
                    {/* Kadena Tile */}
                    <motion.div
                      initial={{ opacity: 0, y: 30, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                      whileHover={{ 
                        y: -10, 
                        rotateY: 5, 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      className="relative group"
                    >
                      <div className="glass-card p-8 text-center hover-glow bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-2 border-indigo-400/50 backdrop-blur-xl shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-xl"></div>
                        <div className="relative z-10">
                          <div className="text-3xl font-bold text-indigo-300 mb-3 font-poppins drop-shadow-lg">Kadena</div>
                          <div className="text-lg text-gray-200 font-inter mb-2 font-medium">Blockchain Infrastructure</div>
                          <div className="text-sm text-indigo-200 font-inter opacity-90">Secure & Scalable</div>
                        </div>
                        <div className="absolute top-2 right-2 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
                      </div>
                    </motion.div>

                    {/* PayPal Tile */}
                    <motion.div
                      initial={{ opacity: 0, y: 30, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                      whileHover={{ 
                        y: -10, 
                        rotateY: 5, 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      className="relative group"
                    >
                      <div className="glass-card p-8 text-center hover-glow-mint bg-gradient-to-br from-mint-900/20 to-emerald-900/20 border-2 border-mint-400/50 backdrop-blur-xl shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-mint-500/10 to-transparent rounded-xl"></div>
                        <div className="relative z-10">
                          <div className="text-3xl font-bold text-mint-300 mb-3 font-poppins drop-shadow-lg">PayPal</div>
                          <div className="text-lg text-gray-200 font-inter mb-2 font-medium">PYUSD Payments</div>
                          <div className="text-sm text-mint-200 font-inter opacity-90">Stable & Reliable</div>
                        </div>
                        <div className="absolute top-2 right-2 w-3 h-3 bg-mint-400 rounded-full animate-pulse"></div>
                      </div>
                    </motion.div>

                    {/* Walrus Tile */}
                    <motion.div
                      initial={{ opacity: 0, y: 30, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                      whileHover={{ 
                        y: -10, 
                        rotateY: 5, 
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      className="relative group"
                    >
                      <div className="glass-card p-8 text-center hover-glow-coral bg-gradient-to-br from-coral-900/20 to-orange-900/20 border-2 border-coral-400/50 backdrop-blur-xl shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-coral-500/10 to-transparent rounded-xl"></div>
                        <div className="relative z-10">
                          <div className="text-3xl font-bold text-coral-300 mb-3 font-poppins drop-shadow-lg">Walrus</div>
                          <div className="text-lg text-gray-200 font-inter mb-2 font-medium">Decentralized Storage</div>
                          <div className="text-sm text-coral-200 font-inter opacity-90">Immutable & Fast</div>
                        </div>
                        <div className="absolute top-2 right-2 w-3 h-3 bg-coral-400 rounded-full animate-pulse"></div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {userRole && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-full max-w-2xl">
              {/* Artist Upload Section - Only for artists */}
              {userRole === 'artist' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  id="artist"
                >
                  <ArtistUpload />
                </motion.div>
              )}

                {/* Fan Purchase Section - Only for fans */}
                {userRole === 'fan' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  id="fan"
                >
                  <FanPurchase />
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center font-poppins">
            Explore More Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
                  <Link
                    href="/events"
                    className="glass-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group block hover-glow border-2 border-indigo-400/30 hover:border-indigo-400/60"
                  >
                <MdEvent className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold text-white mb-2 font-poppins">Events</h4>
                <p className="text-gray-300 font-inter">Create and book music events</p>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
                  <Link
                    href="/posts"
                    className="glass-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group block hover-glow-mint border-2 border-mint-400/30 hover:border-mint-400/60"
                  >
                <FaImage className="w-12 h-12 text-mint-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold text-white mb-2 font-poppins">Posts</h4>
                <p className="text-gray-300 font-inter">Share your music moments</p>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
                  <Link
                    href="/profile"
                    className="glass-card p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group block hover-glow-coral border-2 border-coral-400/30 hover:border-coral-400/60"
                  >
                <FaUser className="w-12 h-12 text-coral-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-semibold text-white mb-2 font-poppins">Profile</h4>
                <p className="text-gray-300 font-inter">View your music collection</p>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4 font-poppins">
            Ready to get started?
          </h3>
          <p className="text-gray-300 mb-8 font-inter">
            Connect your wallet to start uploading music or purchasing tracks
          </p>
          {!isConnected && (
            <div className="glass-card border border-white/20 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-coral-300 text-sm font-inter">
                Please connect your wallet to access all features
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}