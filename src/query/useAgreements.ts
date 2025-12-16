import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { agreementsApi } from "../api";
import type { CreateAgreementRequest, UpdateAgreementRequest } from "../types";

/**
 * Query hook to get all agreements
 */
export const useAgreements = () => {
  return useQuery({
    queryKey: ["agreements"],
    queryFn: agreementsApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Query hook to get agreements for the authenticated user
 */
export const useUserAgreements = () => {
  return useQuery({
    queryKey: ["agreements", "user"],
    queryFn: agreementsApi.getUserAgreements,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Query hook to get a single agreement by ID
 */
export const useAgreement = (id: string) => {
  return useQuery({
    queryKey: ["agreements", id],
    queryFn: () => agreementsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Query hook to get agreements by customer ID
 */
export const useAgreementsByClient = (clientId: string) => {
  return useQuery({
    queryKey: ["agreements", "client", clientId],
    queryFn: () => agreementsApi.getByClient(clientId),
    enabled: !!clientId,
  });
};

/**
 * Query hook to get agreements by developer ID
 */
export const useAgreementsByDeveloper = (developerId: string) => {
  return useQuery({
    queryKey: ["agreements", "developer", developerId],
    queryFn: () => agreementsApi.getByDeveloper(developerId),
    enabled: !!developerId,
  });
};

/**
 * Mutation hook to create a new agreement
 */
export const useCreateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgreementRequest) => agreementsApi.create(data),
    onSuccess: () => {
      // Invalidate agreements queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["agreements"] });
      // Also invalidate user-specific agreements cache so tables refresh immediately
      queryClient.invalidateQueries({ queryKey: ["agreements", "user"] });
    },
  });
};

/**
 * Mutation hook to update an existing agreement
 */
export const useUpdateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAgreementRequest }) =>
      agreementsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific agreement and all agreements queries
      queryClient.invalidateQueries({ queryKey: ["agreements", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["agreements"] });
    },
  });
};

/**
 * Mutation hook to delete an agreement
 */
export const useDeleteAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => agreementsApi.delete(id),
    onSuccess: () => {
      // Invalidate all agreements queries
      queryClient.invalidateQueries({ queryKey: ["agreements"] });
    },
  });
};

/**
 * Mutation hook to update agreement status
 */
export const useUpdateAgreementStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, totalValue }: { id: string; status: string; totalValue?: number }) =>
      agreementsApi.updateStatus(id, status, totalValue),
    onSuccess: (_, variables) => {
      // Invalidate specific agreement and all agreements queries
      queryClient.invalidateQueries({ queryKey: ["agreements", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["agreements"] });
    },
  });
};

/**
 * Mutation hook to deploy agreement to blockchain
 */
export const useDeployAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => agreementsApi.deploy(id),
    onSuccess: (_, id) => {
      // Invalidate specific agreement and all agreements queries
      queryClient.invalidateQueries({ queryKey: ["agreements", id] });
      queryClient.invalidateQueries({ queryKey: ["agreements"] });
    },
  });
};
