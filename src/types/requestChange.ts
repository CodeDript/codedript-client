/**
 * RequestChange type definitions aligned with server RequestChange model
 */

export interface RequestChangeFile {
  ipfsHash: string;
  url: string;
}

export interface RequestChange {
  _id: string;
  agreement: string;
  requestID: string;
  title: string;
  description: string;
  files: RequestChangeFile[];
  status: "pending" | "priced" | "paid";
  price: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestChangeRequest {
  agreement: string;
  title: string;
  description: string;
  files?: RequestChangeFile[];
}

export interface UpdateRequestChangeRequest {
  title?: string;
  description?: string;
  files?: RequestChangeFile[];
  status?: "pending" | "priced" | "paid";
  price?: number;
}
