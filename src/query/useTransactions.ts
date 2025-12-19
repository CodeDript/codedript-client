import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "../api";
import type { CreateTransactionRequest } from "../types";

/**
 * Query hook to get all transactions
 */
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: transactionsApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Query hook to get a single transaction by ID
 */
export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Query hook to get transactions by agreement ID
 */
export const useTransactionsByAgreement = (agreementId: string) => {
  return useQuery({
    queryKey: ["transactions", "agreement", agreementId],
    queryFn: () => transactionsApi.getByAgreement(agreementId),
    enabled: !!agreementId,
  });
};

/**
 * Query hook to get transactions by user ID
 */
export const useTransactionsByUser = (userId: string) => {
  return useQuery({
    queryKey: ["transactions", "user", userId],
    queryFn: () => transactionsApi.getByUser(userId),
    enabled: !!userId,
  });
};

/**
 * Mutation hook to create a new transaction
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionsApi.create(data),
    onSuccess: () => {
      // Invalidate transactions queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};

/**
 * Mutation hook to update transaction status
 */
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      transactionsApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidate specific transaction and all transactions queries
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
