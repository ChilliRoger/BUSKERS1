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
      <div className="flex items-center space-x-3">
        <div className="text-sm">
          <p className={`${isCorrectNetwork ? 'text-green-600' : 'text-yellow-600'}`}>
            {isCorrectNetwork ? 'Connected to Kadena EVM Testnet' : 'Connected (Wrong Network)'}
          </p>
          <p className="font-mono text-xs text-gray-500">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isPending ? 'Connecting...' : 'Connect MetaMask'}
    </button>
  );
}
