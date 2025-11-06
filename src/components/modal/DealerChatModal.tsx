'use client';

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import dayjs from 'dayjs';
import { Dealer } from '@/types';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { createChat } from '@/lib/api/chat';
import { toast } from 'react-toastify';
import useAuth from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface DealerChatModalProps {
  open: boolean;
  dealer: Dealer | null;
  onClose: () => void;
}

const DealerChatModal: React.FC<DealerChatModalProps> = ({ open, dealer, onClose }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();

  const { mutate: startChat, isPending } = useMutation({
    mutationFn: createChat,
    onSuccess: (response) => {
      const chatRoom = response?.data?.data;
      if (chatRoom?._id && chatRoom?.type) {
        toast.success('Chat created successfully!');
        router.push(`/chat/${chatRoom.type}/${chatRoom._id}`);
        onClose();
      } else {
        toast.error('Chat created but no room ID received.');
      }
    },
    onError: (error: { message?: string }) => {
      toast.error(error?.message || 'Could not create chat room.');
    },
  });

  const handleStartChat = () => {
    if (!dealer?._id) {
      toast.error('Dealer information is missing.');
      return;
    }

    if (!user?._id) {
      toast.error('Please login to start a chat.');
      router.push('/login');
      return;
    }

    const chatType =
      user?.role?.roleId === 'dealer' || user?.role?.roleId === 'admin'
        ? 'd2d'
        : 'd2c';

    startChat({
      currentUserId: user._id,
      targetUserId: dealer._id,
      chatType,
    });
  };

  const createdDate = dealer?.createdAt
    ? dayjs(dealer.createdAt).format('DD MMM YYYY, HH:mm')
    : null;

  return (
    <Dialog open={open} onClose={isPending ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('chatWithDealer')}</DialogTitle>
      <DialogContent>
        {dealer ? (
          <Stack spacing={2} mt={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={dealer.logo || ''}>
                {dealer.fullName?.[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{dealer.fullName}</Typography>
                {dealer.companyName && (
                  <Typography variant="body2" color="text.secondary">
                    {dealer.companyName}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('email')}
              </Typography>
              <Typography variant="body1">{dealer.email || t('na')}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('phone')}
              </Typography>
              <Typography variant="body1">{dealer.phone || t('na')}</Typography>
            </Box>

            {createdDate && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('createdAt')}
                </Typography>
                <Typography variant="body1">{createdDate}</Typography>
              </Box>
            )}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t('noDataFound')}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isPending} variant="outlined">
          {t('cancel')}
        </Button>
        <Button
          onClick={handleStartChat}
          disabled={!dealer || isPending}
          variant="contained"
        >
          {isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            t('chat')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DealerChatModal;

