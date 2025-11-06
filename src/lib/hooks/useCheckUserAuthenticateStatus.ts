'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/auth';
import { useRouter } from 'next/navigation';

const useCheckUserAuthenticate = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<{ data?: { authenticated?: boolean } }>({
    queryKey: ['authStatus'],
    queryFn: getUser,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && data?.data?.authenticated === true) {
      router.push('/admin/dashboard');
    }
  }, [isLoading, data, router, data?.data?.authenticated]);

  return { loading: isLoading, error: isError };
};

export default useCheckUserAuthenticate;

