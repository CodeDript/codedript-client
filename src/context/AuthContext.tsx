import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectWallet } from '../services/ContractService';
import { getAddress } from 'ethers';

// ============================================
// TYPES
// ============================================

export interface User {
  _id: string;
  email: string;
  walletAddress: string;
  role: 'client' | 'developer' | 'both';
  profile: {
    name?: string;
    bio?: string;
    skills?: string[];
    portfolio?: string;
    avatar?: string;
    location?: string;
    hourlyRate?: number;
  };
  reputation: {
    rating: number;
    reviewCount: number;
  };
  statistics: {
    gigsPosted: number;
    agreementsCreated: number;
    agreementsCompleted: number;
    totalEarned: number;
    totalSpent: number;
  };
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: string;
  firstLogin?: string;
  loginCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  walletAddress: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginWithWallet: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // INITIALIZE AUTH STATE FROM STORAGE
  // ============================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const storedWallet = localStorage.getItem('walletAddress');
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');

        if (isLoggedIn === 'true' && storedUser) {
          setUser(JSON.parse(storedUser));
          setWalletAddress(storedWallet);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ============================================
  // LOGIN WITH METAMASK WALLET
  // ============================================
  const loginWithWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Connect MetaMask wallet using ContractService
      console.log('Connecting to MetaMask...');
      const account = await connectWallet();

      // account can be an object with `address` or a string. Normalize it safely.
      const rawAddress = (account && (account.address || account)) || '';
      let address: string;
      try {
        // This will throw if the address is invalid and also returns checksum address
        address = getAddress(rawAddress);
      } catch (err) {
        console.error('Invalid wallet address returned from connectWallet:', rawAddress, err);
        throw new Error('Invalid wallet address returned by wallet provider');
      }

      console.log('Connected wallet:', address);
      
      // Step 2: Try to login with wallet address
      const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
        }),
      });

      let userData;
      let token;

      if (loginResponse.status === 404) {
        // User not found - register new user with wallet address only
        console.log('First time login - registering user...');
        
        const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
            email: `${address.toLowerCase()}@temp.codedript.com`, // Temporary email
            role: 'client' // Default role
          }),
        });

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          throw new Error(registerData.message || 'Registration failed');
        }

        userData = registerData.data.user;
        token = registerData.data.token;
        console.log('User registered successfully:', userData);
      } else if (loginResponse.ok) {
        // Existing user - login successful
        const loginData = await loginResponse.json();
        userData = loginData.data.user;
        token = loginData.data.token;
        console.log('Existing user logged in:', userData);
      } else {
        // Other error
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || 'Login failed');
      }

      // Step 3: Store auth data
      localStorage.setItem('authToken', token);
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role || 'client');
      localStorage.setItem('isLoggedIn', 'true');

      // Step 4: Update state
      setUser(userData);
      setWalletAddress(address);
      setIsAuthenticated(true);

      console.log('Wallet login successful:', userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // LOGIN WITH EMAIL & PASSWORD
  // ============================================
  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store auth data
      const { token, user: userData } = data.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('walletAddress', userData.walletAddress);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userData.role);

      // Update state
      setUser(userData);
      setWalletAddress(userData.walletAddress);
      setIsAuthenticated(true);

      console.log('Email login successful:', userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Email login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    clearAuthData();
    console.log('User logged out');
  };

  // ============================================
  // REFRESH USER DATA
  // ============================================
  const refreshUser = async () => {
    // No backend integration - just refresh from localStorage
    const storedWallet = localStorage.getItem('walletAddress');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
      setWalletAddress(storedWallet);
      setIsAuthenticated(true);
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const refreshUserData = async (token: string) => {
    // Not used in simplified version
    return;
  };

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    
    setUser(null);
    setWalletAddress(null);
    setIsAuthenticated(false);
  };

  const clearError = () => {
    setError(null);
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================
  const value: AuthContextType = {
    user,
    walletAddress,
    isAuthenticated,
    isLoading,
    error,
    loginWithWallet,
    loginWithEmail,
    logout,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// CUSTOM HOOK
// ============================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
