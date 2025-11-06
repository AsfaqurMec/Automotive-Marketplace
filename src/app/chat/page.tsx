'use client';
import ChatScreen from '@/screens/Chat/ChatScreen';
import useProtectedRoute from '@/lib/hooks/useProtectedRoute';

const Page = () => {
  useProtectedRoute();

  return <ChatScreen />;
};

export default Page;

