/**
 * User type definitions aligned with server User model
 */

export interface User {
  _id: string;
  walletAddress: string;
  email?: string;
  fullname: string;
  role: "client" | "developer";
  bio: string;
  firstLogin: boolean;
  skills: string[];
  OTP: {
    code: string | null;
    expiresAt: Date | null;
  };
  avatar: string;
  statistics: {
    totalGigs: number;
    completedAgreements: number;
    totalEarned: number;
    totalSpent: number;
  };
  isActive: boolean;
  lastLogin: Date;
  memberSince: Date;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  walletAddress: string;
}

export interface RegisterRequest {
  walletAddress: string;
  email?: string;
  fullname?: string;
  role: "client" | "developer";
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}
