'use client';
import InventoryComponent from '@/screens/admin/Inventory';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();
  return (
    <AuthorizeProtect module="car" action="view">
      <InventoryComponent />
    </AuthorizeProtect>
  );
};

export default Page;

