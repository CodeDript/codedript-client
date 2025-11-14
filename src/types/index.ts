// User types
export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  createdAt: Date;
}

// Wallet types
export interface Wallet {
  address: string;
  balance: string;
  network: string;
}

// Transaction types
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  blockNumber?: number;
}

// Smart Contract types
export interface Contract {
  address: string;
  abi: any[];
  name: string;
  symbol?: string;
}

// Network types
export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component Props types
export interface CardProps {
  title?: string;
  description?: string;
  icon?: string;
}

export interface HeroProps {
  headline?: string;
  subtext?: string;
  ctaText?: string;
  ctaAction?: () => void;
  backgroundImage?: string;
}
