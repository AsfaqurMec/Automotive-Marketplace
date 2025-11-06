'use client';

import dynamic from 'next/dynamic';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
const NewAdvertisementScreen = dynamic(() => import('@/screens/admin/NewAdvertisementScreen'), {
  ssr: false,
});

const Page = () => {
  return (
    <AuthorizeProtect module="ads" action="create">
      <NewAdvertisementScreen />
    </AuthorizeProtect>
  );
};

export default Page;

