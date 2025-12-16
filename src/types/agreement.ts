/**
 * Agreement type definitions aligned with server Agreement model
 */

export interface Preview {
  url: string;
  ipfsHash: string;
  uploadedAt: Date;
}

export interface Milestone {
  // Flexible milestone shape: front-end uses `title`, server stores `name`.
  name?: string;
  title?: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed" | "inProgress";
  previews?: Preview[];
  completedAt?: Date | null;
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

export interface UserRef {
  _id: string;
  walletAddress?: string;
  email: string;
  fullname?: string;
  avatar?: string;
  profileCompleteness?: number;
  isProfileComplete?: boolean;
  id?: string;
}

export interface GigRef {
  _id: string;
  title: string;
  gigID?: string;
  id?: string;
}

export interface Agreement {
  _id: string;
  agreementID: string;
  client: string | UserRef;
  developer: string | UserRef;
  gig: string | GigRef;
  title: string;
  description: string;
  status: "pending" | "rejected" | "cancelled" | "active" | "in-progress" | "completed" | "paid" | "priced";
  deliverables: Deliverable[];
  // Dates are strings from API (ISO) on the client-side
  startDate: string;
  endDate: string | null;
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
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface UpdateAgreementRequest extends Partial<CreateAgreementRequest> {
  status?: Agreement["status"];
  deliverables?: Deliverable[];
  documents?: Document[];
  // Allow updating totalValue/top-level milestones directly for convenience
  totalValue?: number;
  milestones?: Milestone[];
}
