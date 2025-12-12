// Mock Review Data
export interface MockReview {
  _id: string;
  developer: string;
  client: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export const mockReviews: MockReview[] = [
  {
    _id: 'review-001',
    developer: 'dev-001',
    client: {
      _id: 'client-001',
      profile: {
        name: 'John Client',
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
    },
    rating: 5,
    comment: 'Excellent work! Very professional and delivered on time.',
    createdAt: '2024-11-20T00:00:00Z',
  },
  {
    _id: 'review-002',
    developer: 'dev-001',
    client: {
      _id: 'client-002',
      profile: {
        name: 'Jane Smith',
        avatar: 'https://i.pravatar.cc/150?img=12',
      },
    },
    rating: 5,
    comment: 'Great communication and high-quality code. Highly recommend!',
    createdAt: '2024-11-15T00:00:00Z',
  },
  {
    _id: 'review-003',
    developer: 'dev-001',
    client: {
      _id: 'client-003',
      profile: {
        name: 'Bob Wilson',
        avatar: 'https://i.pravatar.cc/150?img=13',
      },
    },
    rating: 4,
    comment: 'Very good developer. Project was completed successfully.',
    createdAt: '2024-11-10T00:00:00Z',
  },
  {
    _id: 'review-004',
    developer: 'dev-002',
    client: {
      _id: 'client-001',
      profile: {
        name: 'John Client',
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
    },
    rating: 5,
    comment: 'Amazing mobile app developer. Exceeded expectations!',
    createdAt: '2024-11-25T00:00:00Z',
  },
];

export const getReviewsByDeveloperId = (developerId: string): MockReview[] => {
  return mockReviews.filter(review => review.developer === developerId);
};
