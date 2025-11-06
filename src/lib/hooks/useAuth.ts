/**
 * Authentication Hook - NextDeal Frontend
 *
 * This custom hook provides authentication state management for the NextDeal application.
 * It uses Zustand for state management and handles user login, logout, and profile updates.
 *
 * Features:
 * - User authentication state management
 * - Automatic user data fetching on app initialization
 * - Token-based authentication with secure cookie storage
 * - User profile updates and merging
 * - Loading states for authentication operations
 * - Integration with React Query for data caching
 * - Token expiration validation
 */

'use client';

import { create } from 'zustand';
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getLogout, getUser } from '../api/auth';
import deepMerge from '../utils/deepMerge';

import { User, AuthState, ApiResponse } from '../../types';
import { errorHandler } from '../utils/errorHandler';
import { secureTokenStorage, sessionStorage, tokenUtils } from '../utils/secureStorage';

// Zustand store for authentication state management
const useAuthState = create<AuthState>((set, get) => ({
  user: null, // Current user data
  isGettingLoggedIn: true, // Loading state during initial auth check
  isLoading: false, // Loading state for auth operations

  // Set the initial loading state
  setIsGettingLoggedIn: (val) => {
    set({ isGettingLoggedIn: val });
  },

  // Set loading state for auth operations
  setIsLoading: (val) => {
    set({ isLoading: val });
  },

  // Set user data
  setUser: (user) => {
    set({ user });
  },

  // Update user data by merging with existing data
  updateUser: (userUpdate: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;
    // Deep merge to preserve existing data while updating new fields
    const mergedUser = deepMerge(currentUser as Partial<User>, userUpdate) as unknown as User;
    set({ user: mergedUser });
  },

  // Handle user login with secure token storage
  login: (user, token) => {
    secureTokenStorage.setAuthToken(token);
    //  sessionStorage.setUserStatus('true');
    // if (typeof window !== 'undefined') {
    //   window.sessionStorage.setItem('fromLogin', 'true');
    // }
    set({ user });
  },

  // Mark user status for UI updates
  userStatus: () => {
    sessionStorage.setUserStatus('true');
  },

  // Handle user logout with secure token cleanup
  logout: () => {
    secureTokenStorage.removeAuthToken();
    // secureTokenStorage.removeRefreshToken();
    //sessionStorage.removeUserStatus();
    set({ user: null });
  },
}));

/**
 * Custom authentication hook
 * Provides authentication state and operations throughout the application
 * @returns {Object} Authentication state and methods
 */
const useAuth = () => {
  // Get state and methods from Zustand store
  const {
    user,
    isGettingLoggedIn,
    isLoading,
    setIsGettingLoggedIn,
    setIsLoading,
    setUser,
    login,
    userStatus,
    logout: localLogout,
  } = useAuthState();

  const queryClient = useQueryClient();

  /**
     * Fetch current user data from API
     * Called on app initialization and when user data needs to be refreshed
     */
  const refetchUser = useCallback(async () => {
    setIsLoading(true);

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
      });

      const loggedUser = await Promise.race([
        getUser(),
        timeoutPromise,
      ]);

      const response = loggedUser as ApiResponse<User>;
      if (response?.data) {
        setUser(response.data);
      } else {
        setUser(null); // No user data returned
      }
    } catch (err) {
      // Use centralized error handling
      errorHandler.handleAuthError(err, {
        component: 'useAuth',
        action: 'refetchUser',
        userId: user?._id,
      });
      setUser(null); // Explicitly set to null on error
    } finally {
      setIsGettingLoggedIn(false);
      setIsLoading(false);
    }
  }, [setIsLoading, setUser, setIsGettingLoggedIn, user?._id]);

  // Initialize user data on component mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Only fetch user if there's a valid token
      const token = secureTokenStorage.getAuthToken();
      if (token && !tokenUtils.isTokenExpired(token)) {
        refetchUser();
      } else {
        // No token or expired token, user is not logged in
        if (token && tokenUtils.isTokenExpired(token)) {
          // Clean up expired token
          secureTokenStorage.removeAuthToken();
        }
        setIsGettingLoggedIn(false);
      }
    } else {
      // If not in browser, still need to set loading to false
      setIsGettingLoggedIn(false);
    }
  }, [refetchUser, setIsGettingLoggedIn]);

  return {
    user,
    isGettingLoggedIn,
    isLoading,
    setUser,
    setIsLoading,
    refetchUser,
    login,

    userStatus,
    logout: async () => {
      setIsLoading(true);
      await getLogout();
      localLogout();

      //  Prevent flickering by setting authStatus immediately
      queryClient.setQueryData(['authStatus'], { data: { authenticated: false } });

      //  Optionally revalidate if other components rely on it
      await queryClient.invalidateQueries({ queryKey: ['authStatus'] });

      setIsLoading(false);
    },
  };
};

export default useAuth;

