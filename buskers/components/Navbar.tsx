'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { WalletConnect } from './WalletConnect';
import { useRole } from './RoleProvider';
import { MdEvent } from 'react-icons/md';
import { FaImage, FaUser, FaExchangeAlt } from 'react-icons/fa';

export function Navbar() {
  const pathname = usePathname();
  const { userRole, setUserRole } = useRole();

      const navItems = [
        { href: '/events', label: 'Events', icon: MdEvent, showFor: ['artist', 'fan'] },
        { href: '/posts', label: 'Posts', icon: FaImage, showFor: ['artist', 'fan'] },
        { href: '/profile', label: 'Profile', icon: FaUser, showFor: ['artist', 'fan'] },
      ];

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item => 
    !userRole || item.showFor.includes(userRole)
  );

      const handleRoleSwitch = () => {
        const newRole = userRole === 'artist' ? 'fan' : 'artist';
        setUserRole(newRole);
      };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center"
          >
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-indigo-400 transition-all duration-300 font-poppins tracking-tight"
            >
              Buskers
            </Link>
            {userRole && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="ml-3 px-3 py-1 text-xs font-medium bg-gray-800 rounded-full border border-gray-700 text-indigo-300"
                  >
                    {userRole === 'artist' ? 'Artist' : 'Fan'}
                  </motion.span>
            )}
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {visibleNavItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 text-xl ${
                      isActive
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:border hover:border-gray-700'
                    }`}
                    aria-label={`Navigate to ${item.label}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium font-inter">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Right side - Role switch and wallet */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center space-x-3"
          >
            {/* Role Switch Button */}
            {userRole && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRoleSwitch}
                className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all duration-300"
                    aria-label={`Switch to ${userRole === 'artist' ? 'Fan' : 'Artist'} role`}
                    title={`Switch to ${userRole === 'artist' ? 'Fan' : 'Artist'} role`}
              >
                <FaExchangeAlt className="w-4 h-4 text-mint-400" />
              </motion.button>
            )}

            <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center">
              <WalletConnect />
            </div>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
                  className="text-gray-300 hover:text-white focus:outline-none focus:text-white p-2 bg-gray-800 rounded-xl border border-gray-700"
              aria-label="Open main menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-800 bg-black"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'bg-gray-800 text-white border border-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:border hover:border-gray-700'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-inter">{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Role Switch */}
            {userRole && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRoleSwitch}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 hover:border hover:border-gray-700 transition-all duration-300 w-full"
              >
                <FaExchangeAlt className="w-5 h-5" />
                  <span className="font-inter">Switch to {userRole === 'artist' ? 'Fan' : 'Artist'}</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
}