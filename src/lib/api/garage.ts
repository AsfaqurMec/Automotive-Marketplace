'use client';
import axios from 'axios';

export const garageInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/garage',
  withCredentials: true,
});

export const createGarage = (data: Record<string, unknown>) => {
  return garageInstance.post('/create-garage', data);
};

export const getGarage = (page: number, limit = 10) => {
  return garageInstance.get(`/list?page=${page}&limit=${limit}`);
};

interface UpdateGarageData {
  id: string;
  data: Record<string, unknown>;
}

export const updateGarage = (data: UpdateGarageData) => {
  return garageInstance.put(`/update-garage/${data.id}`, data.data);
};
export const deleteGarage = (id: string) => {
  return garageInstance.delete(`/delete-garage/${id}`);
};

