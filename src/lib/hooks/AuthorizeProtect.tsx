'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import usePermission from './usePermission';
import useAuth from './useAuth';
import CustomLoaderForComponent from '@/components/ui/CustomLoaderForComponent';
const AuthorizeProtect = ({ module, action, redirectTo = '/', children }: { module: string, action: string, redirectTo?: string, children: React.ReactNode }) => {
  const router = useRouter();
  const can = usePermission();
  const { isGettingLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isGettingLoggedIn && !isLoading) {
      if (!can(module, action)) {
        router.replace(redirectTo);
      }
    }
  }, [can, module, action, isGettingLoggedIn, isLoading, router, redirectTo]);

  if (isGettingLoggedIn || isLoading) {
    return <CustomLoaderForComponent />;
  }

  return <>{children}</>;
};

export default AuthorizeProtect;

