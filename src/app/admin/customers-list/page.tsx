'use client';
import CustomerList from '@/screens/admin/CustomerList';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();
  return (
    <AuthorizeProtect module="adminPanel" action="viewUser">
      <CustomerList />
    </AuthorizeProtect>
  );
};

export default Page;

