import { api } from "./client";
import type { Transaction, CreateTransactionRequest } from "../types";

/**
 * Transactions API endpoints
 */

export const transactionsApi = {
  /**
   * Get all transactions for the current user
   */
  getAll: () =>
    api.get<{ transactions: Transaction[] }>("/transactions").then((r) => r.data),

  /**
   * Get a single transaction by ID
   */
  getById: (id: string) =>
    api.get<{ transaction: Transaction }>(`/transactions/${id}`).then((r) => r.data),

  /**
   * Create a new transaction
   * Accepts partial payload because the server will fetch blockchain details itself.
   */
  create: (data: Partial<CreateTransactionRequest>) =>
    api.post<{ transaction: Transaction }>("/transactions", data).then((r) => r.data),

  /**
   * Update transaction status
   */
  updateStatus: (id: string, status: string) =>
    api.patch<{ transaction: Transaction }>(`/transactions/${id}/status`, { status }).then((r) => r.data),

  /**
   * Get transactions by agreement ID
   */
  getByAgreement: (agreementId: string) =>
    api.get<{ transactions: Transaction[] }>(`/transactions/agreement/${agreementId}`).then((r) => r.data),

  /**
   * Get transactions by user ID
   */
  getByUser: (userId: string) =>
    api.get<{ transactions: Transaction[] }>(`/transactions/user/${userId}`).then((r) => r.data),
};
