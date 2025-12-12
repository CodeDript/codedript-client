import { api } from "./client";
import type { Review, CreateReviewRequest } from "../types";

/**
 * Reviews API endpoints
 */

export const reviewsApi = {
  /**
   * Get all reviews
   */
  getAll: () =>
    api.get<{ reviews: Review[] }>("/reviews").then((r) => r.data),

  /**
   * Get a single review by ID
   */
  getById: (id: string) =>
    api.get<{ review: Review }>(`/reviews/${id}`).then((r) => r.data),

  /**
   * Create a new review
   */
  create: (data: CreateReviewRequest) =>
    api.post<{ review: Review }>("/reviews", data).then((r) => r.data),

  /**
   * Get reviews by gig ID
   */
  getByGig: (gigId: string) =>
    api.get<{ reviews: Review[] }>(`/reviews/gig/${gigId}`).then((r) => r.data),

  /**
   * Get reviews by developer ID
   */
  getByDeveloper: (developerId: string) =>
    api.get<{ reviews: Review[] }>(`/reviews/developer/${developerId}`).then((r) => r.data),
};
