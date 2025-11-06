'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/ui/Sidebar';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import colors from '@/components/styles';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';
import MenuIcon from '@mui/icons-material/Menu';
import i18n from '../../i18n';
import dotenv from 'dotenv';
import MobileSidebar from '@/components/admin/ui/MobileSideBar';
import { useTranslation } from 'react-i18next';
import { safeLocalStorage } from '@/lib/utils/secureStorage';
dotenv.config();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  useProtectedRoute();
  const { foreground } = colors;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleSidebarToggle = () => setIsSidebarOpen((prev) => !prev);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dir =
        typeof window !== 'undefined'
          ? safeLocalStorage.getLanguage() === 'he'
            ? 'rtl'
            : 'ltr'
          : null;

  useEffect(() => {
    if (dir === 'rtl') {
      document.documentElement.setAttribute('dir', dir as string);
    } else if (dir === 'ltr') {
      document.documentElement.setAttribute('dir', dir as string);
    }
    document.documentElement.setAttribute('lang', i18n.language);
  }, [dir]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          height: '100%',
          background: foreground,
        }}
      >
        {/* Sidebar for large devices */}
        {!isMobile && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            handleSidebarToggle={handleSidebarToggle}

          />
        )}

        {/* Drawer menu toggle for small devices */}
        {isMobile && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 1 }}>
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon
                  style={{
                    fontSize: 36,
                    background: '#c69c6d',
                    borderRadius: 5,
                    color: '#fff',
                    padding: 1,
                  }}
                />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  style={{ fontSize: 20, marginLeft: 5, marginRight: 5 }}
                >
                  {t('adminPanels')}
                </Typography>
              </IconButton>
            </Box>
            <MobileSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          </>
        )}

        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            width: isMobile ? '100%' : 'calc(100% - 300px)',
            px: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;

