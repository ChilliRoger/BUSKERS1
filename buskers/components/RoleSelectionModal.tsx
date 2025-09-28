'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from './RoleProvider';
import { FaUser, FaMusic } from 'react-icons/fa';

export function RoleSelectionModal() {
  const { userRole, setUserRole, isRoleLoading } = useRole();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isRoleLoading && !userRole) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [userRole, isRoleLoading]);

    const handleRoleSelect = (role: 'artist' | 'fan') => {
    setUserRole(role);
    setShowModal(false);
  };

  if (isRoleLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white/20"
            role="dialog"
            aria-labelledby="role-modal-title"
            aria-describedby="role-modal-description"
          >
            <div className="text-center">
              <h2
                id="role-modal-title"
                className="text-2xl font-bold text-white mb-4 font-poppins"
              >
                Welcome to Buskers!
              </h2>
                  <p
                    id="role-modal-description"
                    className="text-gray-300 mb-8 font-inter"
                  >
                    Are you an Artist or Fan?
                  </p>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect('artist')}
                  className="w-full gradient-indigo-mint hover:scale-105 text-white p-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl glow-indigo"
                  aria-label="Select Artist role"
                >
                  <FaMusic className="w-6 h-6" />
                  <span className="text-lg font-medium font-inter">Artist</span>
                </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelect('fan')}
                      className="w-full gradient-mint-coral hover:scale-105 text-white p-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-mint-500 focus:ring-offset-2 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl glow-mint"
                      aria-label="Select Fan role"
                    >
                      <FaUser className="w-6 h-6" />
                      <span className="text-lg font-medium font-inter">Fan</span>
                    </motion.button>
              </div>

              <div className="mt-6 text-sm text-gray-400 font-inter">
                <p>You can change this later using the switch button in the navbar.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}