'use client';

import { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { FaImage, FaHeart, FaUpload, FaComment, FaShare } from 'react-icons/fa';
import { useRole } from '@/components/RoleProvider';
import toast from 'react-hot-toast';

interface Post {
  id: string;
  image: string;
  caption: string;
  author: string;
  likes: number;
  comments: number;
  timestamp: string;
  liked: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    caption: 'Late night session in the studio. New track coming soon! 🎵',
    author: 'Artist A',
    likes: 120,
    comments: 15,
    timestamp: '2 hours ago',
    liked: false,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop',
    caption: 'Throwback to an amazing live show! What a crowd! 🔥',
    author: 'Artist B',
    likes: 345,
    comments: 42,
    timestamp: '1 day ago',
    liked: true,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    caption: 'Finding inspiration in every chord. #musiclife',
    author: 'Artist C',
    likes: 88,
    comments: 9,
    timestamp: '3 days ago',
    liked: false,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop',
    caption: 'Deep dive into new sounds. What are you listening to?',
    author: 'Fan X',
    likes: 210,
    comments: 28,
    timestamp: '5 days ago',
    liked: false,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    caption: 'Electronic vibes tonight! The energy is unreal ⚡',
    author: 'Artist D',
    likes: 156,
    comments: 23,
    timestamp: '1 week ago',
    liked: true,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1571266028243-e68f8570b3e4?w=400&h=400&fit=crop',
    caption: 'Hip-hop culture runs deep. Respect the art 🎤',
    author: 'Artist E',
    likes: 298,
    comments: 35,
    timestamp: '1 week ago',
    liked: false,
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    caption: 'Just discovered this amazing artist! Check them out 🎶',
    author: 'Fan Y',
    likes: 89,
    comments: 12,
    timestamp: '2 weeks ago',
    liked: false,
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    caption: 'Acoustic session under the stars. Pure magic ✨',
    author: 'Artist F',
    likes: 234,
    comments: 31,
    timestamp: '2 weeks ago',
    liked: true,
  },
];

export default function PostsPage() {
  const { isConnected, address } = useAccount();
  const { userRole } = useRole();
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    caption: '',
    image: null as File | null
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, image: e.dataTransfer.files[0] }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet to post.');
      return;
    }
    if (!formData.image) {
      toast.error('Please select an image to post.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newPost: Post = {
        id: String(posts.length + 1),
        image: URL.createObjectURL(formData.image!),
        caption: formData.caption || 'No caption.',
        author: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Unknown User',
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        liked: false,
      };
      setPosts(prev => [newPost, ...prev]);
      setFormData({ caption: '', image: null });
      setIsLoading(false);
      toast.success('Post shared successfully!');
    }, 1500);
  };

  const handleLike = (id: string) => {
    setPosts(posts.map(post =>
      post.id === id
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-poppins">
            {userRole === 'artist' ? 'Share Your Vibe' : 'Music Community'}
          </h1>
          <p className="text-lg text-gray-300 font-inter">
            {userRole === 'artist' 
              ? 'Connect with the music community through photos and moments'
              : 'Discover and engage with music community posts'
            }
          </p>
        </motion.div>

        {/* Posting Form - Only visible for artists */}
        <div className={userRole === 'artist' ? '' : 'hidden'}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="glass-card p-8 shadow-2xl mb-8 border-2 border-purple-400/40 hover:border-purple-400/60 transition-all duration-300"
          >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center font-poppins">
            <FaImage className="mr-2 text-mint-400" />
            Share a Photo
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragOver
                  ? 'border-mint-400 bg-mint-500/10 glow-mint'
                  : 'border-white/20 hover:border-mint-400 hover:bg-mint-500/5'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-gray-300 mb-2 font-inter">
                Drag and drop an image here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-mint-400 hover:text-mint-300 font-medium transition-colors"
                >
                  browse files
                </button>
              </p>
              <p className="text-sm text-gray-400 font-inter">Supports .jpg and .png files</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Select image file"
              />
            </div>

            {formData.image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Preview"
                  className="max-w-xs mx-auto rounded-xl shadow-lg"
                />
                <p className="text-center text-sm text-gray-400 mt-2 font-inter">
                  Selected: {formData.image.name}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="caption" className="block text-lg font-medium text-gray-300 mb-2 font-inter">
                Caption
              </label>
              <textarea
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                className="w-full p-2 glass-input rounded-xl text-white placeholder-gray-400 h-24 resize-none"
                placeholder="What's happening with your music?"
                aria-label="Post caption"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center shadow-lg hover:shadow-xl"
              aria-label="Post Photo"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                'Post Photo'
              )}
            </motion.button>
          </form>
          </motion.div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white font-poppins">Feed</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 hover-glow border border-gray-600/30 hover:border-gray-500/50"
              >
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-auto object-cover"
                />

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-300 font-inter">{post.author}</span>
                    <span className="text-xs text-gray-400 font-inter">{post.timestamp}</span>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 font-inter">{post.caption}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1 transition-colors ${
                          post.liked ? 'text-coral-400' : 'text-gray-400 hover:text-coral-400'
                        }`}
                        aria-label={post.liked ? 'Unlike post' : 'Like post'}
                      >
                        <FaHeart className={post.liked ? 'fill-current' : ''} />
                        <span className="text-sm font-inter">{post.likes}</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition-colors"
                      >
                        <FaComment />
                        <span className="text-sm font-inter">{post.comments}</span>
                      </motion.button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-400 hover:text-mint-400 transition-colors"
                    >
                      <FaShare />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}