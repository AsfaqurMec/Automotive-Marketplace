'use client';
import PublicDealersList from '@/screens/admin/PublicDealersList';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();

  return (
    <PublicDealersList />
  );
};

export default Page;


