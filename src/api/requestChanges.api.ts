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
    api.get<{ requestChanges: RequestChange[] }>("/request-changes").then((r) => r.data),

  /**
   * Get a single request change by ID
   */
  getById: (id: string) =>
    api.get<{ requestChange: RequestChange }>(`/request-changes/${id}`).then((r) => r.data),

  /**
   * Create a new request change
   */
  create: (data: CreateRequestChangeRequest) =>
    api.post<{ requestChange: RequestChange }>("/request-changes", data).then((r) => r.data),

  /**
   * Update an existing request change
   */
  update: (id: string, data: UpdateRequestChangeRequest) =>
    api.put<{ requestChange: RequestChange }>(`/request-changes/${id}`, data).then((r) => r.data),

  /**
   * Delete a request change
   */
  delete: (id: string) =>
    api.delete(`/request-changes/${id}`).then((r) => r.data),

  /**
   * Get request changes by agreement ID
   */
  getByAgreement: (agreementId: string) =>
    api.get<{ requestChanges: RequestChange[] }>(`/request-changes/agreement/${agreementId}`).then((r) => r.data),

  /**
   * Get request changes by status
   */
  getByStatus: (status: "pending" | "priced" | "paid") =>
    api.get<{ requestChanges: RequestChange[] }>(`/request-changes/status/${status}`).then((r) => r.data),
};
