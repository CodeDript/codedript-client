/**
 * Navigation utility for programmatic routing
 * Provides a simple way to navigate between pages from anywhere in the app
 */

type NavigateFunction = (path: string, options?: { replace?: boolean }) => void;

class NavigationService {
  private navigate: NavigateFunction | null = null;

  /**
   * Set the navigate function from useNavigate hook
   * Call this once in your App component
   */
  setNavigate(navigateFn: NavigateFunction) {
    this.navigate = navigateFn;
  }

  /**
   * Navigate to a route
   * @param path - Route path (e.g., '/login', '/dashboard')
   * @param replace - Replace current history entry instead of pushing new one
   */
  go(path: string, replace: boolean = false) {
    if (this.navigate) {
      this.navigate(path, { replace });
    } else {
      // Fallback to window.location if navigate not set
      if (replace) {
        window.location.replace(path);
      } else {
        window.location.href = path;
      }
    }
  }

  /**
   * Navigate back in history
   */
  back() {
    window.history.back();
  }

  /**
   * Navigate forward in history
   */
  forward() {
    window.history.forward();
  }

  /**
   * Replace current route
   */
  replace(path: string) {
    this.go(path, true);
  }
}

// Export singleton instance
export const navigation = new NavigationService();

/**
 * Helper functions for common routes
 */
export const routes = {
  home: () => navigation.go('/'),
  login: () => navigation.go('/login'),
  allGigs: () => navigation.go('/all-gigs'),
  gigView: (id: string) => navigation.go(`/gig/${id}`),
  createGig: () => navigation.go('/create-gig'),
  agreements: () => navigation.go('/agreements'),
  agreementView: (id: string) => navigation.go(`/agreement/${id}`),
  profile: () => navigation.go('/profile'),
  dashboard: (role: 'client' | 'developer') => navigation.go(`/dashboard/${role}`),
  notFound: () => navigation.go('/404'),
};
