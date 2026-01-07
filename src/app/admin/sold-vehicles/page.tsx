'use client';
import SoldVehicles from '@/screens/admin/SoldVehicles';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/lib/hooks/useAuth';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';

const Page = () => {
  useProtectedRoute();
  const router = useRouter();
  const { user, isGettingLoggedIn } = useAuth();

  useEffect(() => {
    if (!isGettingLoggedIn && user) {
      const isAdmin = user?.role?.roleId === 'admin' || user?.role?.roleId === 'superAdmin';
      if (!isAdmin) {
        router.replace('/');
      }
    }
  }, [user, isGettingLoggedIn, router]);

  if (!isGettingLoggedIn && user) {
    const isAdmin = user?.role?.roleId === 'admin' || user?.role?.roleId === 'superAdmin';
    if (!isAdmin) {
      return null;
    }
  }

  return (
    <AuthorizeProtect module="carSold" action="view" redirectTo="/">
      <SoldVehicles />
    </AuthorizeProtect>
  );
};

export default Page;

