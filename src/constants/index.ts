// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  BLOCKCHAIN: '/api/blockchain',
  TRANSACTIONS: '/api/transactions',
  WALLET: '/api/wallet',
} as const;

// Blockchain Networks
export const NETWORKS = {
  MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/',
  },
  GOERLI: {
    chainId: 5,
    name: 'Goerli Testnet',
    rpcUrl: 'https://goerli.infura.io/v3/',
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/',
  },
  LOCALHOST: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
  },
} as const;

// Transaction Status
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  WALLET_ADDRESS: 'wallet_address',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Gas Limits
export const GAS_LIMITS = {
  TRANSFER: 21000,
  CONTRACT_DEPLOY: 3000000,
  CONTRACT_INTERACTION: 500000,
} as const;
