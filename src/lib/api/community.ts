'use client';
import axios from 'axios';

const CommunityInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/community-post',
  withCredentials: true,
});

import { CommunityPost, ApiResponse, PaginatedResponse, Comment } from '../../types';

export const createCommunityPost = (data: FormData): Promise<ApiResponse<CommunityPost>> => {
  return CommunityInstance.post('/', data);
};

export const getCommunityPosts = async (data: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<PaginatedResponse<CommunityPost>>> => {
  const res = await CommunityInstance.get(
    `/?page=${data.page}&limit=${data.limit || 10}&searchTerm=${data.search || ''}`,
  );
  return res.data; // ✅ unwrap axios response so React Query only sees the useful part
};

export const likePost = (postid: string): Promise<ApiResponse<{ success: boolean }>> => {
  return CommunityInstance.put(`/${postid}/like`);
};

export const createComment = (data: { postId: string; content: string }): Promise<ApiResponse<Comment>> => {
  return CommunityInstance.post(`/${data.postId}/comment`, { text: data.content });
};

export const getCommunityPostsById = (id: string): Promise<ApiResponse<CommunityPost>> => {
  return CommunityInstance.get(`/${id}`);
};

