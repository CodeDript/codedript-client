/**
 * Review type definitions aligned with server Review model
 */

export interface Review {
  _id: string;
  gig: string;
  reviewer: string;
  reviewee: string;
  rating: number; // 1-5
  comment: string;
  createdOn: Date;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  gig: string;
  reviewer: string;
  reviewee: string;
  rating: number;
  comment: string;
}
