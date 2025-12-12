import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestChangesApi } from "../api";
import type { CreateRequestChangeRequest, UpdateRequestChangeRequest } from "../types";

/**
 * Query hook to get all request changes
 */
export const useRequestChanges = () => {
  return useQuery({
    queryKey: ["requestChanges"],
    queryFn: requestChangesApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Query hook to get a single request change by ID
 */
export const useRequestChange = (id: string) => {
  return useQuery({
    queryKey: ["requestChanges", id],
    queryFn: () => requestChangesApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Query hook to get request changes by agreement ID
 */
export const useRequestChangesByAgreement = (agreementId: string) => {
  return useQuery({
    queryKey: ["requestChanges", "agreement", agreementId],
    queryFn: () => requestChangesApi.getByAgreement(agreementId),
    enabled: !!agreementId,
  });
};

/**
 * Query hook to get request changes by status
 */
export const useRequestChangesByStatus = (status: "pending" | "priced" | "paid") => {
  return useQuery({
    queryKey: ["requestChanges", "status", status],
    queryFn: () => requestChangesApi.getByStatus(status),
    enabled: !!status,
  });
};

/**
 * Mutation hook to create a new request change
 */
export const useCreateRequestChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequestChangeRequest) => requestChangesApi.create(data),
    onSuccess: () => {
      // Invalidate request changes queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["requestChanges"] });
    },
  });
};

/**
 * Mutation hook to update an existing request change
 */
export const useUpdateRequestChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRequestChangeRequest }) =>
      requestChangesApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific request change and all request changes queries
      queryClient.invalidateQueries({ queryKey: ["requestChanges", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["requestChanges"] });
    },
  });
};

/**
 * Mutation hook to delete a request change
 */
export const useDeleteRequestChange = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => requestChangesApi.delete(id),
    onSuccess: () => {
      // Invalidate all request changes queries
      queryClient.invalidateQueries({ queryKey: ["requestChanges"] });
    },
  });
};
