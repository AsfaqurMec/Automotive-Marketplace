'use client';
import useCheckUserAuthenticate from '@/lib/hooks/useCheckUserAuthenticateStatus';
import dynamic from 'next/dynamic';

const PasswordResetClient = dynamic(() => import('@/components/auth/NewPassword'), {
  ssr: false,
});

const Page = () => {
  useCheckUserAuthenticate();

  return <PasswordResetClient />;
};

export default Page;

