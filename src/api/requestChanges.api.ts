import { api } from "./client";
import type { RequestChange, CreateRequestChangeRequest, UpdateRequestChangeRequest } from "../types";

/**
 * RequestChange API endpoints
 */

export const requestChangesApi = {
  /**
   * Get all request changes
   */
  getAll: () =>
    api.get<{ requestChanges: RequestChange[] }>("/changes").then((r) => r.data),

  /**
   * Get a single request change by ID
   */
  getById: (id: string) =>
    api.get<{ requestChange: RequestChange }>(`/changes/${id}`).then((r) => r.data),

  /**
   * Create a new request change
   * Accepts either a JSON payload or a FormData instance (for file uploads)
   */
  create: (data: CreateRequestChangeRequest | FormData) =>
    api.post<{ requestChange: RequestChange }>("/changes", data).then((r) => r.data),

  /**
   * Update an existing request change
   */
  update: (id: string, data: UpdateRequestChangeRequest) =>
    api.put<{ requestChange: RequestChange }>(`/changes/${id}`, data).then((r) => r.data),

  /**
   * Update status for a request change (use server's status endpoint)
   */
  updateStatus: (id: string, status: string) =>
    api.patch<{ requestChange: RequestChange }>(`/changes/${id}/status`, { status }).then((r) => r.data),

  /**
   * Set price for a request change (developer only)
   */
  updatePrice: (id: string, price: string | number) =>
    api.patch<{ requestChange: RequestChange }>(`/changes/${id}/price`, { price }).then((r) => r.data),

  /**
   * Delete a request change
   */
  delete: (id: string) =>
    api.delete(`/changes/${id}`).then((r) => r.data),

  /**
   * Get request changes by agreement ID
   */
  getByAgreement: (agreementId: string) =>
    api.get<{ requestChanges: RequestChange[] }>(`/changes/agreement/${agreementId}`).then((r) => r.data),

  /**
   * Get request changes by status
   */
  getByStatus: (status: "pending" | "priced" | "paid") =>
    api.get<{ requestChanges: RequestChange[] }>(`/changes/status/${status}`).then((r) => r.data),
};
