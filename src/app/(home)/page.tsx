'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import LoginScreen from '@/screens/LoginScreen';
import { getUser } from '@/lib/api/auth';

const page: React.FC = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['authStatus'],
    queryFn: getUser,
    retry: false,
  });

  useEffect(() => {
    // Only redirect if we've finished loading and user is authenticated
    if (!isLoading && data) {
      const authData = data as { data?: { authenticated?: boolean; _id?: string } };
      
      // Check if user is authenticated
      // When authenticated: data.data is User object (has _id)
      // When not authenticated: data.data is { authenticated: false }
      const isAuthenticated = authData?.data && 
        authData.data.authenticated !== false && 
        '_id' in authData.data;
      
      if (isAuthenticated) {
        router.push('/admin/dashboard');
      }
      // If not authenticated, stay on login page (show LoginScreen)
    }
  }, [isLoading, data, router]);

  return <LoginScreen />;
};
export default page;

