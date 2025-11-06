'use client';

import axios from 'axios';
import { ApiResponse, PaginatedResponse, Vehicle } from '@/types';

// Removed unused import

export const vehicaleInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/share',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ShareVehicaleApi = {
  getDealerVehicale: async () => {
    const response = await vehicaleInstance.get('/get-dealer-vehicales');
    return response.data;
  },
  getPublicVehicles: async (data: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<PaginatedResponse<Vehicle>>> => {
    const res = await vehicaleInstance.get(
      `/get-public-vehicles?page=${data.page || 1}&limit=${data.limit || 10}&searchTerm=${data.search || ''}`,
    );
    return res.data;
  },
};

