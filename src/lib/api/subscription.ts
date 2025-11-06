'use client';
import axios from 'axios';
import { authorize } from '@/lib/hooks/authorize';

export const subscriptionInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/subscription',
  withCredentials: true,
});

import { Subscription, ApiResponse, User } from '../../types';

export const createSubscription = (data: Partial<Subscription>): Promise<ApiResponse<Subscription>> => {
  return subscriptionInstance.post('/create-subscription', data);
};

// âœ… Add selected subscription to dealer (used on Pay)
export const addSubscription = (data: Partial<Subscription>): Promise<ApiResponse<Subscription>> => {
  return subscriptionInstance.post('/add-subscription', data);
};

export const getSubscriptions = (user: User): Promise<ApiResponse<Subscription[]>> => {
  authorize(user, 'subscription', 'view');
  return subscriptionInstance.get('/');
};

export const updateSubscription = (id: string, data: Partial<Subscription>, user: User): Promise<ApiResponse<Subscription>> => {
  authorize(user, 'subscription', 'manage');
  return subscriptionInstance.put(`/${id}`, data);
};

