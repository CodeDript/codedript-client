import { api } from "./client";
import type { LoginRequest, RegisterRequest, AuthResponse, User } from "../types";

/**
 * Authentication API endpoints
 */

export const authApi = {
  /**
   * Register a new user with wallet
   */
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  /**
   * Login with wallet address
   */
  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  /**
   * Get current authenticated user
   */
  getMe: () =>
    api.get<{ success: boolean; message: string; data: { user: User } }>("/auth/me").then((r) => r.data.data),

  /**
   * Logout current user
   */
  logout: () =>
    api.post("/auth/logout").then((r) => r.data),

  /**
   * Update user profile
   */
  updateProfile: (data: Partial<User>) =>
    // Support JSON or multipart/form-data (when uploading avatar)
    ((): Promise<any> => {
      if (data instanceof FormData) {
        return api.put<{ user: User }>("/auth/me", data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then((r) => r.data);
      }
      return api.put<{ user: User }>("/auth/me", data).then((r) => r.data);
    })(),

  /**
   * Request OTP for email authentication
   */
  requestOTP: (data: { email: string }) =>
    api.post<{ message: string; email: string }>("/auth/email/request-otp", data).then((r) => r.data),

  /**
   * Verify OTP for email authentication
   */
  verifyOTP: (data: { email: string; otp: string }) =>
    api.post<AuthResponse>("/auth/email/verify-otp", data).then((r) => r.data),

  /**
   * Login with wallet address
   */
  walletLogin: (data: { walletAddress: string }) =>
    api.post<AuthResponse>("/auth/wallet-login", data).then((r) => r.data),
};
