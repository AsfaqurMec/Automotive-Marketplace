import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/auth';
import { useEffect } from 'react';

const useProtectedRoute = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['authStatus'],
    queryFn: getUser,
    retry: false,
  });

  useEffect(() => {
    // Only redirect if we're not loading and definitely not authenticated
    if (!isLoading && !isError && data) {
      const authData = data as { data?: { authenticated?: boolean; user?: unknown } };

      // Check if user is not authenticated and we're not in the middle of a login process
      if (!authData?.data?.authenticated && !authData?.data?.user) {
        // Check if we're coming from login to prevent immediate redirect
        const fromLogin = sessionStorage.getItem('fromLogin');

        if (!fromLogin) {
          router.push('/signin');
        }
        // If fromLogin is true, do nothing (allow the login process to continue)
      }
      // If user is authenticated, do nothing (allow access)
    }
  }, [isLoading, isError, data, router]);

  return { user: (data as { data?: { authenticated?: boolean; user?: unknown } })?.data, loading: isLoading };
};

export default useProtectedRoute;

