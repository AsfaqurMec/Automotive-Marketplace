'use client';
import axios from 'axios';
import { authorize } from '@/lib/hooks/authorize';
import { User, Lead, ApiResponse, PaginatedResponse } from '../../types';

export const leadsInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/leads',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getExcludeLeads = (page: number, limit: number, search: string, user: User): Promise<ApiResponse<PaginatedResponse<Lead>>> => {
  authorize(user, 'leads', 'view');
  return leadsInstance.get(
    `/getleads-exclude-assigned?page=${page}&limit=${limit}&search=${search}`,
  );
};

export const getLeads = (page: number, limit: number, search: string, user: User): Promise<ApiResponse<PaginatedResponse<Lead>>> => {
  authorize(user, 'leads', 'view');
  return leadsInstance.get(`/getleads?page=${page}&limit=${limit}&search=${search}`);
};

export const createReminder = (data: Partial<Lead>, user: User): Promise<ApiResponse<Lead>> => {
  authorize(user, 'leads', 'remind');
  return leadsInstance.post('/sync-reminder', data);
};

export const assignLeads = (ids: string[], user: User): Promise<ApiResponse<{ success: boolean }>> => {
  authorize(user, 'leads', 'assign');
  return leadsInstance.post('/assign-dealer', { ids, userId: user._id });
};

export const sendEmails = (data: { emails: string[]; subject: string; content: string; leadsIds: string[] }, user: User): Promise<ApiResponse<{ success: boolean }>> => {
  authorize(user,'leads', 'email');
  return leadsInstance.post('/send-notify-email', { data });
};

export const aiAnalyzeLeads = (user: User): Promise<ApiResponse<{
  [x: string]: any; analysis: string
}>> => {
  authorize(user, 'leads', 'view');
  return leadsInstance.post('/ai-analyze');
};

export const createLead = (data: Partial<Lead>): Promise<ApiResponse<Lead>> => {
  //console.log(data);
  return leadsInstance.post('/create', data);
};

export const updateExclusiveLead = async (data: Partial<Lead>): Promise<ApiResponse<Lead>> => {
  return leadsInstance.put('/update-exclusive-lead', data);
};

export const deleteLead = (id: string): Promise<ApiResponse<{ success: boolean }>> => {
  return leadsInstance.post('/delete', { id });
};

export const deleteExclusiveLead = (id: string): Promise<ApiResponse<{ success: boolean }>> => {
  return leadsInstance.post('/delete-exclusive-lead', { id });
};

