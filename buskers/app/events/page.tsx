'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { MdEvent, MdLocationOn, MdAccessTime, MdAttachMoney } from 'react-icons/md';
import { useRole } from '@/components/RoleProvider';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  price: string;
  artist: string;
  description: string;
  image: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Summer Music Festival',
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    location: 'Central Park, NYC',
    price: '50.00',
    artist: 'Various Artists',
    description: 'A day of amazing music and performances featuring multiple genres.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Jazz Night',
    date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    location: 'Blue Note, NYC',
    price: '25.00',
    artist: 'Jazz Collective',
    description: 'Intimate jazz performances in a cozy venue.',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Rock Concert',
    date: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
    location: 'Madison Square Garden',
    price: '75.00',
    artist: 'Rock Legends',
    description: 'High-energy rock performances with legendary bands.',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Electronic Music Night',
    date: new Date(new Date().setDate(new Date().getDate() + 28)).toISOString(),
    location: 'Brooklyn Warehouse',
    price: '40.00',
    artist: 'EDM Artists',
    description: 'Cutting-edge electronic music and DJ sets.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Acoustic Sessions',
    date: new Date(new Date().setDate(new Date().getDate() + 35)).toISOString(),
    location: 'Coffee House, Brooklyn',
    price: '20.00',
    artist: 'Acoustic Artists',
    description: 'Intimate acoustic performances in a cozy setting.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    name: 'Hip-Hop Showcase',
    date: new Date(new Date().setDate(new Date().getDate() + 42)).toISOString(),
    location: 'Underground Club, Manhattan',
    price: '35.00',
    artist: 'Hip-Hop Artists',
    description: 'Emerging hip-hop artists showcase their latest tracks.',
    image: 'https://images.unsplash.com/photo-1571266028243-e68f8570b3e4?w=400&h=300&fit=crop',
  },
];

export default function EventsPage() {
  const { isConnected, address } = useAccount();
  const { userRole } = useRole();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    price: '',
    description: '',
    location: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Please connect your wallet to register for performances.');
      return;
    }
    if (!formData.name || !formData.date || !formData.price || !formData.location) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newEvent: Event = {
        id: String(events.length + 1),
        name: formData.name,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
        price: parseFloat(formData.price).toFixed(2),
        artist: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Unknown Artist',
        description: formData.description || 'No description provided.',
        image: `https://source.unsplash.com/random/800x600?music-event-${Math.random()}`,
      };
      setEvents(prev => [newEvent, ...prev]);
      setFormData({ name: '', date: '', price: '', description: '', location: '' });
      setIsLoading(false);
      toast.success('Performance registration submitted successfully!');
    }, 1500);
  };

  const handleBookTicket = (event: Event) => {
    if (!isConnected) {
      toast.error('Please connect your wallet to proceed.');
      return;
    }
    
    if (userRole === 'artist') {
      toast.success(`Application submitted for ${event.name}! We'll review your performance request.`);
    } else {
      toast.success(`Ticket booked for ${event.name}!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-poppins">
            {userRole === 'artist' ? 'Register to Perform' : 'Book Event Tickets'}
          </h1>
          <p className="text-lg text-gray-300 font-inter">
            {userRole === 'artist' 
              ? 'Find events to perform at and showcase your talent'
              : 'Discover and book tickets for amazing music events'
            }
          </p>
        </motion.div>

        <div className={`grid grid-cols-1 ${userRole === 'artist' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8`}>
          {/* Artist Posting Section - Only visible for artists */}
          <div className={userRole === 'artist' ? '' : 'hidden'}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="glass-card p-8 shadow-2xl border-2 border-green-400/40 hover:border-green-400/60 transition-all duration-300"
            >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center font-poppins">
              <MdEvent className="mr-2 text-indigo-400" />
              Register to Perform
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="eventName" className="block text-lg font-medium text-gray-300 mb-2 font-inter">
                  Artist/Band Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 glass-input rounded-xl text-white placeholder-gray-400"
                  placeholder="Enter your artist or band name"
                  aria-label="Artist name"
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-lg font-medium text-gray-300 mb-2 font-inter">
                  Preferred Performance Date
                </label>
                <input
                  type="datetime-local"
                  id="eventDate"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 glass-input rounded-xl text-white"
                  aria-label="Preferred performance date"
                />
              </div>

              <div>
                <label htmlFor="eventLocation" className="block text-lg font-medium text-gray-300 mb-2 font-inter">
                  Preferred Location
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2 glass-input rounded-xl text-white placeholder-gray-400"
                  placeholder="Enter preferred venue location"
                  aria-label="Preferred location"
                />
              </div>

              <div>
                <label htmlFor="eventPrice" className="block text-lg font-medium text-gray-300 mb-2 font-inter">
                  Expected Fee (PYUSD)
                </label>
                <input
                  type="number"
                  id="eventPrice"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full p-2 glass-input rounded-xl text-white placeholder-gray-400"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  aria-label="Expected performance fee in PYUSD"
                />
              </div>

              <div>
                <label htmlFor="eventDescription" className="block text-lg font-medium text-gray-300 mb-2 font-inter">
                  Performance Description
                </label>
                <textarea
                  id="eventDescription"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 glass-input rounded-xl text-white placeholder-gray-400 h-24 resize-none"
                  placeholder="Describe your performance style and what you bring to the event..."
                  aria-label="Performance description"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center shadow-lg hover:shadow-xl"
                aria-label="Register to Perform"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  'Register to Perform'
                )}
              </motion.button>
            </form>
            </motion.div>
          </div>

          {/* Fan Booking Section - Visible for both roles */}
          <motion.div
            initial={{ opacity: 0, x: userRole === 'artist' ? 20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: userRole === 'artist' ? 0.4 : 0.2, ease: "easeOut" }}
            className="glass-card p-8 shadow-2xl border-2 border-blue-400/40 hover:border-blue-400/60 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-poppins">
              {userRole === 'artist' ? 'Available Events to Perform At' : 'Events to Book'}
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="glass-card p-6 hover:scale-105 transition-all duration-300 hover-glow border border-gray-600/30 hover:border-gray-500/50"
                >
                  <div className="flex space-x-4">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-white font-poppins">{event.name}</h3>
                        <span className="text-lg font-bold text-mint-400">{event.price} PYUSD</span>
                      </div>

                      <div className="text-sm text-gray-300 space-y-1 font-inter">
                        <div className="flex items-center">
                          <MdAccessTime className="w-4 h-4 mr-1 text-indigo-400" />
                          {format(new Date(event.date), 'PPP p')}
                        </div>
                        <div className="flex items-center">
                          <MdLocationOn className="w-4 h-4 mr-1 text-mint-400" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <MdAttachMoney className="w-4 h-4 mr-1 text-coral-400" />
                          Artist: {event.artist}
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 mt-2 font-inter">{event.description}</p>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleBookTicket(event)}
                        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                        aria-label={userRole === 'artist' ? 'Apply to Perform' : 'Book Ticket'}
                      >
                        {userRole === 'artist' ? 'Apply to Perform' : 'Book Ticket'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}