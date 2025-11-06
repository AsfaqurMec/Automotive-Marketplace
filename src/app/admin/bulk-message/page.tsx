'use client';
import dynamic from 'next/dynamic';
const BulkMessage = dynamic(() => import('@/components/admin/ui/table/BulkMessagePage'), {
  ssr: false,
});
const page = () => {
  return <BulkMessage />;
};
export default page;

