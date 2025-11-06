'use client';

import dynamic from 'next/dynamic';
import AuthorizeProtect from '@/lib/hooks/AuthorizeProtect';
const SubscriptionManager = dynamic(() => import('@/components/admin/ui/SubscriptionManager'), {
  ssr: false,
});

const Page: React.FC = () => {
  return (
    <AuthorizeProtect module="ads" action="create">
      <SubscriptionManager />
    </AuthorizeProtect>
  );
};

export default Page;

