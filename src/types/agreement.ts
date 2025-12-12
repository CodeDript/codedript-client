/**
 * Agreement type definitions aligned with server Agreement model
 */

export interface Preview {
  url: string;
  ipfsHash: string;
  uploadedAt: Date;
}

export interface Milestone {
  name: string;
  description: string;
  status: "pending" | "inProgress" | "completed";
  previews: Preview[];
  completedAt: Date | null;
}

export interface Deliverable {
  url: string;
  ipfsHash: string;
  uploadedAt: Date;
}

export interface Document {
  url: string;
  ipfsHash: string;
  uploadedAt: Date;
}

export interface Agreement {
  _id: string;
  agreementID: string;
  client: string;
  developer: string;
  gig: string;
  title: string;
  description: string;
  status: "pending" | "rejected" | "cancelled" | "active" | "in-progress" | "completed" | "paid";
  deliverables: Deliverable[];
  startDate: Date;
  endDate: Date | null;
  financials: {
    totalValue: number;
    releasedAmount: number;
    remainingAmount: number;
  };
  documents: Document[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
  progressPercentage?: number;
}

export interface CreateAgreementRequest {
  client: string;
  developer: string;
  gig: string;
  title: string;
  description: string;
  financials: {
    totalValue: number;
  };
  milestones?: Milestone[];
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateAgreementRequest extends Partial<CreateAgreementRequest> {
  status?: Agreement["status"];
  deliverables?: Deliverable[];
  documents?: Document[];
}
