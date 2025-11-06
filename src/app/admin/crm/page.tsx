'use client';
import CrmList from '@/screens/admin/CrmScreens';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();
  return (
    <AuthorizeProtect module="leads" action="view">
      <CrmList />
    </AuthorizeProtect>
  );
};

export default Page;

