'use client';
import ForgotPasswordPage from '@/components/auth/ForgetPassword';
import colors from '@/components/styles';
import { Box } from '@mui/material';
import LeftSideScreen from '@/components/auth/LeftSideScreen';
import useCheckUserAuthenticate from '@/lib/hooks/useCheckUserAuthenticateStatus';

const Page = () => {
  const foreground = colors.foreground;
  useCheckUserAuthenticate();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'start',
        maxHeight: '1200px',
        padding: '0px!important',
        gap: 10,
      }}
    >
      <LeftSideScreen width={'52%'} />

      <Box sx={{ width: { xs: '100%', md: '100%', xl: '32%' }, backgroundColor: foreground }}>
        <ForgotPasswordPage />
      </Box>
    </Box>
  );
};

export default Page;

