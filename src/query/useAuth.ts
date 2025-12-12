import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api";
import type { LoginRequest, RegisterRequest } from "../types";

/**
 * Query hook to get current authenticated user
 */
export const useAuth = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Mutation hook for user registration
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      // Save token to localStorage if present
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

/**
 * Mutation hook for user login
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      // Save token to localStorage if present
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

/**
 * Mutation hook for user logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Remove token from localStorage
      localStorage.removeItem("token");
      // Clear all cached queries
      queryClient.clear();
    },
  });
};

/**
 * Mutation hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<any>) => authApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
