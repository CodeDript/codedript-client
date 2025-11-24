import { ApiService } from '../services/apiService';
import type { ApiResponse, PaginatedResponse } from '../types';

// ============================================
// TRANSACTION TYPES (matching backend model)
// ============================================
export interface TransactionUser {
  _id: string;
  email: string;
  walletAddress?: string;
  profile: {
    name?: string;
    avatar?: string;
  };
}

export interface Transaction {
  _id: string;
  transactionId: string;
  type: 
    | 'contract_creation'
    | 'escrow_deposit'
    | 'contract_signature'
    | 'milestone_completion'
    | 'milestone_approval'
    | 'milestone_payment'
    | 'change_request'
    | 'change_request_payment'
    | 'change_request_approval'
    | 'final_delivery'
    | 'final_approval'
    | 'final_payment'
    | 'ownership_transfer'
    | 'contract_update'
    | 'refund'
    | 'platform_fee'
    | 'withdrawal'
    | 'dispute_raised'
    | 'contract_cancellation'
    | 'other';
  agreement?: {
    _id: string;
    agreementId?: string;
    project: {
      name: string;
    };
  };
  milestone?: {
    _id: string;
    title: string;
  };
  from: {
    user: TransactionUser;
    walletAddress: string;
  };
  to: {
    user: TransactionUser;
    walletAddress: string;
  };
  amount: {
    value: number;
    currency: string;
    usdValue?: number;
  };
  fees: {
    platformFee: number;
    networkFee: number;
    totalFees: number;
  };
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  blockchain: {
    isOnChain: boolean;
    network?: string;
    transactionHash?: string;
    blockNumber?: number;
    blockHash?: string;
    contractAddress?: string;
    gasUsed?: string;
    gasPrice?: string;
    confirmations?: number;
  };
  metadata: {
    description?: string;
    notes?: string;
    initiatedBy?: string;
  };
  timestamps: {
    initiated: Date;
    processed?: Date;
    completed?: Date;
    failed?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// API SERVICE
// ============================================
export class TransactionService {
  /**
   * Get all transactions for the current user
   */
  static async getAllTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    role?: 'sender' | 'receiver' | 'both';
  }): Promise<PaginatedResponse<Transaction[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.role) queryParams.append('role', params.role);
    
    const endpoint = `/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await ApiService.get<Transaction[]>(endpoint);
    return response as PaginatedResponse<Transaction[]>;
  }

  /**
   * Get transactions for a specific agreement
   */
  static async getTransactionsByAgreement(agreementId: string): Promise<ApiResponse<Transaction[]>> {
    return ApiService.get<Transaction[]>(`/transactions/agreement/${agreementId}`);
  }

  /**
   * Get transaction summary for current user
   */
  static async getTransactionSummary(): Promise<ApiResponse<{
    sent: { total: number; count: number };
    received: { total: number; count: number };
  }>> {
    return ApiService.get('/transactions/summary');
  }

  /**
   * Get transaction statistics for current user
   */
  static async getTransactionStatistics(): Promise<ApiResponse<any>> {
    return ApiService.get('/transactions/statistics');
  }

  /**
   * Create escrow deposit transaction
   */
  static async createEscrowDeposit(data: {
    agreementId: string;
    amount: number;
    currency?: string;
    transactionHash?: string;
  }): Promise<ApiResponse<Transaction>> {
    return ApiService.post('/transactions/escrow-deposit', data);
  }

  /**
   * Create milestone payment transaction
   */
  static async createMilestonePayment(data: {
    agreementId: string;
    milestoneId: string;
    amount: number;
    currency?: string;
    transactionHash?: string;
  }): Promise<ApiResponse<Transaction>> {
    return ApiService.post('/transactions/milestone-payment', data);
  }
}
