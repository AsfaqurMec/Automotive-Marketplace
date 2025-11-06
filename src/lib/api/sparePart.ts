'use client';
import axios from 'axios';
import { authorize } from '@/lib/hooks/authorize';
import { User } from '@/types';

interface SparePartUpdateData {
  id: string;
  data: Record<string, unknown>;
}

export const sparePartInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/spare-parts',
  withCredentials: true,
  headers: {},
});

export const createSparePart = async (data: Record<string, unknown>, user: User) => {
  await authorize(user, 'spares', 'create');
  return sparePartInstance.post('/', data);
};

export const getSparePart = async (page: number, limit: number = 10, user: User) => {
  await authorize(user, 'spares', 'view');
  return sparePartInstance.get(`/list?page=${page}&limit=${limit}`);
};

export const updateSparePart = async (data: SparePartUpdateData, user: User) => {
  await authorize(user, 'spares', 'edit');
  return sparePartInstance.put(`/${data.id}`, data.data);
};

export const deleteSparePart = async (id: string, user: User) => {
  await authorize(user, 'spares', 'delete');
  return sparePartInstance.delete(`/${id}`);
};

