import { ApiService } from '../services/apiService';
import type { PaginatedResponse } from '../types';

// ============================================
// GIG TYPES (matching backend model)
// ============================================
export interface GigDeveloper {
  _id: string;
  email: string;
  walletAddress?: string;
  createdAt?: string;
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
  gigId?: number;
  developer: GigDeveloper;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  packages?: Array<{
    name: 'Basic' | 'Standard' | 'Premium';
    description: string[];
    price: number;
    currency: 'ETH' | 'USD';
    deliveryTime: number;
    revisions: number;
    features?: string[];
  }>;
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

export interface GigFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  skills?: string;
  deliveryTime?: number;
  status?: string;
  developer?: string;
  includeInactive?: boolean;
  sortBy?: 'createdAt' | 'rating' | 'views';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ============================================
// GIG SERVICE
// ============================================
export class GigService {
  /**
   * Get all gigs with filters and pagination
   */
  static async getAllGigs(filters: GigFilters = {}): Promise<PaginatedResponse<Gig[]>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // boolean includeInactive should be serialized to string
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/gigs${queryString ? `?${queryString}` : ''}`;
    
    const response = await ApiService.get<any>(endpoint);
    return response as PaginatedResponse<Gig[]>;
  }

  /**
   * Get featured/top gigs by rating and reviews (for homepage)
   */
  static async getFeaturedGigs(limit: number = 4): Promise<PaginatedResponse<Gig[]>> {
    return this.getAllGigs({
      limit,
      sortBy: 'rating',
      sortOrder: 'desc',
      status: 'active'
    });
  }

  /**
   * Get recent gigs (for all gigs page)
   */
  static async getRecentGigs(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Gig[]>> {
    return this.getAllGigs({
      page,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      status: 'active'
    });
  }

  /**
   * Get gig by ID
   */
  static async getGigById(gigId: string): Promise<Gig> {
    const response = await ApiService.get<Gig>(`/gigs/${gigId}`);
    return response.data;
  }

  /**
   * Search gigs
   */
  static async searchGigs(searchTerm: string, filters: GigFilters = {}): Promise<PaginatedResponse<Gig[]>> {
    const queryParams = new URLSearchParams(filters as any);
    const endpoint = `/gigs/search?q=${encodeURIComponent(searchTerm)}${queryParams.toString() ? '&' + queryParams.toString() : ''}`;
    
    const response = await ApiService.get<any>(endpoint);
    return response as PaginatedResponse<Gig[]>;
  }

  /**
   * Get gigs by category
   */
  static async getGigsByCategory(category: string, filters: GigFilters = {}): Promise<PaginatedResponse<Gig[]>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/gigs/category/${category}${queryString ? `?${queryString}` : ''}`;
    
    const response = await ApiService.get<any>(endpoint);
    return response as PaginatedResponse<Gig[]>;
  }
}
