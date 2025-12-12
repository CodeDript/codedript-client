// Mock User Data
export interface MockUser {
  _id: string;
  email: string;
  role: 'client' | 'developer' | 'both';
  walletAddress: string;
  profile: {
    name: string;
    avatar?: string;
    bio?: string;
    skills?: string[];
  };
  reputation?: {
    rating: number;
    reviewCount: number;
  };
  createdAt: string;
}

export const mockUsers: Record<string, MockUser> = {
  'dev-001': {
    _id: 'dev-001',
    email: 'sarah.johnson@example.com',
    role: 'developer',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    profile: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Full-stack developer with 5+ years of experience building scalable web applications.',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
    },
    reputation: {
      rating: 5,
      reviewCount: 48,
    },
    createdAt: '2023-01-15T00:00:00Z',
  },
  'dev-002': {
    _id: 'dev-002',
    email: 'michael.chen@example.com',
    role: 'developer',
    walletAddress: '0x2234567890abcdef1234567890abcdef12345678',
    profile: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Mobile app specialist with expertise in creating smooth, performant applications.',
      skills: ['React Native', 'Firebase', 'Redux', 'Mobile UI/UX'],
    },
    reputation: {
      rating: 5,
      reviewCount: 32,
    },
    createdAt: '2023-03-20T00:00:00Z',
  },
  'dev-003': {
    _id: 'dev-003',
    email: 'emily.rodriguez@example.com',
    role: 'developer',
    walletAddress: '0x3234567890abcdef1234567890abcdef12345678',
    profile: {
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'E-commerce specialist focused on building secure and scalable online stores.',
      skills: ['E-commerce', 'Stripe', 'WooCommerce', 'Payment APIs', 'Security'],
    },
    reputation: {
      rating: 5,
      reviewCount: 56,
    },
    createdAt: '2023-02-10T00:00:00Z',
  },
  'client-001': {
    _id: 'client-001',
    email: 'john.client@example.com',
    role: 'client',
    walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    profile: {
      name: 'John Client',
      avatar: 'https://i.pravatar.cc/150?img=11',
      bio: 'Tech entrepreneur looking for talented developers.',
    },
    createdAt: '2023-01-10T00:00:00Z',
  },
};

export const getUserById = (id: string): MockUser | undefined => {
  return mockUsers[id];
};

export const getUserByWallet = (walletAddress: string): MockUser | undefined => {
  return Object.values(mockUsers).find(user => user.walletAddress.toLowerCase() === walletAddress.toLowerCase());
};
