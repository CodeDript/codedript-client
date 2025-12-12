/**
 * Gig type definitions aligned with server Gig model
 */

export interface GigPackage {
  name: "basic" | "standard" | "premium";
  price: number;
  deliveryTime: number;
  features: string[];
  description: string;
}

export interface Gig {
  _id: string;
  developer: string;
  title: string;
  description: string;
  gigID: string;
  images: string[];
  packages: GigPackage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGigRequest {
  title: string;
  description: string;
  images?: string[];
  packages: GigPackage[];
}

export interface UpdateGigRequest extends Partial<CreateGigRequest> {
  isActive?: boolean;
}
