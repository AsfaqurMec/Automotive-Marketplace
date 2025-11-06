'use client';
import ProductsList from '@/screens/admin/ProductsList';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';

const Page = () => {
  return (
    <AuthorizeProtect module="leads" action="view">
      <ProductsList />
    </AuthorizeProtect>
  );
};

export default Page;

