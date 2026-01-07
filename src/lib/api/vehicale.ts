'use client';
import { authorize } from '@/lib/hooks/authorize';
import { User } from '@/types';

import axios from 'axios';

export const vehicaleInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/vehicale',
  withCredentials: true,
  headers: {},
});

export const vehicaleApi = {
  getAllVehicale: async (user: User) => {
    authorize(user, 'car', 'view');
    const response = await vehicaleInstance.get('/get-vehicales');
    return response.data;
  },
  getAllPublicVehicale: async () => {
   // authorize(user, 'car', 'view');
  // console.log('getAllPublicVehicale');
    const response = await vehicaleInstance.get('/get-public-vehicles');
    return response.data;
  },
  getDealerVehicale: async () => {
    const response = await vehicaleInstance.get('/get-dealer-vehicales');
    return response.data;
  },

  getVehicaleBySlug: async (slug: string, user: User) => {
    authorize(user, 'car', 'view');
    const response = await vehicaleInstance.get(`/${slug}`);
    return response.data;
  },

  getVehicaleById: async (id: string) => {
    const response = await vehicaleInstance.get(`/${id}`);
    return response.data;
  },

  createVehicale: async (data: FormData, user: User) => {
     authorize(user, 'car', 'create');
     const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    const response = await vehicaleInstance.post('/', data, config);
    return response.data;
  },

  updateVehicale: async ({ id, data, user }: { id: string, data: FormData, user: User }) => {
    authorize(user, 'car', 'edit');
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await vehicaleInstance.put(`/${id}`, data, config);
    return response.data;
  },

  updateVehiclePublic: async (data: Record<string, unknown>) => {
    try {
      const response = await vehicaleInstance.put('/public', data);

      // If your backend sends custom status or success flags, check them here
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error('Non-200 response');
      }
    } catch (error) {
      throw error; // Ensure the mutation registers it as an error
    }
  },

  deleteVehicale: async (id: string, user: User) => {
    authorize(user, 'car', 'delete');
    const response = await vehicaleInstance.delete(`/${id}`);
    return response.data;
  },

  getVehicaleByUserId: async (userId: string, user: User) => {
    authorize(user, 'car', 'view');
    const response = await vehicaleInstance.get(`/user/${userId}`);
    return response.data;
  },

  searchVehicales: async (query: string, user: User) => {
    authorize(user, 'car', 'view');
    const response = await vehicaleInstance.get('/search', { params: { query } });
    return response.data;
  },

  filterVehicales: async (filters: Record<string, unknown>, user: User) => {
    authorize(user, 'car', 'view');
    const response = await vehicaleInstance.get('/filter', { params: filters });
    return response.data;
  },

  updateVehicleStatus: async ({ id, status, user }: { id: string, status: string, user: User }) => {
    authorize(user, 'car', 'edit');
    const response = await vehicaleInstance.patch(`/${id}/status`, { status });
    return response.data;
  },

  markVehicleAsSold: async ({ id, soldData, user }: { id: string, soldData: Record<string, unknown>, user: User }) => {
    console.log('markVehicleAsSold API called', { id, soldData, user });
    authorize(user, 'car', 'edit');
    console.log('Making POST request to:', `/${id}/sold`);
    const response = await vehicaleInstance.post(`/${id}/sold`, soldData);
    console.log('API response:', response.data);
    return response.data;
  },
};

