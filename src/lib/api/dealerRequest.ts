'use client';
import axios from 'axios';
import { User } from '@/types';

export const dealerRequestInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/dealer-requests',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DealerRequest {
  _id: string;
  dealer: string | {
    _id: string;
    fullName?: string;
    email?: string;
    companyName?: string;
    status?: string;
  };
  data: {
    password?: string;
    email: string;
    fullName: string;
    lastName?: string;
    firstName?: string;
    bankAccountInfo?: string;
    status?: string;
    type?: string;
    companyName?: string;
    [key: string]: unknown;
  };
  documents: Array<{
    key: string;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
    publicId: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface DealerRequestResponse {
  success: boolean;
  data: DealerRequest[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface SingleDealerRequestResponse {
  success: boolean;
  data: DealerRequest;
}

export const getDealerRequests = async (
  page: number,
  limit: number,
  search?: string,
  status?: string,
  user?: User
) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    params.append('search', search);
  }
  
  if (status) {
    params.append('status', status);
  }

  return dealerRequestInstance.get<DealerRequestResponse>(`/?${params.toString()}`);
};

export const getDealerRequestById = async (id: string): Promise<{ data: SingleDealerRequestResponse }> => {
  return dealerRequestInstance.get(`/${id}`);
};

export const updateDealerRequestStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  user?: User
): Promise<{ data: SingleDealerRequestResponse }> => {
  return dealerRequestInstance.put(`/${id}`, { status });
};

export const deleteDealerRequest = async (
  id: string,
  user?: User
): Promise<{ data: { success: boolean; message: string } }> => {
  return dealerRequestInstance.delete(`/${id}`);
};





