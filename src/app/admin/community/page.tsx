'use client';
import CommunityScreen from '@/screens/CommunityScreen';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();
  return <CommunityScreen />;
};

export default Page;

