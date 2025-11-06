'use client';
import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box,
  Avatar,
  ListItemAvatar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  CircularProgress,
  DialogActions,
  Button,
} from '@mui/material';
import { FiSearch, FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { useRouter, useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getSearchUser, createChat, deleteChat } from '@/lib/api/chat';
import useAuth from '@/lib/hooks/useAuth';
import { User, ChatRoom } from '@/types';
import { formatTimeResponsive } from '@/lib/utils/timeFormatter';
import DealerListModal from '@/components/modal/DealerListModal';

interface SearchedUser extends User {
  users?: User[];
  userType: string;
  active?: boolean;
  name?: string;
  profileImageUrl?: string;
}

interface ChatSidebarProps {
  chats: ChatRoom[];
  onCloseDrawer?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  onChatSelect?: (chat: ChatRoom) => void;
  isLoading?: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chats, onCloseDrawer, isLoading = false }) => {
  const router = useRouter();
  const params = useParams();
  const chatId = params?.chatId;
  const type = params?.type;
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<SearchedUser[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [chatMenuAnchor, setChatMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dealerModalOpen, setDealerModalOpen] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const open = Boolean(anchorEl);
  const chatMenuOpen = Boolean(chatMenuAnchor);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallDevice(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const {
    mutate: triggerUserSearch,
    isPending: isSearching,
    error: searchError,
  } = useMutation({
    mutationFn: getSearchUser,
    onSuccess: (response) => {
      // Transform User[] to SearchedUser[] by adding userType property
      const transformedUsers = response?.data?.users || [];
      setSearchedUsers(transformedUsers as SearchedUser[]);
    },
    onError: (error: { message?: string }) => {
      setSearchedUsers([]);
      toast.error(error.message || 'Could not search users.');
    },
  });

  const {
    mutate: createChatRoom,
    isPending: isCreatingChat,
  } = useMutation({
    mutationFn: createChat,
    onSuccess: (response) => {
      const chatRoom = response?.data?.data;
      if (chatRoom?._id) {
        const chatType = chatRoom.type;
        toast.success('Chat created successfully!');
        router.push(`/chat/${chatType}/${chatRoom._id}`);
        setSearchModalOpen(false);
        onCloseDrawer?.();
      } else {
        toast.error('Chat created but no room ID received.');
      }
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Could not create chat room.');
    },
  });

  const {
    mutate: deleteChatRoom,
    isPending: isDeletingChat,
  } = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      toast.success('Chat deleted successfully!');
      setDeleteModalOpen(false);
      setSelectedChat(null);
      // Navigate back to chat list
      router.push('/chat');
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Could not delete chat.');
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      triggerUserSearch({ term: debouncedSearchTerm, currentUserId: user?._id || '' });
    } else {
      setSearchedUsers([]);
    }
  }, [debouncedSearchTerm, triggerUserSearch, user?._id]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleChatMenuClick = (event: React.MouseEvent<HTMLElement>, chat: ChatRoom) => {
    event.stopPropagation(); // Prevent chat click
    setChatMenuAnchor(event.currentTarget);
    setSelectedChat(chat);
  };

  const handleChatMenuClose = () => {
    setChatMenuAnchor(null);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    handleChatMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (selectedChat?._id && user?._id && selectedChat.type) {
      const userId = user._id; // Extract to ensure type safety
      deleteChatRoom({
        chatId: selectedChat._id,
        type: selectedChat.type,
        userId: userId,
      });
    } else {
      toast.error('Unable to delete chat. Missing required information.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedChat(null);
  };

  const handleSearchToggle = () => {
    setSearchModalOpen(true);
    handleMenuClose();
  };

  const handleNewChatToggle = () => {
    setDealerModalOpen(true);
    handleMenuClose();
  };

  const handleUserClick = (searchUser: SearchedUser) => {
    if (!user?._id || !searchUser?._id) {
      toast.error('Unable to start chat. Missing user information.');
      return;
    }

    const chatType = searchUser.userType === 'dealer' && user?.role?.roleId === 'dealer' ? 'd2d' : 'd2c';

    // Create a new chat room using the POST API
    createChatRoom({
      currentUserId: user._id,
      targetUserId: searchUser._id,
      chatType: chatType,
    });
  };

  const handleChatClick = (chat: ChatRoom) => {
    router.push(`/chat/${chat.type}/${chat._id}`);
    onCloseDrawer?.();
  };

  return (
    <Box
      sx={{
        width: '100%',
        p: 2,
        height: '100vh',
        overflowY: 'auto',
        bgcolor: '#fff',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f0f0f0',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: '#a0a0a0',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
                    Chats
        </Typography>
        <IconButton onClick={handleMenuClick}>
          <FiMoreVertical size={20} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose} sx={{ textAlign: 'right' }}>
          <MenuItem onClick={handleSearchToggle}>
            <FiSearch size={16} style={{ marginRight: 8 }} />
                        Search Users
          </MenuItem>
          <MenuItem onClick={handleNewChatToggle} sx={{ justifyContent: 'center' }}>New Chat</MenuItem>
          {/* <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem> */}
        </Menu>
      </Box>

      {/* Search Modal */}
      <Dialog
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Search Users</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Type name or email..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearchTerm((e.target as HTMLInputElement).value)}
            autoFocus
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: '#f5f5f5',
                px: 2,
                '& fieldset': { border: 'none' },
                '&:hover fieldset': { border: 'none' },
                '&.Mui-focused': {
                  backgroundColor: '#eee',
                  boxShadow: '0 0 0 2px #ccc',
                },
              },
              input: { py: 1.2 },
            }}
          />
          <DialogContentText sx={{ mb: 1 }}>
                        Select a user to start chatting
          </DialogContentText>

          {(isSearching || isCreatingChat) && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
              {isCreatingChat && (
                <Typography variant="body2" sx={{ ml: 1, alignSelf: 'center' }}>
                  Creating chat...
                </Typography>
              )}
            </Box>
          )}

          {searchError && (
            <Typography color="error" sx={{ my: 2, textAlign: 'center' }}>
                            Error: {searchError.message}
            </Typography>
          )}

          {!isSearching && !isCreatingChat && !searchError && (
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {searchedUsers.length > 0
                ? searchedUsers.map((user: SearchedUser) => (
                  <ListItem
                    key={user._id}
                    onClick={() => !isCreatingChat && handleUserClick(user)}
                    sx={{
                      borderRadius: 2,
                      '&:hover': { backgroundColor: isCreatingChat ? 'transparent' : '#f0f0f0' },
                      mb: 0.5,
                      opacity: isCreatingChat ? 0.6 : 1,
                      cursor: isCreatingChat ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        variant="dot"
                        invisible={!user.active}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#44b700',
                            color: '#44b700',
                            boxShadow: (theme) =>
                              `0 0 0 2px ${theme.palette.background.paper}`,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                          },
                        }}
                      >
                        <Avatar
                          alt={user.name}
                          src={user.profileImageUrl || ''}
                        />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={`${user.email || ''} • ${user.userType || 'user'}`}
                    />
                  </ListItem>
                ))
                : debouncedSearchTerm.trim() && (
                  <ListItem>
                    <ListItemText primary="No users found" />
                  </ListItem>
                )}
            </List>
          )}
        </DialogContent>
      </Dialog>

      <Divider />

      {/* Chat List */}
      <List disablePadding>
        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : chats?.length > 0 ? (
          chats.map((chat) => (
            <React.Fragment key={chat._id}>
              <ListItem
                onClick={() => handleChatClick(chat)}
                sx={{
                  backgroundColor:
                                        chat._id === chatId && type === chat.type
                                          ? '#f5f5f5'
                                          : 'transparent',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  alignItems: 'flex-start',
                  py: 1.5,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={
                      chat?.other?.fullName ||
                                            (chat?.type === 'd2d'
                                              ? 'Direct Chat'
                                              : chat?.dealer?._id === user?._id
                                                ? chat?.customer?.fullName
                                                : chat?.dealer?.fullName) ||
                                            'Chat User'
                    }
                    src={chat?.other?.profileImage || chat?.avatar || ''}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        component="span"
                        variant="subtitle1"
                        fontWeight={600}
                        noWrap
                        sx={{ maxWidth: 'calc(100% - 100px)' }}
                      >
                        {chat?.other?.fullName ||
                                                    (chat?.type === 'd2d'
                                                      ? 'Direct User'
                                                      : chat?.dealer?._id === user?._id
                                                        ? chat?.customer?.fullName
                                                        : chat?.dealer?.fullName) ||
                                                    (chat?.type === 'ai' && chat?.name) ||
                                                    'Unknown User'}
                      </Typography>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {chat.lastMessageTime && (
                          <Typography
                            component="span"
                            variant="caption"
                            color="textSecondary"
                            sx={{ whiteSpace: 'nowrap' }}
                          >
                            {formatTimeResponsive(chat.lastMessageTime, isSmallDevice)}
                          </Typography>
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleChatMenuClick(e, chat)}
                          sx={{
                            opacity: 0.7,
                            '&:hover': { opacity: 1, bgcolor: 'rgba(0,0,0,0.1)' },
                          }}
                        >
                          <FiMoreVertical size={16} />
                        </IconButton>
                      </span>
                    </span>
                  }
                  secondary={
                    <span
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        component="span"
                        variant="body2"
                        color={
                          chat.unreadCount > 0
                            ? 'text.primary'
                            : 'text.secondary'
                        }
                        fontWeight={chat.unreadCount > 0 ? 'bold' : 'normal'}
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          flexGrow: 1,
                          pr: chat.unreadCount > 0 ? 1 : 0,
                        }}
                      >
                        {chat.lastMessage?.content
                          ? chat.lastMessage.content.slice(0, 30) +
                                                      (chat.lastMessage.content.length > 30
                                                        ? '...'
                                                        : '')
                          : 'No messages yet'}
                      </Typography>
                      {chat.unreadCount > 0 && (
                        <Badge
                          color="primary"
                          badgeContent={chat.unreadCount}
                          max={99}
                          sx={{ ml: 1, flexShrink: 0 }}
                        />
                      )}
                    </span>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))
        ) : (
          <Box display="flex" justifyContent="center" my={4}>
            <Typography variant="body2" color="text.secondary">
                            No chats available
            </Typography>
          </Box>
        )}
      </List>

      {/* Chat Menu */}
      <Menu
        anchorEl={chatMenuAnchor}
        open={chatMenuOpen}
        onClose={handleChatMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <FiTrash2 size={16} style={{ marginRight: 8 }} />
          Delete Chat
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this chat? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeletingChat}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeletingChat}
            startIcon={isDeletingChat ? <CircularProgress size={16} /> : <FiTrash2 />}
          >
            {isDeletingChat ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dealer List Modal */}
      <DealerListModal
        open={dealerModalOpen}
        onClose={() => setDealerModalOpen(false)}
        onCloseDrawer={onCloseDrawer}
      />
    </Box>
  );
};

export default ChatSidebar;

