import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: ('client' | 'developer')[];
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication or specific roles
 * 
 * @param children - The component to render if authorized
 * @param requireAuth - Whether authentication is required (default: true)
 * @param allowedRoles - Array of roles allowed to access this route
 * @param redirectTo - Where to redirect if unauthorized (default: '/')
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles,
  redirectTo = '/',
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthContext();

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role requirement
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
