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
    onSuccess: (response: any) => {
      // Support both flat and nested response shapes
      const token = response?.token || response?.data?.token;
      if (token) localStorage.setItem("token", token);
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
    onSuccess: (response: any) => {
      const token = response?.token || response?.data?.token;
      if (token) localStorage.setItem("token", token);
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

/**
 * Mutation hook to request OTP for email authentication
 */
export const useRequestOTP = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => authApi.requestOTP(data),
  });
};

/**
 * Mutation hook to verify OTP for email authentication
 */
export const useVerifyOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => authApi.verifyOTP(data),
    onSuccess: (response: any) => {
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};

/**
 * Mutation hook for wallet login
 */
export const useWalletLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { walletAddress: string }) => authApi.walletLogin(data),
    onSuccess: (response: any) => {
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};
