/**
 * Route Configuration
 * 
 * Centralized route definitions with protection settings
 */

export interface RouteConfig {
  path: string;
  label: string;
  requireAuth: boolean;
  allowedRoles?: ('client' | 'developer')[];
}

// Public routes - accessible to everyone
export const publicRoutes: RouteConfig[] = [
  { path: '/', label: 'Home', requireAuth: false },
  { path: '/all-gigs', label: 'All Gigs', requireAuth: false },
  { path: '/gigview/:id', label: 'Gig View', requireAuth: false },
  { path: '/coming-soon', label: 'Coming Soon', requireAuth: false },
];

// Protected routes - require authentication
export const protectedRoutes: RouteConfig[] = [
  { path: '/client', label: 'Client Dashboard', requireAuth: true, allowedRoles: ['client'] },
  { path: '/developer', label: 'Developer Dashboard', requireAuth: true, allowedRoles: ['developer'] },
  { path: '/settings', label: 'Settings', requireAuth: true },
  { path: '/contract-processing', label: 'Contract Processing', requireAuth: true },
  { path: '/create-contract', label: 'Create Contract', requireAuth: true, allowedRoles: ['client'] },
  { path: '/create-gig', label: 'Create Gig', requireAuth: true, allowedRoles: ['developer'] },
  { path: '/create-contract/rules', label: 'Contract Rules', requireAuth: true },
  { path: '/create-contract/request-change', label: 'Request Change', requireAuth: true },
  { path: '/create-contract/terms', label: 'Terms & Conditions', requireAuth: true },
];

// All routes combined
export const allRoutes = [...publicRoutes, ...protectedRoutes];

// Helper to check if a route is protected
export const isProtectedRoute = (path: string): boolean => {
  return protectedRoutes.some(route => {
    // Handle dynamic routes
    const pattern = route.path.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
};

// Helper to get route config by path
export const getRouteConfig = (path: string): RouteConfig | undefined => {
  return allRoutes.find(route => {
    const pattern = route.path.replace(/:\w+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(path);
  });
};
