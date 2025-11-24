const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Get authentication headers with token from localStorage
 */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export interface AttachedFile {
  name: string;
  size: number;
  ipfsHash: string;
  url: string;
  type?: string;
  uploadedAt?: Date;
}

export interface ChangeRequest {
  _id: string;
  requestId: string;
  agreement: string;
  title: string;
  description: string;
  createdBy: {
    user: {
      _id: string;
      profile?: { name: string };
      email: string;
      walletAddress: string;
    };
    role: 'client' | 'developer';
  };
  attachedFiles?: AttachedFile[];
  status: 'pending' | 'confirmed' | 'approved' | 'rejected' | 'ignored';
  confirmation?: {
    confirmedBy: any;
    confirmedAt: Date;
    amount: number;
    currency: string;
    details?: string;
  };
  clientResponse?: {
    respondedBy: any;
    respondedAt: Date;
    approved: boolean;
    reason?: string;
  };
  blockchain?: {
    transactionHash?: string;
    recordedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class ChangeRequestService {
  /**
   * Upload file to IPFS for change request
   */
  static async uploadFileToIPFS(file: File): Promise<ApiResponse<AttachedFile>> {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('file', file);

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/change-requests/upload-file`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to upload file' }));
      throw new Error(error.message || 'Failed to upload file to IPFS');
    }

    return await response.json();
  }

  /**
   * Create new change request (Client only)
   */
  static async createChangeRequest(
    agreementId: string,
    title: string,
    description: string,
    attachedFiles?: AttachedFile[]
  ): Promise<ApiResponse<ChangeRequest>> {
    const response = await fetch(`${BACKEND_URL}/change-requests`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        agreementId,
        title,
        description,
        attachedFiles,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create change request' }));
      throw new Error(error.message || 'Failed to create change request');
    }

    return await response.json();
  }

  /**
   * Get all change requests for an agreement
   */
  static async getChangeRequestsByAgreement(
    agreementId: string,
    status?: string
  ): Promise<ApiResponse<ChangeRequest[]>> {
    const url = new URL(`${BACKEND_URL}/change-requests/agreement/${agreementId}`);
    if (status) {
      url.searchParams.append('status', status);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch change requests' }));
      throw new Error(error.message || 'Failed to fetch change requests');
    }

    return await response.json();
  }

  /**
   * Get change request by ID
   */
  static async getChangeRequestById(requestId: string): Promise<ApiResponse<ChangeRequest>> {
    const response = await fetch(`${BACKEND_URL}/change-requests/${requestId}`, {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch change request' }));
      throw new Error(error.message || 'Failed to fetch change request');
    }

    return await response.json();
  }

  /**
   * Confirm change request with pricing (Developer only)
   */
  static async confirmChangeRequest(
    requestId: string,
    amount: number,
    currency: string,
    details?: string
  ): Promise<ApiResponse<ChangeRequest>> {
    const response = await fetch(`${BACKEND_URL}/change-requests/${requestId}/confirm`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, currency, details }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to confirm change request' }));
      throw new Error(error.message || 'Failed to confirm change request');
    }

    return await response.json();
  }

  /**
   * Ignore change request (Developer only)
   */
  static async ignoreChangeRequest(requestId: string): Promise<ApiResponse<ChangeRequest>> {
    const response = await fetch(`${BACKEND_URL}/change-requests/${requestId}/ignore`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to ignore change request' }));
      throw new Error(error.message || 'Failed to ignore change request');
    }

    return await response.json();
  }

  /**
   * Approve change request and update contract price (Client only)
   */
  static async approveChangeRequest(
    requestId: string,
    reason?: string
  ): Promise<ApiResponse<{ changeRequest: ChangeRequest; updatedAgreement: any }>> {
    const response = await fetch(`${BACKEND_URL}/change-requests/${requestId}/approve`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to approve change request' }));
      throw new Error(error.message || 'Failed to approve change request');
    }

    return await response.json();
  }

  /**
   * Reject change request (Client only)
   */
  static async rejectChangeRequest(
    requestId: string,
    reason?: string
  ): Promise<ApiResponse<ChangeRequest>> {
    const response = await fetch(`${BACKEND_URL}/change-requests/${requestId}/reject`, {
      method: 'POST',
      credentials: 'include',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to reject change request' }));
      throw new Error(error.message || 'Failed to reject change request');
    }

    return await response.json();
  }

  /**
   * Delete change request (Client only - before confirmation)
   */
  static async deleteChangeRequest(requestId: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${BACKEND_URL}/change-requests/${requestId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete change request' }));
      throw new Error(error.message || 'Failed to delete change request');
    }

    return await response.json();
  }
}
