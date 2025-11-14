import { useState, useEffect } from 'react';
import type { Wallet } from '../types';
import { connectWallet as connectWalletService } from '../services/blockchain';

/**
 * Custom hook for managing wallet connection
 */
export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const connectedWallet = await connectWalletService();
      if (connectedWallet) {
        setWallet(connectedWallet);
        localStorage.setItem('wallet_address', connectedWallet.address);
      } else {
        setError('Failed to connect wallet');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem('wallet_address');
  };

  // Check for previously connected wallet on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('wallet_address');
    if (savedAddress && typeof window.ethereum !== 'undefined') {
      connect();
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (wallet && accounts[0] !== wallet.address) {
        connect();
      }
    };

    const handleChainChanged = () => {
      connect();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [wallet]);

  return {
    wallet,
    isConnecting,
    error,
    connect,
    disconnect,
    isConnected: !!wallet,
  };
};
