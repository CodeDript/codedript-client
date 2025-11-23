import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export interface Review {
  _id: string;
  reviewId: string;
  agreement: {
    _id: string;
    agreementId: string;
    project: {
      title: string;
    };
    createdAt: string;
  };
  gig?: {
    _id: string;
    gigId: number;
    title: string;
  };
  reviewer: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
    };
    walletAddress: string;
  };
  reviewee: {
    _id: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  rating: number;
  review: string;
  categories?: {
    communication?: number;
    quality?: number;
    timeline?: number;
    professionalism?: number;
  };
  helpful: {
    count: number;
    users: string[];
  };
  response?: {
    text: string;
    respondedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  statistics: {
    avgRating: number;
    totalReviews: number;
    rating5: number;
    rating4: number;
    rating3: number;
    rating2: number;
    rating1: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
    hasMore: boolean;
  };
}

export const ReviewService = {
  /**
   * Get reviews for a specific developer (all reviews across their gigs)
   */
  async getDeveloperReviews(developerId: string, page = 1, limit = 20): Promise<ReviewsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/developer/${developerId}/reviews`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching developer reviews:', error);
      throw error;
    }
  },

  /**
   * Get reviews for a specific gig
   */
  async getGigReviews(gigId: string, page = 1, limit = 10): Promise<ReviewsResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/gigs/${gigId}/reviews`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching gig reviews:', error);
      throw error;
    }
  },

  /**
   * Get a single review by ID
   */
  async getReviewById(reviewId: string): Promise<Review> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/${reviewId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  },

  /**
   * Create a new review
   */
  async createReview(data: {
    agreementId: string;
    gigId?: string;
    rating: number;
    review: string;
    categories?: {
      communication?: number;
      quality?: number;
      timeline?: number;
      professionalism?: number;
    };
  }): Promise<Review> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/reviews`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Mark review as helpful
   */
  async markHelpful(reviewId: string): Promise<Review> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/reviews/${reviewId}/helpful`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  },

  /**
   * Add developer response to review
   */
  async addResponse(reviewId: string, text: string): Promise<Review> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/reviews/${reviewId}/response`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error adding response:', error);
      throw error;
    }
  }
};
