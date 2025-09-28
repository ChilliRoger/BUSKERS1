'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function WalletConnect() {
  const { isConnected, address, chainId } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (isConnected && address) {
    const isCorrectNetwork = chainId === 5920;
    
    return (
      <div className="flex items-center space-x-3 text-white">
        <div className="text-sm">
          <p className={`${isCorrectNetwork ? 'text-green-300' : 'text-yellow-300'}`}>
            {isCorrectNetwork ? 'Connected to Kadena EVM Testnet' : 'Connected (Wrong Network)'}
          </p>
          <p className="font-mono text-xs text-gray-200">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-1 text-sm bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isPending}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isPending
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-transparent text-white hover:bg-blue-700 border border-white/20'
      }`}
    >
      {isPending ? 'Connecting...' : 'Connect MetaMask'}
    </button>
  );
}
