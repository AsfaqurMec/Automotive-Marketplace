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

'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ResponsiveAppBar from '@/components/layouts/Navbar';
import TopBar from '@/components/layouts/TopBar';
import Footer from '@/components/layouts/Footer';
import Box from '@mui/material/Box';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ColorModeContext, useMode } from '@/theme';
import { Rubik } from 'next/font/google';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from '../i18n';
import { usePathname } from 'next/navigation';
import { safeLocalStorage } from '../lib/utils/secureStorage';
import { CurrencyProvider } from '@/lib/hooks/CurrencyProvider';

// Configure Rubik font for consistent typography across the app
const rubik = Rubik({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();

  // Define routes where footer should be hidden (chat, admin, profile pages)
  const hideFooterPatterns = [
    /^\/chat$/,
    /^\/special-route$/,
    /^\/chat\/[^/]+\/[^/]+$/,
    /^\/admin/,
    /^\/profile/,
  ];

  // Theme management hook for dark/light mode
  const [theme, colorMode] = useMode();

  // React Query client for data fetching and caching
  const [queryClient] = useState(() => new QueryClient());

  // Check if footer should be hidden based on current route
  const shouldHideFooter = hideFooterPatterns.some((pattern) => pattern.test(pathname));

  // Initialize internationalization and RTL support
  useEffect(() => {
    // Get language direction from secure storage or default to LTR
    const dir =
            typeof window !== 'undefined'
              ? safeLocalStorage.getLanguage() === 'he'
                ? 'rtl'
                : 'ltr'
              : 'ltr';

    // Set document direction and language attributes
    if (dir) {
      document.documentElement.setAttribute('dir', dir);
    }
    document.documentElement.setAttribute('lang', i18n.language);
  }, []);

  return (
    <html lang="en">
      <body className={`${rubik.className} font-sans`}>
        {/* Material-UI cache provider for Next.js App Router */}
        <AppRouterCacheProvider>
          {/* Theme context provider for dark/light mode switching */}
          <ColorModeContext.Provider value={colorMode}>
            {/* Material-UI theme provider */}
            <ThemeProvider theme={theme}>
              {/* React Query provider for data fetching */}
              <QueryClientProvider client={queryClient}>
                {/* CSS baseline for consistent styling */}
                <CssBaseline />

                {/* Main layout container with flexbox structure */}
                <CurrencyProvider>
                  <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '100vh',
                  }}
                >
                  {/* Upper top bar with language & currency */}
                  <TopBar />

                  {/* Navigation bar - always visible */}
                  <ResponsiveAppBar />

                  {/* Main content area - expands to push footer down */}
                  <Box sx={{ flexGrow: 1 }}>{children}</Box>

                  {/* Footer - hidden on specific routes */}
                  {shouldHideFooter ? null : <Footer />}
                  </Box>
                </CurrencyProvider>

                {/* Toast notifications container */}
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </QueryClientProvider>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
