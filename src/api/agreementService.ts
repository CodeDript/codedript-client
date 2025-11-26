import { ApiService } from '../services/apiService';
import type { ApiResponse, PaginatedResponse } from '../types';

// ============================================
// AGREEMENT TYPES (matching backend model)
// ============================================
export interface AgreementUser {
  _id: string;
  email: string;
  walletAddress?: string;
  profile: {
    name?: string;
    avatar?: string;
  };
}

export interface Milestone {
  _id: string;
  milestoneNumber: number;
  title: string;
  description: string;
  deliverables: string[];
  amount: number;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
}

export interface Agreement {
  _id: string;
  agreementId?: string;
  client: AgreementUser;
  developer: AgreementUser;
  clientInfo?: {
    name?: string;
    email?: string;
    walletAddress?: string;
  };
  developerInfo?: {
    name?: string;
    email?: string;
    walletAddress?: string;
  };
  gig?: {
    _id: string;
    title: string;
  };
  project: {
    name: string;
    description: string;
    requirements?: string;
    deliverables?: string[];
    startDate: Date;
    expectedEndDate: Date;
    actualEndDate?: Date;
  };
  financials: {
    totalValue: number;
    currency: 'ETH' | 'USD';
    releasedAmount: number;
    remainingAmount: number;
    platformFee: {
      percentage: number;
      amount: number;
    };
  };
  milestones?: Milestone[];
  status: 
    | 'draft'
    | 'pending_developer'
    | 'pending_client'
    | 'pending_signatures'
    | 'escrow_deposit'
    | 'active'
    | 'in_progress'
    | 'awaiting_final_approval'
    | 'completed'
    | 'cancelled'
    | 'disputed';
  signatures: {
    client: {
      signed: boolean;
      signedAt?: Date;
      walletAddress?: string;
    };
    developer: {
      signed: boolean;
      signedAt?: Date;
      walletAddress?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  metadata?: {
    lastActivityAt: Date;
  };
}

export interface AgreementFilters {
  status?: string;
  role?: 'client' | 'developer';
  page?: number;
  limit?: number;
}

// ============================================
// AGREEMENT SERVICE
// ============================================
export class AgreementService {
  /**
   * Get all agreements for the authenticated user with filters
   */
  static async getAllAgreements(filters: AgreementFilters = {}): Promise<PaginatedResponse<Agreement[]>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/agreements${queryString ? `?${queryString}` : ''}`;
    
    const response = await ApiService.get<Agreement[]>(endpoint);
    return response as PaginatedResponse<Agreement[]>;
  }

  /**
   * Get a specific agreement by ID
   */
  static async getAgreementById(id: string): Promise<ApiResponse<Agreement>> {
    return ApiService.get<Agreement>(`/agreements/${id}`);
  }

  /**
   * Get agreement statistics for the current user
   */
  static async getStatistics(): Promise<ApiResponse<any>> {
    return ApiService.get<any>('/agreements/statistics');
  }

  /**
   * Create a new agreement
   */
  static async createAgreement(agreementData: Partial<Agreement>): Promise<ApiResponse<Agreement>> {
    return ApiService.post<Agreement>('/agreements', agreementData);
  }

  /**
   * Update an agreement (draft only)
   */
  static async updateAgreement(id: string, updates: Partial<Agreement>): Promise<ApiResponse<Agreement>> {
    return ApiService.put<Agreement>(`/agreements/${id}`, updates);
  }

  /**
   * Submit agreement for developer acceptance
   */
  static async submitAgreement(id: string): Promise<ApiResponse<Agreement>> {
    return ApiService.post<Agreement>(`/agreements/${id}/submit`, {});
  }

  /**
   * Extract and save blockchain agreement ID from existing transaction
   */
  static async extractBlockchainId(
    id: string,
    blockchainAgreementId: number
  ): Promise<ApiResponse<any>> {
    return ApiService.post<any>(`/agreements/${id}/extract-blockchain-id`, {
      blockchainAgreementId
    });
  }

  /**
   * Client approves agreement after developer sets payment terms
   * Includes blockchain transaction hash from createAgreement call
   */
  static async clientApproveAgreement(
    id: string, 
    blockchainTxHash: string, 
    ipfsHash?: string,
    blockchainAgreementId?: number
  ): Promise<ApiResponse<Agreement>> {
    return ApiService.post<Agreement>(`/agreements/${id}/client-approve`, {
      blockchainTxHash,
      ipfsHash,
      blockchainAgreementId
    });
  }

  /**
   * Developer accepts agreement with payment terms and milestones
   */
  static async developerAcceptAgreement(
    id: string, 
    financials: { totalValue: number; currency: string },
    milestones: Array<{ title: string; amount: string; description?: string }>
  ): Promise<ApiResponse<Agreement>> {
    return ApiService.post<Agreement>(`/agreements/${id}/developer-accept`, {
      financials,
      milestones: milestones.map((m) => ({
        title: m.title,
        description: m.description || m.title,
        amount: m.amount,
        financials: {
          value: parseFloat(m.amount) || 0,
          currency: financials.currency
        }
      }))
    });
  }

  /**
   * Accept or reject an agreement (developer)
   */
  static async respondToAgreement(id: string, accept: boolean, message?: string): Promise<ApiResponse<Agreement>> {
    return ApiService.post<Agreement>(`/agreements/${id}/respond`, { accept, message });
  }

  /**
   * Sign agreement with wallet
   */
  static async signAgreement(id: string, walletAddress: string, signature: string): Promise<ApiResponse<Agreement>> {
    return ApiService.post<Agreement>(`/agreements/${id}/sign`, { walletAddress, signature });
  }

  /**
   * Cancel an agreement
   */
  static async cancelAgreement(id: string, reason: string): Promise<ApiResponse<Agreement>> {
    return ApiService.post<Agreement>(`/agreements/${id}/cancel`, { reason });
  }

  /**
   * Mark agreement as complete (client only)
   */
  static async completeAgreement(id: string): Promise<ApiResponse<Agreement>> {
    return ApiService.post<Agreement>(`/agreements/${id}/complete`, {});
  }
}
