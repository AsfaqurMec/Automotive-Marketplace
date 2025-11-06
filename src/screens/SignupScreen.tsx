import React from 'react';
import PurposeSelection from '@/components/auth/SignupRole';
import LeftSideScreen from '@/components/auth/LeftSideScreen';
import { Box } from '@mui/material';
import colors from '@/components/styles';
//import useCheckUserAuthenticate from '@/lib/hooks/useCheckUserAuthenticateStatus';

const SignupScreen: React.FC = () => {
  const foreground = colors.foreground;
  // const {error,loading}=useCheckUserAuthenticate()

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'start',
        height: '100%',
        padding: '0px!important',
        gap: 10,
      }}
    >
      <LeftSideScreen width={'52%'} />

      <Box sx={{ width: { xs: '100%', md: '100%', xl: '32%' }, backgroundColor: foreground }}>
        <PurposeSelection />
      </Box>
    </Box>
  );
};

export default SignupScreen;
