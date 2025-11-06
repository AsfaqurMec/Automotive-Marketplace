'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Menu,
  MenuItem,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachmentIcon from '@mui/icons-material/Attachment';
import MoodIcon from '@mui/icons-material/Mood';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';

import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getChat } from '@/lib/api/chat';
import useSocket from '@/lib/utils/useSocket';
import useAuth from '@/lib/hooks/useAuth';
import moment from 'moment';
import Cookies from 'js-cookie';
import Picker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import { ChatDetails, ChatMessage, User } from '@/types';
import { EmojiData } from '@/lib/types/chat';

export const TypingIndicator: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: '2px' }}>
    <Box
      sx={{
        animation: 'bounce 1.4s infinite ease-in-out both',
        animationDelay: '-0.32s',
        height: '8px',
        width: '8px',
        bgcolor: 'text.secondary',
        borderRadius: '50%',
        display: 'inline-block',
        m: '0 2px',
      }}
    />
    <Box
      sx={{
        animation: 'bounce 1.4s infinite ease-in-out both',
        animationDelay: '-0.16s',
        height: '8px',
        width: '8px',
        bgcolor: 'text.secondary',
        borderRadius: '50%',
        display: 'inline-block',
        m: '0 2px',
      }}
    />
    <Box
      sx={{
        animation: 'bounce 1.4s infinite ease-in-out both',
        height: '8px',
        width: '8px',
        bgcolor: 'text.secondary',
        borderRadius: '50%',
        display: 'inline-block',
        m: '0 2px',
      }}
    />
    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
      }
    `}</style>
  </Box>
);

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const { user } = useAuth();
  const params = useParams();
  const chatIdFromParams = params?.chatId;
  const typeFromParams = params?.type;

  const [chatDetails, setChatDetails] = useState<ChatDetails | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messageSearchTerm, setMessageSearchTerm] = useState<string>('');
  const [headerMenuAnchor, setHeaderMenuAnchor] = useState<null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [isAiReplying, setIsAiReplying] = useState<boolean>(false);
  const [messageTimeouts, setMessageTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map());

  const queryClient = useQueryClient();
  const authToken = Cookies.get('authToken');

  // Check if chatIdFromParams is a real chat room ID (not a user ID)
  // Real chat room IDs are typically longer and don't start with user ID patterns
  const isRealChatRoomId = chatIdFromParams &&
    chatIdFromParams.length > 20 &&
    !chatIdFromParams.toString().startsWith('temp_');

  const {
    data: fetchedChatData,
    isLoading: isLoadingChat,
    error: chatError,
  } = useQuery({
    queryKey: ['chat', chatIdFromParams, typeFromParams, user?._id],
    queryFn: () =>
      getChat({ chatId: chatIdFromParams as string, type: typeFromParams as string, userId: user?._id as string }),
    // enabled: !!chatIdFromParams && !!typeFromParams && !!user?._id && isRealChatRoomId,
    enabled: Boolean(chatIdFromParams && typeFromParams && user?._id && isRealChatRoomId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const { socket, connected, emit, on, off } = useSocket({
    userId: user?._id as string,
    role: user?.role?.roleId as string,
    token: authToken as string,
  });

  useEffect(() => {
    if (fetchedChatData?.data) {
      const currentChat = (fetchedChatData.data as unknown as ChatDetails)?.chat;
      setChatDetails(currentChat as ChatDetails);
      setMessages((fetchedChatData.data as unknown as ChatDetails)?.messages || []);
      if (currentChat?._id && socket && connected) {
        emit('mark_messages_read', { chatId: currentChat._id, userId: user?._id });
      }
    } else if (!isRealChatRoomId && chatIdFromParams && typeFromParams) {
      // This is a new chat scenario (chatIdFromParams is a user ID, not a chat room ID)
      const newChatDetails: ChatDetails = {
        data: null,
        _id: '', // Will be set when first message is sent
        type: typeFromParams as 'd2d' | 'ai' | 'd2c',
        isNewChatContext: true,
        other: {
          _id: chatIdFromParams as string,
          fullName: 'New Chat User', // This should be fetched from user data
          profileImage: '',
        },
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        participants: [],
        unreadCount: 0,
      };
      setChatDetails(newChatDetails);
      setMessages([]);
    } else if (chatError && isRealChatRoomId) {
      toast.error(`Failed to load chat: ${chatError.message}`);
    }
  }, [fetchedChatData, chatError, user?._id, socket, connected, emit, chatIdFromParams, typeFromParams, isRealChatRoomId]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (messages.length || isAiReplying) {
      scrollToBottom('smooth');
    }
  }, [messages, isAiReplying, scrollToBottom]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      messageTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [messageTimeouts]);

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handleNewMessage = (msg: any) => {
      const isCurrentChat =
        msg.chatId === chatDetails?._id ||
        (chatDetails?.isNewChatContext && typeFromParams === 'ai' && msg.sender === 'ai');

      if (isCurrentChat && msg.sender?._id !== user?._id) {
        setMessages((prevMessages) => {
          if (prevMessages.some((m) => m._id === msg._id)) return prevMessages;
          return [...prevMessages, msg];
        });

        if (msg.sender === 'ai') {
          setIsAiReplying(false);
        }

        if (msg.sender?._id !== user?._id) {
          emit('mark_messages_read', {
            chatId: chatDetails?._id,
            userId: user?._id,
            messageId: msg._id,
          });
        }
      }
    };

    const handleMessageSentConfirmation = (confirmedMessage: any) => {
      // Clear timeout for this message
      const timeout = messageTimeouts.get(confirmedMessage.tempId);
      if (timeout) {
        clearTimeout(timeout);
        setMessageTimeouts(prev => {
          const newMap = new Map(prev);
          newMap.delete(confirmedMessage.tempId);
          return newMap;
        });
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === confirmedMessage.tempId
            ? { ...confirmedMessage, sender: m.sender, isLoading: false }
            : m,
        ),
      );
      if ((chatDetails?.isNewChatContext || !chatDetails?._id) && confirmedMessage.chatId) {
        // Update the URL with the real chat room ID
        const newChatId = confirmedMessage.chatId;
        const newUrl = `/chat/${typeFromParams}/${newChatId}`;
        window.history.replaceState({}, '', newUrl);

        // Update chat details with the real chat room ID
        setChatDetails(prev => prev ? { ...prev, _id: newChatId, isNewChatContext: false } : null);
        queryClient.invalidateQueries({ queryKey: ['chatList'] });
        queryClient.invalidateQueries({
          queryKey: ['chat', newChatId, typeFromParams, user?._id],
        });
      }
    };

    const handleMessageError = (error: any) => {
      const errorMessage = error.message || 'Failed to send message. You can retry sending it.';
      toast.error(errorMessage);
      // Mark message as failed instead of removing it
      if (error.tempId) {
        setMessages((prev) =>
          prev.map((m) =>
            m.tempId === error.tempId
              ? { ...m, isLoading: false, isFailed: true }
              : m,
          ),
        );
        // Clear timeout
        const timeout = messageTimeouts.get(error.tempId);
        if (timeout) {
          clearTimeout(timeout);
          setMessageTimeouts(prev => {
            const newMap = new Map(prev);
            newMap.delete(error.tempId);
            return newMap;
          });
        }
      }
    };

    const handleSocketError = () => {
      toast.error('Connection lost. Attempting to reconnect...');
    };

    const handleSocketDisconnect = () => {
      // toast.warn('Disconnected from chat server. Messages may not be delivered.');
    };

    const handleSocketReconnect = () => {
      toast.success('Reconnected to chat server.');
    };

    on('receive_message', handleNewMessage);
    on('message_sent_confirmation', handleMessageSentConfirmation);
    on('send_message_error', handleMessageError); // Backend sends 'send_message_error'
    on('connect_error', handleSocketError);
    on('disconnect', handleSocketDisconnect);
    on('reconnect', handleSocketReconnect);

    return () => {
      off('receive_message', handleNewMessage);
      off('message_sent_confirmation', handleMessageSentConfirmation);
      off('send_message_error', handleMessageError); // Backend sends 'send_message_error'
      off('connect_error', handleSocketError);
      off('disconnect', handleSocketDisconnect);
      off('reconnect', handleSocketReconnect);
    };
  }, [
    socket,
    connected,
    chatDetails,
    user?._id,
    on,
    off,
    queryClient,
    chatIdFromParams,
    typeFromParams,
    emit,
    messageTimeouts,
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File is too large. Max 5MB allowed.');
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
    event.target.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || !socket || !connected) {
      if (!socket || !connected) toast.warn('Not connected to chat server.');
      return;
    }
    setIsSendingMessage(true);
    const tempId = `temp_${user?._id}_${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      sender: {
        _id: user?._id,
        fullName: user?.fullName,
        profileImageUrl: user?.profileImage,
      },
      content: input,
      type: 'text',
      createdAt: new Date().toISOString(),
      isLoading: true,
      tempId,
    };
      // Set timeout for message sending (30 seconds)
    const timeout = setTimeout(() => {
      toast.error('Message sending timed out. You can retry sending it.');
      // Mark message as failed instead of removing it
      setMessages((prev) =>
        prev.map((m) =>
          m.tempId === tempId
            ? { ...m, isLoading: false, isFailed: true }
            : m,
        ),
      );
      // Clear timeout from map
      setMessageTimeouts(prev => {
        const newMap = new Map(prev);
        newMap.delete(tempId);
        return newMap;
      });
    }, 30000);

    // Store timeout in state
    setMessageTimeouts(prev => new Map(prev).set(tempId, timeout));

    try {
      if (typeFromParams === 'ai') {
        const payload = {
          senderId: user?._id,
          content: input,
          tempId,
          assistantId: chatIdFromParams,
        };
        emit('send_ai_message', payload);
        setIsAiReplying(true);
      } else {
        const messagePayload: any = {
          senderId: user?._id,
          senderRole: user?.role?.roleId,
          chatType: typeFromParams,
          tempId,
          content: input,
          type: 'text', // message content type
        };

        // Set chatId and recipientId based on chat context
        if (chatDetails?.isNewChatContext) {
          // For new chats, chatId is empty and recipientId is the target user
          messagePayload.chatId = '';
          messagePayload.sendedId = chatIdFromParams; // This is the target user ID
        } else if (chatDetails?._id) {
          // For existing chats, use the chat ID
          messagePayload.chatId = chatDetails._id;
          // For existing chats, we don't need sendedId as the backend will find the other participant
        }

        // Validate required fields
        if (!messagePayload.senderId || !messagePayload.content || !messagePayload.chatType || !messagePayload.senderRole) {
          toast.error('Missing required information to send message.');
          clearTimeout(timeout);
          setMessageTimeouts(prev => {
            const newMap = new Map(prev);
            newMap.delete(tempId);
            return newMap;
          });
          setIsSendingMessage(false);
          return;
        }

        emit('send_message', messagePayload);
      }

      // Add optimistic message to UI
      setMessages((prev) => [...prev, optimisticMessage as unknown as ChatMessage]);
      setInput('');
      setSelectedFile(null);
      setFilePreview(null);
    } catch {
      toast.error('Failed to send message. Please try again.');
      // Clear timeout
      clearTimeout(timeout);
      setMessageTimeouts(prev => {
        const newMap = new Map(prev);
        newMap.delete(tempId);
        return newMap;
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleEmojiSelect = (emojiData: EmojiData) => {
    setInput((prevInput) => prevInput + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const retryMessage = (message: ChatMessage) => {
    if (!socket || !connected) {
      toast.warn('Not connected to chat server.');
      return;
    }

    const tempId = `retry_${user?._id}_${Date.now()}`;
    // Set timeout for retry
    const timeout = setTimeout(() => {
      toast.error('Message retry timed out. Please try again.');
      setMessages((prev) => prev.filter((m) => m.tempId !== tempId));
      setMessageTimeouts(prev => {
        const newMap = new Map(prev);
        newMap.delete(tempId);
        return newMap;
      });
    }, 30000);

    setMessageTimeouts(prev => new Map(prev).set(tempId, timeout));

    const retryMessage = {
      ...message,
      _id: tempId,
      tempId,
      isLoading: true,
      isRetry: true,
    };

    try {
      if (typeFromParams === 'ai') {
        const payload = {
          senderId: user?._id,
          content: message.content,
          tempId,
          assistantId: chatIdFromParams,
        };
        emit('send_ai_message', payload);
      } else {
        const messagePayload: any = {
          senderId: user?._id,
          senderRole: user?.role?.roleId,
          chatType: typeFromParams,
          tempId,
          content: message.content,
          type: 'text',
        };

        // Set chatId and recipientId based on chat context
        if (chatDetails?.isNewChatContext) {
          messagePayload.chatId = '';
          messagePayload.sendedId = chatIdFromParams;
        } else if (chatDetails?._id) {
          messagePayload.chatId = chatDetails._id;
        }

        emit('send_message', messagePayload);
      }

      // Remove the failed message and add the retry message
      setMessages((prev) => [
        ...prev.filter((m) => m.tempId !== message.tempId),
        retryMessage as ChatMessage,
      ]);
    } catch {
      toast.error('Failed to retry message. Please try again.');
      clearTimeout(timeout);
      setMessageTimeouts(prev => {
        const newMap = new Map(prev);
        newMap.delete(tempId);
        return newMap;
      });
    }
  };

  const filteredMessages = messages?.filter((msg) =>
    msg.content?.toLowerCase().includes(messageSearchTerm.toLowerCase()),
  );

  const getOtherParticipant = (chatDetails: ChatDetails, currentUser: User) => {
    if (!chatDetails || !currentUser?._id) return null;
    const currentUserId = currentUser?._id.toString();
    // const { type } = chatDetails;
    const type = 'd2d';
    switch (type) {
      case 'd2d':
        return chatDetails.dealers?.find((d: User) => d._id.toString() !== currentUserId);
      // case 'd2c':
      //   if (!chatDetails.dealer || !chatDetails.customer) return null;
      //   return chatDetails.dealer._id.toString() === currentUserId
      //     ? chatDetails.customer
      //     : chatDetails.dealer;
      // case 'ai':
      //   return chatDetails.assistant;
      default:
        return null;
    }
  };

  const otherParticipant = getOtherParticipant(chatDetails as ChatDetails, user as User);
  if (!chatIdFromParams) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <HiOutlineChatAlt2 size={80} color={theme.palette.text.secondary} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
          Pick up where you left off
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Select a conversation and chat away.
        </Typography>
      </Box>
    );
  }

  if (isLoadingChat && !chatDetails && isRealChatRoomId) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (chatError && !chatDetails && isRealChatRoomId) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          p: 2,
          textAlign: 'center',
        }}
      >
        <HiOutlineChatAlt2 size={80} color={theme.palette.error.main} />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
          Error Loading Chat
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          Could not load chat details: {chatError.message}
        </Typography>
      </Box>
    );
  }

  if (!chatDetails && !isLoadingChat && !chatError && isRealChatRoomId) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Typography>Preparing chat...</Typography>
        <CircularProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={otherParticipant?.profileImage || ''}
            alt={otherParticipant?.fullName?.charAt(0)?.toUpperCase() || 'A'}
          >
            {otherParticipant?.fullName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {otherParticipant?.fullName || 'Chat User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {typeFromParams === 'ai'
                ? 'AI Assistant'
                : connected
                  ? 'Online'
                  : 'Offline'}
            </Typography>
            {!connected && (
              <Typography variant="caption" color="error.main" sx={{ ml: 1 }}>
                (Disconnected)
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="standard"
            size="small"
            placeholder="Search messages..."
            value={messageSearchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setMessageSearchTerm((e.target as HTMLInputElement).value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: messageSearchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setMessageSearchTerm('')}
                    size="small"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              disableUnderline: true,
              sx: {
                borderRadius: '20px',
                fontSize: '0.85rem',
                mr: 1,
                bgcolor: theme.palette.action.hover,
                px: 1.5,
                py: 0.5,
              },
            }}
            sx={{ width: isLargeScreen ? 180 : 100 }}
          />
          <IconButton
            onClick={(e: React.MouseEvent<HTMLElement>) => setHeaderMenuAnchor(e.currentTarget as any)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={headerMenuAnchor}
            open={Boolean(headerMenuAnchor)}
            onClose={() => setHeaderMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setHeaderMenuAnchor(null);
              }}
            >
              View Profile
            </MenuItem>
          </Menu>
        </Box>
      </Paper>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          bgcolor: theme.palette.mode === 'light' ? '#E9EBEE' : '#1E1E1E',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {filteredMessages?.map((msg, index: number) => {
          const isOwnMessage = (msg.sender as User)?._id === user?._id || msg.sender === 'dealer' as unknown as string;

          return (
            <Box
              key={msg._id || msg.tempId || `msg-item-${index}`}
              sx={{
                display: 'flex',
                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                mb: 1.5,
                width: '100%',
              }}
            >
              {!isOwnMessage && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    alignSelf: 'flex-end',
                  }}
                  src={(msg.sender as User)?.profileImage || ''}
                >
                  {(msg.sender as User)?.fullName?.charAt(0)?.toUpperCase() || 'O'}
                </Avatar>
              )}

              <Paper
                elevation={0}
                sx={{
                  bgcolor: isOwnMessage
                    ? theme.palette.primary.main
                    : theme.palette.background.paper,
                  color: isOwnMessage
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                  px: 1.5,
                  py: 1,
                  borderRadius: isOwnMessage
                    ? '18px 4px 18px 18px'
                    : '4px 18px 18px 18px',
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
                  position: 'relative',
                }}
              >
                {/* Image Message */}
                {msg.type === 'image' && msg.fileUrl && (
                  <Box
                    component="img"
                    src={msg.fileUrl}
                    alt={msg.fileName || 'Sent image'}
                    sx={{
                      width: '100%',
                      maxWidth: 220,
                      borderRadius: 1,
                      mb: 0.5,
                      cursor: 'pointer',
                      display: 'block',
                    }}
                  />
                )}

                {/* File Message */}
                {msg.type === 'file' && (
                  <Box
                    component="a"
                    href={msg.fileUrl || '#'}
                    target="_blank"
                    download={msg.fileName}
                    rel="noopener noreferrer"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                      mb: msg.content === msg.fileName ? 0 : 0.5,
                    }}
                  >
                    <InsertDriveFileIcon
                      sx={{
                        mr: 1,
                        color: isOwnMessage
                          ? 'inherit'
                          : theme.palette.action.active,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: 'underline',
                        color: isOwnMessage
                          ? 'inherit'
                          : theme.palette.primary.main,
                      }}
                    >
                      {msg.fileName || 'Attached File'}
                    </Typography>
                  </Box>
                )}

                {/* Text Content */}
                {(msg.type === 'text' ||
                  (msg.type !== 'text' as string && msg.content !== msg.fileName)) && (
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </Typography>
                )}

                {/* Timestamp and Status */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    mt: 0.5,
                  }}
                >
                  {msg.isLoading && (
                    <CircularProgress
                      size={10}
                      sx={{ mr: 0.5, color: 'inherit' }}
                    />
                  )}
                  {msg.isFailed && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 0.5 }}>
                      <ErrorIcon
                        sx={{
                          fontSize: 12,
                          color: 'error.main',
                          mr: 0.5,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => retryMessage(msg)}
                        sx={{
                          p: 0.25,
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        }}
                        title="Retry sending message"
                      >
                        <RefreshIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Box>
                  )}
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {moment(msg.createdAt).format('h:mm A')}
                  </Typography>
                </Box>
              </Paper>

              {isOwnMessage && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    ml: 1,
                    alignSelf: 'flex-end',
                  }}
                  src={user?.profileImage || ''}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'M'}
                </Avatar>
              )}
            </Box>
          );
        })}

        {isAiReplying && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1.5 }}>
            <Avatar
              sx={{ width: 32, height: 32, mr: 1, alignSelf: 'flex-end' }}
              src={otherParticipant?.profileImage || ''}
            >
              {otherParticipant?.fullName?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
            <Paper
              elevation={0}
              sx={{
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                px: 1.5,
                py: 1,
                borderRadius: '4px 18px 18px 18px',
                boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
              }}
            >
              <TypingIndicator />
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {filePreview && (
        <Paper
          sx={{
            p: 1,
            mx: 2,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'action.hover',
            borderRadius: '8px',
            flexShrink: 0,
          }}
        >
          {selectedFile?.type.startsWith('image/') ? (
            <img
              src={filePreview}
              alt="Preview"
              style={{
                maxHeight: '40px',
                maxWidth: '40px',
                borderRadius: '4px',
                objectFit: 'cover',
              }}
            />
          ) : (
            <InsertDriveFileIcon sx={{ mr: 1, color: 'text.secondary' }} />
          )}
          <Typography
            variant="caption"
            sx={{
              flexGrow: 1,
              mx: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={selectedFile?.name}
          >
            {selectedFile?.name}
          </Typography>
          <IconButton
            onClick={() => {
              setSelectedFile(null);
              setFilePreview(null);
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}

      <Box
        component={Paper}
        elevation={3}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileSelect}
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
        />
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          color="primary"
          aria-label="attach file"
        >
          <AttachmentIcon />
        </IconButton>
        <IconButton
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          color="primary"
          aria-label="select emoji"
        >
          <MoodIcon />
        </IconButton>

        {showEmojiPicker && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              right: '8px',
              zIndex: 1301,
              boxShadow: theme.shadows[3],
            }}
          >
            <Picker
              onEmojiClick={handleEmojiSelect}
              autoFocusSearch={false}
              height={350}
              width={isLargeScreen ? 350 : 300}
              lazyLoadEmojis={true}
              searchPlaceholder="Search emoji"
              previewConfig={{ showPreview: false }}
            />
          </Box>
        )}

        <TextField
          placeholder="Type a message..."
          variant="outlined"
          size="small"
          fullWidth
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setInput((e.target as HTMLInputElement).value)
          }
          onKeyPress={(e: React.KeyboardEvent<HTMLDivElement>) =>
            e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSend()) : null
          }
          multiline
          maxRows={4}
          InputProps={{
            sx: {
              borderRadius: '20px',
              bgcolor: theme.palette.background.default,
              pr: 0.5,
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          color="primary"
          disabled={(!input.trim() && !selectedFile) || isSendingMessage}
          sx={{ ml: 1 }}
          aria-label="send message"
        >
          {isSendingMessage ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SendIcon />
          )}
        </IconButton>
        {/* Debug info - remove in production */}
        {/* {process.env.NODE_ENV === 'development' && (
          <Box sx={{ position: 'absolute', top: 0, right: 0, p: 1, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', zIndex: 1000 }}>
            <div>Socket: {socket ? '✓' : '✗'}</div>
            <div>Connected: {connected ? '✓' : '✗'}</div>
            <div>User: {user?._id ? '✓' : '✗'}</div>
            <div>Chat: {chatDetails?._id || 'New'}</div>
            <div>Type: {typeFromParams}</div>
          </Box>
        )} */}
      </Box>
    </Box>
  );
}
