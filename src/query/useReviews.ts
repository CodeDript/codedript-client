import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateReviewRequest } from "../types";
import { reviewsApi } from "../api";

/**
 * Query hook to get all reviews
 */
export const useReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: reviewsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Query hook to get a single review by ID
 */
export const useReview = (id: string) => {
  return useQuery({
    queryKey: ["reviews", id],
    queryFn: () => reviewsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Query hook to get reviews by gig ID
 */
export const useReviewsByGig = (gigId: string) => {
  return useQuery({
    queryKey: ["reviews", "gig", gigId],
    queryFn: () => reviewsApi.getByGig(gigId),
    enabled: !!gigId,
  });
};

/**
 * Query hook to get reviews by developer ID
 */
export const useReviewsByDeveloper = (developerId: string) => {
  return useQuery({
    queryKey: ["reviews", "developer", developerId],
    queryFn: () => reviewsApi.getByDeveloper(developerId),
    enabled: !!developerId,
  });
};

/**
 * Mutation hook to create a new review
 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewsApi.create(data),
    onSuccess: () => {
      // Invalidate reviews queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
