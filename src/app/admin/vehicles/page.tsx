'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import VehiclesScreen from '@/screens/VehiclesScreen';
import useAuth from '@/lib/hooks/useAuth';

const ALLOWED_ROLES = new Set(['admin', 'superAdmin', 'dealer']);

const VehiclesPage: React.FC = () => {
  const router = useRouter();
  const { user, isGettingLoggedIn } = useAuth();
  const isAuthorized = user?.role?.roleId ? ALLOWED_ROLES.has(user.role.roleId) : false;

  useEffect(() => {
    if (!isGettingLoggedIn && (!user || !isAuthorized)) {
      router.replace('/');
    }
  }, [isAuthorized, isGettingLoggedIn, router, user]);

  if (!isGettingLoggedIn && (!user || !isAuthorized)) {
    return <></>;
  }

  return <VehiclesScreen />;
};

export default VehiclesPage;

