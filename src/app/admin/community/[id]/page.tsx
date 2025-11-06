'use client';
import React from 'react';
import CommunityScreen from '@/screens/CommunityScreen';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page: React.FC = () => {
  useProtectedRoute();
  return <CommunityScreen />;
};

export default Page;
