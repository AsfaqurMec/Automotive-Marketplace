'use client';
import axios from 'axios';

const ChatInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api/chats',
  withCredentials: true,
});

import { ChatRoom, ApiResponse, User } from '../../types';

export const getChat = (data: { chatId?: string; type?: string; userId: string }): Promise<ApiResponse<ChatRoom[]>> => {
  return ChatInstance.get(
    `/single?chatId=${data?.chatId}&type=${data?.type}&userId=${data?.userId}`,
  );
};

export const getSearchUser = (data: { term: string; currentUserId: string }): Promise<ApiResponse<{ users: User[] }>> => {
  return ChatInstance.get(
    `/search?term=${encodeURIComponent(data?.term)}&&currentUserId=${data?.currentUserId}`,
  );
};

export const getChatList = (userId: string, roleId: string): Promise<ApiResponse<ChatRoom[]>> => {
  return ChatInstance.get(`/list?userId=${userId}&roleId=${roleId}`);
};

export const createChat = async (data: {
  currentUserId: string;
  targetUserId: string;
  chatType: string;
}): Promise<ApiResponse<ChatRoom>> => {
  try {
    return await ChatInstance.post('/create', {
      participants: [data.currentUserId, data.targetUserId],
      type: data.chatType,
      createdBy: data.currentUserId,
    });
  } catch {
    // Fallback: try alternative endpoint if /create doesn't exist
    return await ChatInstance.post('/create-chat', {
      participants: [data.currentUserId, data.targetUserId],
      type: data.chatType,
      createdBy: data.currentUserId,
    });
  }
};

export const deleteChat = (data: {
  chatId: string;
  type: string;
  userId: string;
}): Promise<ApiResponse<{ success: boolean }>> => {
  return ChatInstance.delete(`/${data.chatId}?type=${data.type}&userId=${data.userId}`);
};

