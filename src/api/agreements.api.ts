import { api } from "./client";
import type { Agreement, CreateAgreementRequest, UpdateAgreementRequest } from "../types";

/**
 * Agreements API endpoints
 */

export const agreementsApi = {
  /**
   * Get all agreements for the current user
   */
  getAll: () =>
    api.get<{ agreements: Agreement[] }>("/agreements").then((r) => r.data),

  /**
   * Get a single agreement by ID
   */
  getById: (id: string) =>
    api.get<{ agreement: Agreement }>(`/agreements/${id}`).then((r) => r.data),

  /**
   * Create a new agreement
   */
  create: (data: CreateAgreementRequest | FormData) =>
    api.post<{ success: boolean; message: string; data: { agreement: Agreement } }>("/agreements", data).then((r) => r.data),

  /**
   * Update an existing agreement
   */
  update: (id: string, data: UpdateAgreementRequest) =>
    api.put<{ agreement: Agreement }>(`/agreements/${id}`, data).then((r) => r.data),

  /**
   * Delete an agreement
   */
  delete: (id: string) =>
    api.delete(`/agreements/${id}`).then((r) => r.data),

  /**
   * Update agreement status
   */
  updateStatus: (id: string, status: string) =>
    api.patch<{ agreement: Agreement }>(`/agreements/${id}/status`, { status }).then((r) => r.data),

  /**
   * Deploy agreement to blockchain
   */
  deploy: (id: string) =>
    api.post<{ agreement: Agreement; txHash: string }>(`/agreements/${id}/deploy`).then((r) => r.data),

  /**
   * Get agreements by customer ID
   */
  getByClient: (clientId: string) =>
    api.get<{ agreements: Agreement[] }>(`/agreements/client/${clientId}`).then((r) => r.data),

  /**
   * Get agreements by developer ID
   */
  getByDeveloper: (developerId: string) =>
    api.get<{ agreements: Agreement[] }>(`/agreements/developer/${developerId}`).then((r) => r.data),
};
