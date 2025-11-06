'use client';
import ChatSidebar from '@/components/ui/chats/ChatSideBar';
import {
  Box,
  Grid,
  useMediaQuery,
  IconButton,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState, useEffect, ReactNode } from 'react';
import useAuth from '@/lib/hooks/useAuth';
import useSocket from '@/lib/utils/useSocket';
import MenuIcon from '@mui/icons-material/Menu';
import { ChatRoom } from '@/types';

interface ChatLayoutProps {
    children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [token] = useState<string | null>(null);

  const { socket } = useSocket({
    userId: user?._id || '',
    role: user?.role?.roleId || '',
    token: token || '',
  });

  useEffect(() => {
    if (!socket) return;

    const handleChats = (data: ChatRoom[]) => setChats(data);

    socket.on('all_chats', handleChats);

    return () => {
      socket.off('all_chats', handleChats);
    };
  }, [socket]);

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* AppBar with menu icon for mobile */}
      {isMobile && (
        <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 1 }}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 0 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
                            Chat
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer for mobile sidebar */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }} // Better performance on mobile
      >
        <Box sx={{ width: 280 }}>
          <ChatSidebar
            chats={chats}
            onCloseDrawer={() => setSidebarOpen(false)}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onChatSelect={() => {
              // Handle chat selection if needed
              setSidebarOpen(false);
            }}
          />
        </Box>
      </Drawer>

      <Grid container sx={{ height: isMobile ? 'calc(100vh - 56px)' : '100vh' }}>
        {/* Sidebar for desktop & tablet */}
        {(isDesktop || isTablet) && (
          <Grid
            item
            xs={12}
            md={isDesktop ? 3 : 6}
            sx={{ borderRight: '1px solid #ddd', overflowY: 'auto' }}
          >
            <ChatSidebar
              chats={chats}
              isOpen={false}
              onClose={() => {}}
              onChatSelect={() => {
                // Handle chat selection if needed
              }}
            />
          </Grid>
        )}

        {/* Chat Window (children = ChatWindow) */}
        <Grid
          item
          xs={12}
          md={isDesktop ? 9 : 6}
          sx={{
            pt: { xs: 0, sm: 0 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {socket && chats.length > 0 ? (
            children
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
}
