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
    api.get<{ user: User }>("/auth/me").then((r) => r.data),

  /**
   * Logout current user
   */
  logout: () =>
    api.post("/auth/logout").then((r) => r.data),

  /**
   * Update user profile
   */
  updateProfile: (data: Partial<User>) =>
    api.put<{ user: User }>("/auth/profile", data).then((r) => r.data),
};
