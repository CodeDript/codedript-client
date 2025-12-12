import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gigsApi } from "../api";
import type { CreateGigRequest, UpdateGigRequest } from "../types";

/**
 * Query hook to get all gigs with optional filters
 */
export const useGigs = (params?: {
  isActive?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["gigs", params],
    queryFn: () => gigsApi.getAll(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Query hook to get a single gig by ID
 */
export const useGig = (id: string) => {
  return useQuery({
    queryKey: ["gigs", id],
    queryFn: () => gigsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Query hook to get gigs by developer ID
 */
export const useGigsByDeveloper = (developerId: string) => {
  return useQuery({
    queryKey: ["gigs", "developer", developerId],
    queryFn: () => gigsApi.getByDeveloper(developerId),
    enabled: !!developerId,
  });
};

/**
 * Mutation hook to create a new gig
 */
export const useCreateGig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGigRequest) => gigsApi.create(data),
    onSuccess: () => {
      // Invalidate gigs queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
    },
  });
};

/**
 * Mutation hook to update an existing gig
 */
export const useUpdateGig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGigRequest }) =>
      gigsApi.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific gig and all gigs queries
      queryClient.invalidateQueries({ queryKey: ["gigs", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
    },
  });
};

/**
 * Mutation hook to delete a gig
 */
export const useDeleteGig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gigsApi.delete(id),
    onSuccess: () => {
      // Invalidate all gigs queries
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
    },
  });
};
