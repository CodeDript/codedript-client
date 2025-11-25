import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export interface MilestoneFile {
  name: string;
  url: string;
  ipfsHash?: string;
  supabaseId?: string;
  description?: string;
  uploadedAt: string;
}

export interface Milestone {
  _id: string;
  agreement: string;
  milestoneNumber: number;
  title: string;
  description: string;
  deliverables?: string[];
  financials: {
    value: number;
    currency: string;
    isPaid: boolean;
    paidAt?: string;
    transactionHash?: string;
  };
  timeline: {
    startDate?: string;
    dueDate: string;
    completedDate?: string;
    approvedDate?: string;
  };
  status: 'pending' | 'in_progress' | 'submitted' | 'in_review' | 'revision_requested' | 'completed' | 'approved' | 'paid' | 'rejected';
  submission?: {
    submittedBy?: string;
    submittedAt?: string;
    notes?: string;
    demoFiles?: MilestoneFile[];
    files?: MilestoneFile[];
  };
  review?: {
    reviewedBy?: string;
    reviewedAt?: string;
    rating?: number;
    feedback?: string;
    revisionNotes?: string;
  };
  revisions?: any[];
  blockchain?: {
    isRecorded: boolean;
    completionTxHash?: string;
    approvalTxHash?: string;
    paymentTxHash?: string;
    network?: string;
  };
  payment?: {
    released: boolean;
    releasedAt?: string;
    releasedAmount?: number;
    releaseTxHash?: string;
  };
  metadata?: {
    priority: 'low' | 'medium' | 'high';
    isActive: boolean;
    lastActivityAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const MilestoneService = {
  /**
   * Get all milestones for an agreement
   */
  getMilestonesByAgreement: async (agreementId: string): Promise<Milestone[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/milestones/agreement/${agreementId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching milestones:', error);
      throw error;
    }
  },

  /**
   * Get milestone by ID
   */
  getMilestoneById: async (milestoneId: string): Promise<Milestone> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/milestones/${milestoneId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching milestone:', error);
      throw error;
    }
  },

  /**
   * Start milestone progress
   */
  startMilestone: async (milestoneId: string): Promise<Milestone> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/milestones/${milestoneId}/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error starting milestone:', error);
      throw error;
    }
  },

  /**
   * Submit milestone for review (with files)
   */
  submitMilestone: async (
    milestoneId: string,
    notes: string,
    files?: File[]
  ): Promise<Milestone> => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('notes', notes);
      
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await axios.post(
        `${API_URL}/milestones/${milestoneId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error submitting milestone:', error);
      throw error;
    }
  },

  /**
   * Complete milestone (developer marks as complete)
   */
  completeMilestone: async (milestoneId: string, data: { ipfsHash?: string; fileUrl?: string; description?: string }): Promise<Milestone> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/milestones/${milestoneId}/complete`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error completing milestone:', error);
      throw error;
    }
  },

  /**
   * Upload milestone files to IPFS/Supabase
   */
  uploadMilestoneFiles: async (milestoneId: string, files: File[]): Promise<{ files: MilestoneFile[] }> => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post(
        `${API_URL}/milestones/${milestoneId}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error uploading milestone files:', error);
      throw error;
    }
  },

  /**
   * Approve milestone (client only)
   */
  approveMilestone: async (milestoneId: string, rating: number, feedback?: string): Promise<Milestone> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/milestones/${milestoneId}/approve`,
        { rating, feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error approving milestone:', error);
      throw error;
    }
  },

  /**
   * Request revision (client only)
   */
  requestRevision: async (milestoneId: string, reason: string): Promise<Milestone> => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/milestones/${milestoneId}/request-revision`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error requesting revision:', error);
      throw error;
    }
  },
};
