'use client';
import { ApiResponse, Dealer } from '@/types';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const authInstance = axios.create({
  //  baseURL: `http://localhost:8080/api/dealer`,

  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/dealer',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const getDealer = () => {
  return authInstance.get('/top');
};

// Fetch all dealers (paginated, for sidebar, etc)
export const getDealers = (params = {}) => {
  // params can include page, limit, search, sortBy
  return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/dealers`, {
    params,
    withCredentials: true,
  });
};

export const getDashboardSummary = async (userId?: string) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const response = await axios.get(
      `${apiUrl}/api/dealer/dashboard/summary`,
      { 
        params: userId ? { userId } : {},
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Dashboard summary API error:', error);
    // Return mock data if API fails
    return {
      totalDealer: 25,
      totalUser: 150,
      totalSales: 89,
      totalPending: 12,
      totalEarnings: 12500,
    };
  }
};

// Get dashboard statistics based on user role
export const getDashboardStats = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`,
    { withCredentials: true }
  );
  return response.data;
};

// Get sales data for charts
export const getSalesData = async (period: string = '6months') => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/sales`,
    { 
      params: { period },
      withCredentials: true 
    }
  );
  return response.data;
};

// Get vehicle brand statistics
export const getVehicleBrandStats = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/vehicle-brands`,
    { withCredentials: true }
  );
  return response.data;
};

// Get vehicle status statistics
export const getVehicleStatusStats = async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/vehicle-status`,
    { withCredentials: true }
  );
  return response.data;
};

export const getDealerById = (id: string): Promise<ApiResponse<Dealer>> => {
 // console.log('id', id);
  return authInstance.get(`/${id}`);
};

