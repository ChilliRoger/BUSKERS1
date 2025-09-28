'use client';

import { motion } from 'framer-motion';

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="glass-card border-t border-white/10 py-8 text-center text-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-inter text-gray-300">&copy; {new Date().getFullYear()} Buskers. All rights reserved.</p>
        <p className="mt-2 font-medium text-indigo-400">Powered by Kadena, Walrus/Tusky, PYUSD</p>
      </div>
    </motion.footer>
  );
}