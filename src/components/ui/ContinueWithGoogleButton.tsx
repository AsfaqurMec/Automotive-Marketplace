import React from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import Error from './Error';
import { googleLogin } from '@/lib/api/auth';
// import useAuth from '../../hooks/useAuth.js';
import { Button, Typography } from '@mui/material';
import colors from '../styles';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// Define types for better type safety
interface GoogleButtonProps {
    onSuccess?: () => void;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    [key: string]: unknown; // Allow other props to be passed through
}

interface GoogleLoginResponse {
    data: {
        _id: string;
         token?: string;
    };
}

interface GoogleLoginError {
    error?: string;
    message?: string;
}

function GoogleButton(props: GoogleButtonProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { textBlack } = colors;
  const [err, setErr] = React.useState<string>('');
  const { setUser, userStatus } = useAuth();
  const { t } = useTranslation();
  const { isPending , mutate } = useMutation({
    mutationFn: (token: string) => googleLogin(token) as Promise<GoogleLoginResponse>,
    onSuccess: async (d: GoogleLoginResponse) => {
      userStatus();
      toast.success('Login Successfully');
      if (sessionStorage.getItem('fromLogin') === 'true') {
        sessionStorage.setItem('fromLogin', 'true');
      } else {
        sessionStorage.setItem('fromLogin', 'false');
      }
      sessionStorage.setItem('user-status', 'true');
      setUser(d?.data);
      // Refetch the auth status manually
      await queryClient.invalidateQueries({ queryKey: ['authStatus'] });

      router.push('/admin/dashboard');
      if (typeof props.onSuccess === 'function') props.onSuccess();
    },
    onError: (err: GoogleLoginError) => setErr(err?.message || ''),
  });

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    scope: 'email profile',
    onError: (e: GoogleLoginError) => setErr(e.error || ''),
    onSuccess: (r: { code: string }) => mutate(r.code),
  });
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        sx={{
          border: `1px solid ${textBlack}`,
          width: '100%',
          marginY: '50px',
          paddingY: '10px',
        }}
        {...props}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          login();
          setErr('');
          if (props.onClick) props.onClick(e);
        }}
        disabled={isPending}
      >
        <FcGoogle size={32} />
        <Typography
          component={'p'}
          variant="body1"
          fontSize={{ lg: 16 }}
          color={textBlack}
          fontWeight={'500'}
          ml={{ xs: 3, lg: 5 }}
        >
          {t('continueWithGoogle', 'Continue with Google')}
        </Typography>
      </Button>

      <Error message={err} mt={2} />
    </React.Fragment>
  );
}

const ContinueWithGoogleButton: React.FC<GoogleButtonProps> = (props) => {
  const clientId = process.env.NEXT_PUBLIC_Google_Client_id;

  if (!clientId) {
    toast.error('Google Client ID is not configured');
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleButton {...props} />
    </GoogleOAuthProvider>
  );
};

export default ContinueWithGoogleButton;

