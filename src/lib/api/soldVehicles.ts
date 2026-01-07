'use client';
import { User } from '@/types';
import axios from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

export const soldVehiclesInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/catSell',
  withCredentials: true,
  headers: {},
});

export interface SoldVehicleData {
  _id: string;
  amount: number;
  sellerId: string;
  dealerID: string;
  name: string;
  email: string;
  contact: string;
  createdAt: string | Date;
  vehicleId?: string;
  vehicle?: {
    _id: string;
    title: string;
    brand: string;
    model: string;
    year?: number;
    price?: number;
    media?: Array<{ url: string }>;
  };
  seller?: {
    _id: string;
    fullName: string;
    email: string;
  };
  dealer?: {
    _id: string;
    fullName: string;
    companyName?: string;
    email: string;
  };
}

export const getSoldVehicles = async (
  page: number,
  limit: number,
  search: string,
  user: User,
): Promise<ApiResponse<PaginatedResponse<SoldVehicleData>>> => {
  // Check for admin role directly (more reliable than permission check)
  if (user?.role?.roleId !== 'admin' && user?.role?.roleId !== 'superAdmin') {
    throw new Error('Unauthorized: Admin access required');
  }
  const response = await soldVehiclesInstance.get(
    `?page=${page}&limit=${limit}&search=${search}`,
  );
  return response.data;
};

