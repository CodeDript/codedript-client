// ============================================
// USER TYPES
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

// ============================================
// GIG TYPES
// ============================================
export interface GigDeveloper {
  _id: string;
  email: string;
  profile: {
    name?: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
  };
  reputation: {
    rating: number;
    reviewCount: number;
  };
}

export interface Gig {
  _id: string;
  developer: GigDeveloper;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  pricing: {
    type: 'fixed' | 'hourly';
    amount: number;
    currency: 'ETH' | 'USD';
  };
  deliveryTime: number;
  revisions: number;
  images: Array<{
    url: string;
    publicId?: string;
  }>;
  tags: string[];
  status: 'draft' | 'active' | 'paused' | 'inactive';
  statistics: {
    views: number;
    inquiries: number;
    ordersInProgress: number;
    ordersCompleted: number;
  };
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Legacy interface for backward compatibility
export interface Package {
  _id?: string;
  title: string;
  description: string[];
  price: number;
  currency: string;
  deliveryTime: number;
  revisions: number;
}

// ============================================
// AGREEMENT TYPES
// ============================================
export interface Agreement {
  _id: string;
  client: string | User;
  developer: string | User;
  gig?: string | Gig;
  title: string;
  description: string;
  totalValue: number;
  currency: string;
  status: 'draft' | 'pending' | 'active' | 'completed' | 'cancelled' | 'disputed';
  startDate: string;
  endDate: string;
  blockchainId?: number;
  documentCid?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// MILESTONE TYPES
// ============================================
export interface Milestone {
  _id: string;
  agreement: string | Agreement;
  title: string;
  description: string;
  value: number;
  currency: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  submissionUrl?: string;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// WALLET TYPES
// ============================================
export interface Wallet {
  address: string;
  balance: string;
  network: string;
}

// ============================================
// TRANSACTION TYPES
// ============================================
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

// ============================================
// SMART CONTRACT TYPES
// ============================================
export interface Contract {
  address: string;
  abi: any[];
  name: string;
  symbol?: string;
}

// ============================================
// NETWORK TYPES
// ============================================
export interface Network {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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
