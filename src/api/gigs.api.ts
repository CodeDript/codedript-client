import { api } from "./client";
import type { Gig, CreateGigRequest, UpdateGigRequest } from "../types";

/**
 * Gigs API endpoints
 */

export const gigsApi = {
  /**
   * Get all gigs with optional filters
   */
  getAll: (params?: {
    isActive?: boolean;
    search?: string;
  }) =>
    api.get<{ gigs: Gig[] }>("/gigs", { params }).then((r) => r.data),

  /**
   * Get a single gig by ID
   */
  getById: (id: string) =>
    api.get<{ gig: Gig }>(`/gigs/${id}`).then((r) => r.data),

  /**
   * Create a new gig
   */
  create: (data: CreateGigRequest) =>
    api.post<{ gig: Gig }>("/gigs", data).then((r) => r.data),

  /**
   * Update an existing gig
   */
  update: (id: string, data: UpdateGigRequest) =>
    api.put<{ gig: Gig }>(`/gigs/${id}`, data).then((r) => r.data),

  /**
   * Delete a gig
   */
  delete: (id: string) =>
    api.delete(`/gigs/${id}`).then((r) => r.data),

  /**
   * Get gigs by developer ID
   */
  getByDeveloper: (developerId: string) =>
    api.get<{ gigs: Gig[] }>(`/gigs/developer/${developerId}`).then((r) => r.data),
};
