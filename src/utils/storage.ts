/**
 * Storage utilities for managing localStorage
 */

export const storage = {
  /**
   * Save token to localStorage
   */
  saveToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  /**
   * Get token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  /**
   * Remove token from localStorage
   */
  removeToken: () => {
    localStorage.removeItem("token");
  },

  /**
   * Save user data to localStorage
   */
  saveUser: (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
  },

  /**
   * Get user data from localStorage
   */
  getUser: (): any | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Remove user data from localStorage
   */
  removeUser: () => {
    localStorage.removeItem("user");
  },

  /**
   * Clear all data from localStorage
   */
  clearAll: () => {
    localStorage.clear();
  },
};
