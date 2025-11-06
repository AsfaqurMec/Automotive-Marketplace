'use client';
import DealersList from '@/screens/admin/DealersList';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();

  return (
    <AuthorizeProtect module="adminPanel" action="viewDealer">
      <DealersList />
    </AuthorizeProtect>
  );
};

export default Page;

