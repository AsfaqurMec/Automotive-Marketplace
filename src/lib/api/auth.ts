/**
 * Authentication API Module - NextDeal Frontend
 *
 * This module contains all authentication-related API calls for the NextDeal application.
 * It handles user login, registration, password management, and user profile updates.
 *
 * Features:
 * - User authentication (login/logout)
 * - User registration and profile management
 * - Password reset and change functionality
 * - Google OAuth integration
 * - Token management and refresh
 * - Multipart form data support for file uploads
 */

'use client';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { toast } from 'react-toastify';
dotenv.config();

// Axios instance for JSON requests (login, registration, etc.)
const authInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Axios instance for multipart form data (file uploads, profile updates)
const authInstances = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/auth',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true, // Include cookies in requests
});

/**
 * Get current user information
 * @returns {Promise<Object>} User data or authentication status
 */
export const getUser = async (): Promise<object> => {
  try {
    const response = await authInstance.get('/');
    return { data: response.data };
  } catch (error: unknown) {
    // Handle 401 (Unauthorized) gracefully - user is not logged in
    if (error instanceof AxiosError && error.response?.status === 401) {
      return { data: { authenticated: false } };
    }
    throw error; // Re-throw other errors for handling by caller
  }
};

/**
 * User login
 * @param {Object} data - Login credentials (email, password)
 * @returns {Promise<Object>} Login response with user data and token
 */
export const getLogin = (data: object): Promise<object> => {
  return authInstance.post('/login', data);
};

/**
 * User registration
 * @param {Object} data - Registration data (name, email, password, etc.)
 * @returns {Promise<Object>} Registration response
 */
export const signup = (data: object): Promise<object> => {
  return authInstance.post('/register', data);
};

/**
 * Google OAuth login
 * @param {string} token - Google OAuth token
 * @returns {Promise<Object>} Login response with user data
 */
export const googleLogin = (token: string): Promise<object> => {
  return authInstance.post('/google-login', { token });
};

/**
 * User logout
 * @returns {Promise<Object>} Logout response
 */
export const getLogout = (): Promise<object> => {
  return authInstance.get('/logout');
};

/**
 * Request password reset
 * @param {Object} data - Object containing email address
 * @returns {Promise<Object>} Password reset request response
 */
export const forgetPassword = (data: { email: string }): Promise<object> => {
  return authInstance.post('/forgot-password', { email: data.email });
};

/**
 * Change user password
 * @param {Object} data - Password change data (current password, new password)
 * @returns {Promise<Object>} Password change response
 */
export const changePassword = (data: object): Promise<object> => {
  return authInstance.put('/change-password', data);
};

/**
 * Update user profile information
 * @param {FormData} data - User profile data (may include file uploads)
 * @returns {Promise<Object>} Profile update response
 */
export const updateUser = (data: FormData): Promise<object> => {
 // console.log('data', data);
  return authInstances.put('/update-user', data);
};

/**
 * Reset password with token
 * @param {Object} data - Reset password data (token, new password)
 * @returns {Promise<Object>} Password reset response
 */
export const resetPassword = (data: object): Promise<object> => {
  return authInstance.post('/reset-password', data);
};

import { secureTokenStorage } from '../utils/secureStorage';

/**
 * Refresh Google Calendar access token
 * Uses stored refresh token to get a new access token
 * @returns {Promise<void>}
 */
export const refreshAccessToken = async (): Promise<void> => {
  const refreshToken = secureTokenStorage.getGoogleRefreshToken();

  if (!refreshToken) {
    toast.error('No refresh token available');
    return;
  }

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', null, {
      params: {
        client_id: process.env.NEXT_PUBLIC_Google_Client_id,
        client_secret: process.env.NEXT_PUBLIC_Google_Client_Secret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      },
    });

    const { access_token } = response.data;

    // Store the new access token securely
    secureTokenStorage.setGoogleAccessToken(access_token);
  } catch {
    // Show error notification if token refresh fails
    toast.error('Failed to refresh Google Calendar access token');
  }
};

