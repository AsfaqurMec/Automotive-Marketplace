import React from 'react';
import LeftSideScreen from '@/components/auth/LeftSideScreen';
import { Box } from '@mui/material';
import colors from '@/components/styles';
import LoginPage from '@/components/auth/Login';

const LoginScreen: React.FC = () => {
  // Removed unused variables
  const foreground = colors.foreground;
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'start',
        minHeight: { xs: 'auto', md: '800px' },
        padding: { xs: '0px', md: '0px!important' },
        gap: { xs: 2, md: 10 },
      }}
    >
      <LeftSideScreen width={{ xs: '100%', lg: '60%', md: '52%' }} />

      <Box
        sx={{
          width: { xs: '100%', md: '100%', lg: '40%', xl: '52%' },
          backgroundColor: foreground,
        }}
      >
        <LoginPage />
      </Box>
    </Box>
  );
};

export default LoginScreen;
