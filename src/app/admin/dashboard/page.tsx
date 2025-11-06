'use client';

import Dashboard from '@/screens/admin/Dashboard';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();
  return (
    <AuthorizeProtect module="adminPanel" action="access" redirectTo="/">
      <Dashboard />
    </AuthorizeProtect>
  );
};

export default Page;

