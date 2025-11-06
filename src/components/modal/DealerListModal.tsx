'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { FiSearch } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getDealers } from '@/lib/api/dealer';
import { createChat } from '@/lib/api/chat';
import useAuth from '@/lib/hooks/useAuth';
import { Dealer } from '@/types';
import { useRouter } from 'next/navigation';

interface DealerListModalProps {
  open: boolean;
  onClose: () => void;
  onCloseDrawer?: () => void;
}

const DealerListModal: React.FC<DealerListModalProps> = ({ open, onClose, onCloseDrawer }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [dealers, setDealers] = useState<Dealer[]>([]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch dealers
  const {
    mutate: fetchDealers,
    isPending: isLoadingDealers,
    error: dealersError,
  } = useMutation({
    mutationFn: () => getDealers({
      search: debouncedSearchTerm,
      limit: 50,
      page: 1,
    }),
    onSuccess: (response) => {
      const dealersData = response?.data?.data || [];
      setDealers(dealersData);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Could not fetch dealers.');
      setDealers([]);
    },
  });
//console.log("dealers", dealers);
  // Create chat mutation
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
        onClose();
        onCloseDrawer?.();
      } else {
        toast.error('Chat created but no room ID received.');
      }
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Could not create chat room.');
    },
  });

  // Fetch dealers when modal opens or search term changes
  useEffect(() => {
    if (open) {
      fetchDealers();
    }
  }, [open, debouncedSearchTerm, fetchDealers]);

  const handleDealerClick = (dealer: Dealer) => {
    if (!user?._id || !dealer?._id) {
      toast.error('Unable to start chat. Missing user information.');
      return;
    }
    //console.log(user?.role?.roleId);
    
    const chatType = user?.role?.roleId === 'dealer' || user?.role?.roleId === 'admin' ? 'd2d' : 'd2c';

    // Create a new chat room
    createChatRoom({
      currentUserId: user._id,
      targetUserId: dealer._id,
      chatType: chatType,
    });
  };

  const handleClose = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setDealers([]);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Select a Dealer to Chat</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search dealers..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setSearchTerm((e.target as HTMLInputElement).value)
          }
          autoFocus
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch size={20} color="#666" />
              </InputAdornment>
            ),
          }}
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
          Choose a dealer to start a conversation
        </DialogContentText>

        {(isLoadingDealers || isCreatingChat) && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
            {isCreatingChat && (
              <Typography variant="body2" sx={{ ml: 1, alignSelf: 'center' }}>
                Creating chat...
              </Typography>
            )}
          </Box>
        )}

        {dealersError && (
          <Typography color="error" sx={{ my: 2, textAlign: 'center' }}>
            Error: {dealersError.message}
          </Typography>
        )}

        {!isLoadingDealers && !isCreatingChat && !dealersError && (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {dealers.length > 0 ? (
              dealers.map((dealer: Dealer) => (
                <ListItem
                  key={dealer._id}
                  onClick={() => !isCreatingChat && handleDealerClick(dealer)}
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: isCreatingChat ? 'transparent' : '#f0f0f0',
                    },
                    mb: 0.5,
                    opacity: isCreatingChat ? 0.6 : 1,
                    cursor: isCreatingChat ? 'not-allowed' : 'pointer',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={dealer.fullName}
                      src={dealer.logo || ''}
                      sx={{
                        bgcolor: '#bdbdbd',
                        width: 40,
                        height: 40,
                      }}
                    >
                      {dealer.fullName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold" component="div">
                        {dealer.fullName}
                        {dealer.companyName && (
                          <Typography variant="body2" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                            {dealer.companyName}
                          </Typography>
                        )}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary" component="div">
                        {dealer.email}
                        {dealer.address?.city && (
                          <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                            📍 {dealer.address.city}
                            {dealer.address.country && `, ${dealer.address.country}`}
                          </Typography>
                        )}
                      </Typography>
                    }
                  />
                </ListItem>
              ))
            ) : (
              !isLoadingDealers && (
                <ListItem>
                  <ListItemText
                    primary="No dealers found"
                    sx={{ textAlign: 'center' }}
                  />
                </ListItem>
              )
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DealerListModal;
