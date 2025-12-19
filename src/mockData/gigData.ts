// Mock Gig Data
export interface MockGig {
  _id: string;
  title: string;
  description: string;
  developer: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
      skills: string[];
      bio: string;
    };
    reputation: {
      rating: number;
      reviewCount: number;
    };
    walletAddress: string;
    createdAt: string;
  };
  pricing: {
    amount: number;
    currency: string;
  };
  images?: Array<{
    url: string;
  }>;
  rating?: {
    average: number;
    count: number;
  };
  packages?: Array<{
    name: string;
    price: number;
    delivery: string;
    revisions: number;
    description: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

export const mockGigs: MockGig[] = [
  {
    _id: 'gig-001',
    title: 'Full Stack Web Application Development',
    description: 'I will develop a complete full-stack web application using React, Node.js, and MongoDB. Includes responsive design, API integration, authentication, and deployment.',
    developer: {
      _id: 'dev-001',
      profile: {
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'],
        bio: 'Full-stack developer with 5+ years of experience building scalable web applications.',
      },
      reputation: {
        rating: 5,
        reviewCount: 48,
      },
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      createdAt: '2023-01-15T00:00:00Z',
    },
    pricing: {
      amount: 2500,
      currency: 'USD',
    },
    images: [
      { url: 'https://picsum.photos/seed/gig1/400/300' },
    ],
    rating: {
      average: 5,
      count: 48,
    },
    packages: [
      {
        name: 'Basic',
        price: 1800,
        delivery: '14 days',
        revisions: 2,
        description: ['Basic web app', 'Responsive design', 'Basic authentication'],
      },
      {
        name: 'Standard',
        price: 2500,
        delivery: '21 days',
        revisions: 3,
        description: ['Advanced features', 'API integration', 'Database setup', 'Admin dashboard'],
      },
      {
        name: 'Premium',
        price: 3500,
        delivery: '30 days',
        revisions: 5,
        description: ['Full-stack solution', 'Advanced security', 'Cloud deployment', 'CI/CD pipeline', 'Documentation'],
      },
    ],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    _id: 'gig-002',
    title: 'Mobile App Development (iOS & Android)',
    description: 'Professional mobile app development using React Native. Cross-platform solution with native performance and beautiful UI.',
    developer: {
      _id: 'dev-002',
      profile: {
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/150?img=2',
        skills: ['React Native', 'Firebase', 'Redux', 'Mobile UI/UX'],
        bio: 'Mobile app specialist with expertise in creating smooth, performant applications.',
      },
      reputation: {
        rating: 5,
        reviewCount: 32,
      },
      walletAddress: '0x2234567890abcdef1234567890abcdef12345678',
      createdAt: '2023-03-20T00:00:00Z',
    },
    pricing: {
      amount: 3000,
      currency: 'USD',
    },
    images: [
      { url: 'https://picsum.photos/seed/gig2/400/300' },
    ],
    rating: {
      average: 5,
      count: 32,
    },
    packages: [
      {
        name: 'Basic',
        price: 2000,
        delivery: '20 days',
        revisions: 2,
        description: ['Single platform', 'Basic features', 'Standard UI'],
      },
      {
        name: 'Standard',
        price: 3000,
        delivery: '30 days',
        revisions: 3,
        description: ['Cross-platform', 'Advanced features', 'Custom UI', 'Push notifications'],
      },
      {
        name: 'Premium',
        price: 4500,
        delivery: '45 days',
        revisions: 5,
        description: ['Full cross-platform', 'Backend integration', 'Analytics', 'App store deployment'],
      },
    ],
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    _id: 'gig-003',
    title: 'E-commerce Website with Payment Integration',
    description: 'Complete e-commerce solution with product catalog, shopping cart, payment processing, and order management.',
    developer: {
      _id: 'dev-003',
      profile: {
        name: 'Emily Rodriguez',
        avatar: 'https://i.pravatar.cc/150?img=3',
        skills: ['E-commerce', 'Stripe', 'WooCommerce', 'Payment APIs', 'Security'],
        bio: 'E-commerce specialist focused on building secure and scalable online stores.',
      },
      reputation: {
        rating: 5,
        reviewCount: 56,
      },
      walletAddress: '0x3234567890abcdef1234567890abcdef12345678',
      createdAt: '2023-02-10T00:00:00Z',
    },
    pricing: {
      amount: 3500,
      currency: 'USD',
    },
    images: [
      { url: 'https://picsum.photos/seed/gig3/400/300' },
    ],
    rating: {
      average: 5,
      count: 56,
    },
    packages: [
      {
        name: 'Basic',
        price: 2200,
        delivery: '18 days',
        revisions: 2,
        description: ['Basic store setup', 'Product catalog', 'Simple checkout'],
      },
      {
        name: 'Standard',
        price: 3500,
        delivery: '28 days',
        revisions: 3,
        description: ['Advanced store', 'Payment integration', 'Inventory management', 'Email notifications'],
      },
      {
        name: 'Premium',
        price: 5000,
        delivery: '40 days',
        revisions: 5,
        description: ['Full e-commerce solution', 'Multi-payment methods', 'Analytics dashboard', 'SEO optimization'],
      },
    ],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
  {
    _id: 'gig-004',
    title: 'AI/ML Integration for Web Applications',
    description: 'Integrate machine learning models into your web application. Includes model training, API development, and deployment.',
    developer: {
      _id: 'dev-004',
      profile: {
        name: 'David Kim',
        avatar: 'https://i.pravatar.cc/150?img=4',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'AI/ML', 'Flask', 'FastAPI'],
        bio: 'AI/ML engineer specializing in integrating intelligent features into applications.',
      },
      reputation: {
        rating: 5,
        reviewCount: 28,
      },
      walletAddress: '0x4234567890abcdef1234567890abcdef12345678',
      createdAt: '2023-05-12T00:00:00Z',
    },
    pricing: {
      amount: 4000,
      currency: 'USD',
    },
    images: [
      { url: 'https://picsum.photos/seed/gig4/400/300' },
    ],
    rating: {
      average: 5,
      count: 28,
    },
    packages: [
      {
        name: 'Basic',
        price: 2800,
        delivery: '15 days',
        revisions: 2,
        description: ['Pre-trained model integration', 'Basic API setup'],
      },
      {
        name: 'Standard',
        price: 4000,
        delivery: '25 days',
        revisions: 3,
        description: ['Custom model training', 'API development', 'Model optimization'],
      },
      {
        name: 'Premium',
        price: 6000,
        delivery: '35 days',
        revisions: 5,
        description: ['Advanced ML pipeline', 'Real-time predictions', 'Scalable deployment', 'Monitoring'],
      },
    ],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    _id: 'gig-005',
    title: 'UI/UX Design and Prototyping',
    description: 'Professional UI/UX design services including wireframes, prototypes, and high-fidelity mockups using Figma.',
    developer: {
      _id: 'dev-005',
      profile: {
        name: 'Lisa Anderson',
        avatar: 'https://i.pravatar.cc/150?img=5',
        skills: ['Figma', 'Adobe XD', 'UI/UX', 'Prototyping', 'User Research'],
        bio: 'UI/UX designer passionate about creating intuitive and beautiful user experiences.',
      },
      reputation: {
        rating: 5,
        reviewCount: 64,
      },
      walletAddress: '0x5234567890abcdef1234567890abcdef12345678',
      createdAt: '2023-04-08T00:00:00Z',
    },
    pricing: {
      amount: 1800,
      currency: 'USD',
    },
    images: [
      { url: 'https://picsum.photos/seed/gig5/400/300' },
    ],
    rating: {
      average: 5,
      count: 64,
    },
    packages: [
      {
        name: 'Basic',
        price: 1200,
        delivery: '7 days',
        revisions: 2,
        description: ['Wireframes', 'Basic mockups', '5 screens'],
      },
      {
        name: 'Standard',
        price: 1800,
        delivery: '12 days',
        revisions: 3,
        description: ['High-fidelity mockups', 'Interactive prototype', '10 screens', 'Style guide'],
      },
      {
        name: 'Premium',
        price: 2800,
        delivery: '18 days',
        revisions: 5,
        description: ['Complete design system', 'Advanced prototyping', '20+ screens', 'User testing', 'Developer handoff'],
      },
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    _id: 'gig-006',
    title: 'Blockchain Smart Contract Development',
    description: 'Develop and deploy secure smart contracts for Ethereum blockchain. Includes testing, auditing, and deployment.',
    developer: {
      _id: 'dev-006',
      profile: {
        name: 'Alex Thompson',
        avatar: 'https://i.pravatar.cc/150?img=6',
        skills: ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'Security'],
        bio: 'Blockchain developer specializing in secure and efficient smart contract development.',
      },
      reputation: {
        rating: 5,
        reviewCount: 22,
      },
      walletAddress: '0x6234567890abcdef1234567890abcdef12345678',
      createdAt: '2023-06-15T00:00:00Z',
    },
    pricing: {
      amount: 3500,
      currency: 'USD',
    },
    images: [
      { url: 'https://picsum.photos/seed/gig6/400/300' },
    ],
    rating: {
      average: 5,
      count: 22,
    },
    packages: [
      {
        name: 'Basic',
        price: 2500,
        delivery: '10 days',
        revisions: 2,
        description: ['Simple smart contract', 'Basic testing', 'Testnet deployment'],
      },
      {
        name: 'Standard',
        price: 3500,
        delivery: '18 days',
        revisions: 3,
        description: ['Advanced contract', 'Comprehensive testing', 'Security audit', 'Mainnet deployment'],
      },
      {
        name: 'Premium',
        price: 5500,
        delivery: '28 days',
        revisions: 5,
        description: ['Complex contract system', 'Full security audit', 'Gas optimization', 'Documentation', 'Support'],
      },
    ],
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
  {
    _id: 'gig-007',
    title: 'DevOps & Cloud Infrastructure Setup',
    description: 'Setup and configure cloud infrastructure using AWS, Docker, Kubernetes. Includes CI/CD pipeline setup.',
    developer: {
      _id: 'dev-007',
      profile: {
        name: 'James Wilson',
        avatar: 'https://i.pravatar.cc/150?img=7',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        bio: 'DevOps engineer focused on building reliable and scalable infrastructure.',
      },
      reputation: {
        rating: 5,
        reviewCount: 38,
      },
      walletAddress: '0x7234567890abcdef1234567890abcdef12345678',
      createdAt: '2023-03-25T00:00:00Z',
    },
    pricing: {
      amount: 2800,
      currency: 'USD',
    },
    images: [
      { url: 'https://picsum.photos/seed/gig7/400/300' },
    ],
    rating: {
      average: 5,
      count: 38,
    },
    packages: [
      {
        name: 'Basic',
        price: 1800,
        delivery: '8 days',
        revisions: 2,
        description: ['Basic cloud setup', 'Docker configuration', 'Simple CI/CD'],
      },
      {
        name: 'Standard',
        price: 2800,
        delivery: '14 days',
        revisions: 3,
        description: ['Advanced infrastructure', 'Kubernetes setup', 'Automated deployment', 'Monitoring'],
      },
      {
        name: 'Premium',
        price: 4200,
        delivery: '21 days',
        revisions: 5,
        description: ['Enterprise-grade infrastructure', 'High availability', 'Auto-scaling', 'Security hardening', 'Documentation'],
      },
    ],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    _id: 'gig-008',
    title: 'Real-time Chat Application Development',
    description: 'Build a real-time chat application with WebSocket support, group chats, file sharing, and notifications.',
    developer: {
      _id: 'dev-008',
      profile: {
        name: 'Sophia Martinez',
        avatar: 'https://i.pravatar.cc/150?img=8',
        skills: ['WebSocket', 'Socket.io', 'Node.js', 'Redis', 'Real-time'],
        bio: 'Backend developer specializing in real-time communication systems.',
      },
      reputation: {
        rating: 5,
        reviewCount: 42,
      },
      walletAddress: '0x8234567890abcdef1234567890abcdef12345678',
      createdAt: '2023-02-28T00:00:00Z',
    },
    pricing: {
      amount: 3200,
      currency: 'USD',
    },
    images: [
      { url: 'https://picsum.photos/seed/gig8/400/300' },
    ],
    rating: {
      average: 5,
      count: 42,
    },
    packages: [
      {
        name: 'Basic',
        price: 1800,
        delivery: '12 days',
        revisions: 2,
        description: ['Basic chat', 'One-on-one messaging', 'Simple UI'],
      },
      {
        name: 'Standard',
        price: 3200,
        delivery: '20 days',
        revisions: 3,
        description: ['Group chats', 'File sharing', 'Typing indicators', 'Read receipts'],
      },
      {
        name: 'Premium',
        price: 4800,
        delivery: '30 days',
        revisions: 5,
        description: ['Advanced features', 'Voice calling', 'Video chat', 'End-to-end encryption', 'Mobile support'],
      },
    ],
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
];

export const getGigById = (id: string): MockGig | undefined => {
  return mockGigs.find(gig => gig._id === id);
};

export const getFeaturedGigs = (limit: number = 4): MockGig[] => {
  return mockGigs.slice(0, limit);
};

export const getRecentGigs = (page: number = 1, limit: number = 10): { data: MockGig[], pagination: { page: number, totalPages: number, total: number } } => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedGigs = mockGigs.slice(start, end);
  
  return {
    data: paginatedGigs,
    pagination: {
      page,
      totalPages: Math.ceil(mockGigs.length / limit),
      total: mockGigs.length,
    },
  };
};
