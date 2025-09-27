'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export function Navbar() {
  const { isConnected, address } = useAccount();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {process.env.NEXT_PUBLIC_APP_NAME || 'Buskers'}
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#artist"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Artist Upload
              </a>
              <a
                href="#fan"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Fan Purchase
              </a>
            </div>
          </div>

          {/* Wallet Connect Button */}
          <div className="flex items-center">
            <ConnectButton
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              aria-label="Open main menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#artist"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              Artist Upload
            </a>
            <a
              href="#fan"
              className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
              Fan Purchase
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
