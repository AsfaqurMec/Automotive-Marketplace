/**
 * Root Layout Component - NextDeal Frontend
 *
 * This is the main layout wrapper for the entire NextDeal application.
 * It provides global context providers, theme management, internationalization,
 * and responsive layout structure for all pages.
 *
 * Key Features:
 * - Material-UI theme provider with dark/light mode support
 * - Internationalization (i18n) setup with RTL support for Hebrew
 * - React Query client for data fetching and caching
 * - Responsive navigation and footer
 * - Toast notifications
 * - Authentication state management
 */

import { Rubik } from 'next/font/google';
import { Metadata } from 'next';
import ClientLayout from '@/components/layouts/ClientLayout';

// Configure Rubik font for consistent typography across the app
const rubik = Rubik({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

interface RootLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'NextDeal',
  description: 'NextDeal is a platform for buying and selling cars. It is a comprehensive all-in-one automotive solution that connects buyers, sellers, dealers, and garages in one unified platform.',
  keywords: ['NextDeal', 'NextDeal', 'Platform', 'Cars', 'Buying', 'Selling', 'Car', 'Vehicle'],
  authors: [{ name: 'NextDeal', url: 'https://next-deal-marketplace.vercel.app/' }],
  creator: 'NextStar',
  publisher: 'NextStar',
  openGraph: {
    title: 'NextDeal',
    description: 'NextDeal is a platform for buying and selling cars. It is a comprehensive all-in-one automotive solution that connects buyers, sellers, dealers, and garages in one unified platform.',
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${rubik.className} font-sans`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
