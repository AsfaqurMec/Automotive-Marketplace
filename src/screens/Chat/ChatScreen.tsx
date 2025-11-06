'use client';
import React, { useState, useEffect } from 'react';
import ChatSidebar from '@/components/ui/chats/ChatSideBar';
import { ChatWindow } from '@/components/ui/chats/ChatWindow';
import { Grid, Box, useMediaQuery, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useAuth from '@/lib/hooks/useAuth';
import useSocket from '@/lib/utils/useSocket';
import { ChatRoom } from '@/types';

const ChatScreen: React.FC = () => {
  const theme = useTheme();
  // const [activeSection, setActiveSection] = useState<string>('sidebar');
  const activeSection = 'sidebar';
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  // Removed unused state

  const { socket } = useSocket({
    userId: user?._id as string,
    role: user?.role?.roleId as string,
    token: '' as string,
  });
  useEffect(() => {
    if (!socket) return;

    const handleChats = (data: ChatRoom[]) => {
      setChats(data);
    };

    socket.on('all_chats', handleChats);

    return () => {
      socket.off('all_chats', handleChats);
    };
  }, [socket]);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box sx={{ height: { lg: '100vh', xs: '80vh' }, overflow: 'hidden' }}>
      {/* {isMobile && (
        <Stack direction="row" spacing={1} sx={{ p: 1, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setActiveSection('sidebar')}
          >
                        Chats
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setActiveSection('chat')}
          >
                        Chat
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setActiveSection('profile')}
          >
                        Profile
          </Button>
        </Stack>
      )} */}

      <Grid container sx={{ height: '100vh' }}>
        {(isDesktop || isTablet || (isMobile && activeSection === 'sidebar')) && (
          <Grid
            item
            xs={12}
            md={isDesktop ? 3 : 6}
            sx={{ borderRight: isDesktop || isTablet ? '' : 'none', overflowY: 'auto' }}
          >
            <ChatSidebar
              chats={chats}
              onCloseDrawer={() => {}}
              isOpen={true}
              onClose={() => {}}
              onChatSelect={() => {
                // Handle chat selection if needed
              }}
            />
          </Grid>
        )}

        <Grid
          item
          xs={12}
          md={isDesktop ? 6 : 6}
          sx={{
            pt: { xs: 18, sm: 0 },
            height: '100%', // Make the Grid item take the full height from its container (assuming container has defined height like 100vh)
            display: 'flex', // Allow ChatWindow to use height: '100%' effectively
            flexDirection: 'column', // Stack ChatWindow within this item
          }}
        >
          {socket && chats.length > 0 ? (
            <ChatWindow />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                                Loading chats...
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatScreen;
