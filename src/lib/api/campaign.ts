'use client';
import axios from 'axios';
import { authorize } from '@/lib/hooks/authorize';

const campaignInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/campaign',
  withCredentials: true,
});

import { Campaign, ApiResponse, User } from '../../types';

export const getTokens = (data: { dealerId: string }): Promise<ApiResponse<{ tokens: string[] }>> => {
  return campaignInstance.post('/exchange-code', { code: data });
};

export const createAds = (data: Partial<Campaign>, user: User): Promise<ApiResponse<Campaign>> => {
  authorize(user, 'ads', 'create');
  return campaignInstance.post('/create-ads', data);
};

export const getCampaigns = (dealerId: string, user: User): Promise<ApiResponse<Campaign[]>> => {
  authorize(user, 'ads', 'view');
  return campaignInstance.get(`/dealer/${dealerId}/with-stats`);
};

