import { User, ChatRoom } from '@/types';

// Define proper interfaces for chat components
export interface ChatMessage {
    _id: string;
    tempId?: string;
    chatId?: string;
    sender: {
        _id: string;
        fullName?: string;
        profileImageUrl?: string;
    } | 'ai';
    content: string;
    type: 'text' | 'image' | 'file';
    createdAt: string;
    isLoading?: boolean;
    fileUrl?: string;
    fileName?: string;
    messages?: ChatMessage[];
}

export interface ChatDetails extends ChatRoom {
    _id: string;
    type: 'd2d' | 'ai' | 'd2c';
    isNewChatContext?: boolean;
    assistant?: User;
    dealer?: User;
    customer?: User;
    dealers?: User[];
}

export interface EmojiData {
    emoji: string;
}

export interface MessagePayload {
    senderId: string;
    senderRole?: string;
    chatType?: string;
    tempId: string;
    content: string;
    chatId?: string;
}

export interface AiMessagePayload {
    senderId: string;
    content: string;
    tempId: string;
    assistantId: string;
}
