'use client';

import React, { useEffect, useRef } from 'react';
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
  const hasCheckedAuth = useRef(false);
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Clear any existing timer
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    // Wait for auth check to complete
    if (isGettingLoggedIn) {
      hasCheckedAuth.current = false;
      return;
    }

    // Auth check is complete, now check authorization
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      
      // Add a small delay to allow user data to fully load
      // This handles the race condition where isGettingLoggedIn becomes false
      // before user data is set in the store
      redirectTimerRef.current = setTimeout(() => {
        if (!user || !isAuthorized) {
          router.replace('/');
        }
      }, 500);
    }

    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };
  }, [isAuthorized, isGettingLoggedIn, router, user]);

  if (!vehicleSlug) {
    return <div>Vehicle not found</div>;
  }

  // Show loading state while checking authentication
  if (isGettingLoggedIn) {
    return <></>;
  }

  // Show nothing while redirecting if not authorized
  if (!user || !isAuthorized) {
    return <></>;
  }

  return <CarDetails />;
}
