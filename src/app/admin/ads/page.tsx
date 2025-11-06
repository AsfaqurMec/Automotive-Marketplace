'use client';

import Advertisement from '@/screens/admin/Advertisement';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();
  return (
    <AuthorizeProtect module="ads" action="view">
      <Advertisement />
    </AuthorizeProtect>
  );
};

export default Page;

