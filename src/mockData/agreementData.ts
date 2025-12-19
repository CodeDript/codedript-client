// Mock Agreement Data
export interface MockAgreement {
  _id: string;
  agreementId?: number;
  client: {
    _id: string;
    profile: {
      name: string;
    };
    email: string;
    walletAddress: string;
  };
  developer: {
    _id: string;
    profile: {
      name: string;
    };
    email: string;
    walletAddress: string;
  };
  project: {
    name: string;
    description: string;
    expectedEndDate?: string;
  };
  financials: {
    totalValue: number;
    currency: string;
  };
  status: 'draft' | 'pending_developer' | 'pending_client' | 'active' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  blockchainTxHash?: string;
}

export const mockAgreements: MockAgreement[] = [
  {
    _id: 'agreement-001',
    agreementId: 1,
    client: {
      _id: 'client-001',
      profile: {
        name: 'John Client',
      },
      email: 'john.client@example.com',
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    },
    developer: {
      _id: 'dev-001',
      profile: {
        name: 'Sarah Johnson',
      },
      email: 'sarah.johnson@example.com',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    },
    project: {
      name: 'E-commerce Platform Development',
      description: 'Build a complete e-commerce platform with payment integration.',
      expectedEndDate: '2025-03-15T00:00:00Z',
    },
    financials: {
      totalValue: 5000,
      currency: 'ETH',
    },
    status: 'active',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-05T00:00:00Z',
    blockchainTxHash: '0xabc123def456...',
  },
  {
    _id: 'agreement-002',
    agreementId: 2,
    client: {
      _id: 'client-001',
      profile: {
        name: 'John Client',
      },
      email: 'john.client@example.com',
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    },
    developer: {
      _id: 'dev-002',
      profile: {
        name: 'Michael Chen',
      },
      email: 'michael.chen@example.com',
      walletAddress: '0x2234567890abcdef1234567890abcdef12345678',
    },
    project: {
      name: 'Mobile App Development',
      description: 'Create a mobile app for iOS and Android.',
      expectedEndDate: '2025-02-28T00:00:00Z',
    },
    financials: {
      totalValue: 3500,
      currency: 'ETH',
    },
    status: 'pending_developer',
    createdAt: '2024-12-08T00:00:00Z',
    updatedAt: '2024-12-08T00:00:00Z',
  },
];

export const getAgreementsByUserId = (userId: string, statuses?: string[]): MockAgreement[] => {
  return mockAgreements.filter(agreement => {
    const isUserInvolved = agreement.client._id === userId || agreement.developer._id === userId;
    const matchesStatus = !statuses || statuses.length === 0 || statuses.includes(agreement.status);
    return isUserInvolved && matchesStatus;
  });
};

export const getAgreementById = (id: string): MockAgreement | undefined => {
  return mockAgreements.find(agreement => agreement._id === id);
};
