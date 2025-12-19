/**
 * Navigation Utility - Usage Examples
 * 
 * Simple and efficient way to navigate between pages from anywhere in your app
 */

import { navigation, routes } from '../utils/navigation';

// ============================================
// 1. BASIC NAVIGATION - Use anywhere in your app
// ============================================

// Navigate to a route (simple)
navigation.go('/all-gigs');
navigation.go('/dashboard');
navigation.go('/profile');

// Navigate to a route with parameter
navigation.go('/gig/123');
navigation.go('/agreement/456');

// Replace current route (no back navigation)
navigation.replace('/login');

// Go back
navigation.back();

// ============================================
// 2. USING HELPER ROUTES (recommended)
// ============================================

routes.home();              // Navigate to '/'
routes.login();             // Navigate to '/login'
routes.allGigs();           // Navigate to '/all-gigs'
routes.gigView('123');      // Navigate to '/gig/123'
routes.agreementView('456'); // Navigate to '/agreement/456'
routes.dashboard('client'); // Navigate to '/dashboard/client'

// ============================================
// 3. IN COMPONENTS
// ============================================

function MyComponent() {
  const handleViewGig = (gigId: string) => {
    routes.gigView(gigId);
  };

  const handleLogin = () => {
    routes.login();
  };

  return (
    <div>
      <button onClick={() => routes.allGigs()}>View All Gigs</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => handleViewGig('123')}>View Gig</button>
    </div>
  );
}

// ============================================
// 4. IN API CALLS / MUTATIONS
// ============================================

import { useCreateAgreement } from '../query/useAgreements';
import { useAuthContext } from '../context/AuthContext';

function CreateAgreementComponent() {
  const createMutation = useCreateAgreement();

  const handleCreate = async (payload: any) => {
    try {
      const result = await createMutation.mutateAsync(payload);
      // Navigate after successful creation (example fallback)
      routes.home();
    } catch (error) {
      // Error handled silently
    }
  };

  const sampleData = {};

  return <button onClick={() => handleCreate(sampleData)}>Create</button>;
}

// ============================================
// 5. IN EVENT HANDLERS
// ============================================

const handleCardClick = (gigId: string) => {
  navigation.go(`/gig/${gigId}`);
};

const handleBackButton = () => {
  navigation.back();
};

const handleCancel = () => {
  navigation.replace('/dashboard'); // Can't go back
};

// ============================================
// 6. IN UTILITIES / SERVICES
// ============================================

// In a utility function
export const handleUnauthorized = () => {
  localStorage.removeItem('token');
  routes.login();
};

// In an error handler
export const handlePaymentSuccess = () => {
  routes.dashboard('client');
};

// ============================================
// 7. CONDITIONAL NAVIGATION
// ============================================

const handleSubmit = (userRole: string) => {
  if (userRole === 'client') {
    routes.dashboard('client');
  } else {
    routes.dashboard('developer');
  }
};

// ============================================
// 8. WITH QUERY PARAMS (manual)
// ============================================

navigation.go('/search?query=web-development&min=100');
navigation.go('/gig/123?tab=reviews');

// ============================================
// 9. PROGRAMMATIC REDIRECTS
// ============================================

// After login
const handleLoginSuccess = () => {
  const returnUrl = localStorage.getItem('returnUrl') || '/dashboard';
  navigation.go(returnUrl);
  localStorage.removeItem('returnUrl');
};

// Protected route check
const checkAuth = () => {
  const isAuthenticated = localStorage.getItem('token');
  if (!isAuthenticated) {
    localStorage.setItem('returnUrl', window.location.pathname);
    routes.login();
  }
};

// ============================================
// 10. IN HOOKS
// ============================================

import { useEffect } from 'react';

function useAutoRedirect(condition: boolean, path: string) {
  useEffect(() => {
    if (condition) {
      navigation.go(path);
    }
  }, [condition, path]);
}

// Usage
function MyPage() {
  const { user } = useAuthContext();

  // Redirect if not authenticated
  useAutoRedirect(!user, '/login');

  return <div>Protected Content</div>;
}

export default {};
