'use client';
import axios from 'axios';
import { authorize } from '@/lib/hooks/authorize';
import { User } from '@/types';

export const usersInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/users',
  withCredentials: true,
});

export const getCustomer = async (page: number, limit: number, search: string, user: User) => {
  authorize(user, 'adminPanel', 'viewUser');
  return usersInstance.get(`/customers?page=${page}&limit=${limit}&search=${search}`);
};

export const getDealers = async (page: number, limit: number, search: string, user: User) => {
  authorize(user, 'adminPanel', 'viewDealer');
  return usersInstance.get(`/dealers?page=${page}&limit=${limit}&search=${search}`);
};

interface UpdateCustomerData {
  id: string;
  data: Record<string, unknown>;
}

export const updateCustomer = async (data: UpdateCustomerData, user: User) => {
  authorize(user, 'users', 'manage');
  return usersInstance.put(`/customer/${data.id}`, data.data);
};

export const deleteCustomer = async (id: string, user: User) => {
  authorize(user, 'adminPanel', 'deleteUser');
  return usersInstance.delete(`/customer/${id}`);
};

export const updateDealer = async ({ data, user }: { data: Record<string, unknown>; user: User }) => {
  //authorize(user, 'users', 'manage');

  return usersInstance.put(`/dealer/${data._id}`, data);
};

export const deleteDealer = async (id: string, user: User) => {
  authorize(user, 'adminPanel', 'deleteDealer');
  return usersInstance.delete(`/dealer/${id}`);
};

export const createDealer = async (data: Record<string, unknown>, user: User) => {
  authorize(user, 'users', 'manage');
  return usersInstance.post('/create-dealer', data);
};

export const createCustomer = async (data: Record<string, unknown>, user: User) => {
  authorize(user, 'users', 'manage');
  return usersInstance.post('/create-customer', data);
};

// Get user by ID (for fetching dealer or customer data)
export const getUserById = async (id: string): Promise<{ data: User }> => {
  return usersInstance.get(`/${id}`);
};

