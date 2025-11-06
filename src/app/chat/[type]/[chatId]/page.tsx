'use client';

import React from 'react';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';
import { ChatWindow } from '@/components/ui/chats/ChatWindow';

const Page: React.FC = () => {
  useProtectedRoute();

  return <ChatWindow />;
};

export default Page;
