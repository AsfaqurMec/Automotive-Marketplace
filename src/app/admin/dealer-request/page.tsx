'use client';
import DealerRequestsList from '@/screens/admin/DealerRequestsList';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();
  return (
    <AuthorizeProtect module="adminPanel" action="access" redirectTo="/">
      <DealerRequestsList />
    </AuthorizeProtect>
  );
};

export default Page;





