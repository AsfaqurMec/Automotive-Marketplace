/**
 * Secure Storage Utility
 * Provides secure alternatives to localStorage for sensitive data
 */

import Cookies from 'js-cookie';

// Token storage configuration
const TOKEN_CONFIG = {
  name: 'nextdeal-token',
  expires: 1, // 1 day
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const,
  path: '/',
};

const REFRESH_TOKEN_CONFIG = {
  name: 'nextdeal-refresh-token',
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const,
  path: '/',
};

const GOOGLE_ACCESS_TOKEN_CONFIG = {
  name: 'google_calender_accessToken',
  expires: 1, // 1 day (Google tokens typically expire in 1 hour)
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const,
  path: '/',
};

const GOOGLE_REFRESH_TOKEN_CONFIG = {
  name: 'google_calender_refreshToken',
  expires: 30, // 30 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Strict' as const,
  path: '/',
};

/**
 * Secure token storage using httpOnly-like cookies
 */
export const secureTokenStorage = {
  // JWT Token management
  setAuthToken: (token: string): void => {
    Cookies.set(TOKEN_CONFIG.name, token, TOKEN_CONFIG);
  },

  getAuthToken: (): string | undefined => {
    return Cookies.get(TOKEN_CONFIG.name);
  },

  removeAuthToken: (): void => {
    Cookies.remove(TOKEN_CONFIG.name, { path: TOKEN_CONFIG.path });
  },

  // Refresh token management
  setRefreshToken: (token: string): void => {
    Cookies.set(REFRESH_TOKEN_CONFIG.name, token, REFRESH_TOKEN_CONFIG);
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_CONFIG.name);
  },

  removeRefreshToken: (): void => {
    Cookies.remove(REFRESH_TOKEN_CONFIG.name, { path: REFRESH_TOKEN_CONFIG.path });
  },

  // Google Calendar token management
  setGoogleAccessToken: (token: string): void => {
    Cookies.set(GOOGLE_ACCESS_TOKEN_CONFIG.name, token, GOOGLE_ACCESS_TOKEN_CONFIG);
  },

  getGoogleAccessToken: (): string | undefined => {
    return Cookies.get(GOOGLE_ACCESS_TOKEN_CONFIG.name);
  },

  removeGoogleAccessToken: (): void => {
    Cookies.remove(GOOGLE_ACCESS_TOKEN_CONFIG.name, { path: GOOGLE_ACCESS_TOKEN_CONFIG.path });
  },

  setGoogleRefreshToken: (token: string): void => {
    Cookies.set(GOOGLE_REFRESH_TOKEN_CONFIG.name, token, GOOGLE_REFRESH_TOKEN_CONFIG);
  },

  getGoogleRefreshToken: (): string | undefined => {
    return Cookies.get(GOOGLE_REFRESH_TOKEN_CONFIG.name);
  },

  removeGoogleRefreshToken: (): void => {
    Cookies.remove(GOOGLE_REFRESH_TOKEN_CONFIG.name, { path: GOOGLE_REFRESH_TOKEN_CONFIG.path });
  },

  // Clear all tokens
  clearAllTokens: (): void => {
    secureTokenStorage.removeAuthToken();
    secureTokenStorage.removeRefreshToken();
    secureTokenStorage.removeGoogleAccessToken();
    secureTokenStorage.removeGoogleRefreshToken();
  },
};

/**
 * Session storage for non-sensitive data that should persist only for the current tab
 */
export const sessionStorage = {
  setUserStatus: (status: string): void => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('user-status', status);
    }
  },

  getUserStatus: (): string | null => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem('user-status');
    }
    return null;
  },

  removeUserStatus: (): void => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('user-status');
    }
  },
};

/**
 * Safe localStorage for non-sensitive preferences
 * Only use for UI preferences, not for tokens or sensitive data
 */
export const safeLocalStorage = {
  setTheme: (theme: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('color-mode', theme);
    }
  },

  getTheme: (): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('color-mode');
    }
    return null;
  },

  setLanguage: (lang: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('i18nextLng', lang);
    }
  },

  getLanguage: (): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('i18nextLng');
    }
    return null;
  },

  setDeleteCount: (count: string): void => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('deleteCount', count);
    }
  },

  getDeleteCount: (): string | null => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('deleteCount');
    }
    return null;
  },
};

/**
 * Token validation utility
 */
export const tokenUtils = {
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // Invalid token format
    }
  },

  getTokenExpiration: (token: string): Date | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  },
};
