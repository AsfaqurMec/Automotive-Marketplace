'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import CarDetails from '@/screens/SearchItem';
import useAuth from '@/lib/hooks/useAuth';

const ALLOWED_ROLES = new Set(['admin', 'superAdmin', 'dealer']);

export default function Page(): React.ReactElement {
  const { slug } = useParams<{ slug: string | string[] }>();
  const vehicleSlug = Array.isArray(slug) ? slug[0] : slug ?? null;

  const router = useRouter();
  const { user, isGettingLoggedIn } = useAuth();
  const isAuthorized = user?.role?.roleId ? ALLOWED_ROLES.has(user.role.roleId) : false;

  useEffect(() => {
    if (!isGettingLoggedIn && (!user || !isAuthorized)) {
      router.replace('/');
    }
  }, [isAuthorized, isGettingLoggedIn, router, user]);

  if (!vehicleSlug) {
    return <div>Vehicle not found</div>;
  }

  if (!isGettingLoggedIn && (!user || !isAuthorized)) {
    return <></>;
  }

  return <CarDetails />;
}
