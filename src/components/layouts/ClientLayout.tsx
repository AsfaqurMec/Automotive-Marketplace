/**
 * Client Layout Component - NextDeal Frontend
 *
 * This component contains all client-side logic for the layout,
 * including hooks, state management, and client-side providers.
 * It's separated from the root layout to allow metadata export.
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
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import i18n from '../../i18n';
import { usePathname } from 'next/navigation';
import { safeLocalStorage } from '../../lib/utils/secureStorage';
import { CurrencyProvider } from '@/lib/hooks/CurrencyProvider';
import { I18nextProvider } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import useAuth from '@/lib/hooks/useAuth';
import CustomLoaderForComponent from '@/components/ui/CustomLoaderForComponent';

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Component that handles auth loading states - must be inside QueryClientProvider
function AuthLoaderHandler() {
  const pathname = usePathname();
  const { isLoggingIn, isLoggingOut, setIsLoggingIn, setIsLoggingOut } = useAuth();

  // Clear loading states when navigation completes
  useEffect(() => {
    // If we're logging in and we've reached the dashboard, clear the loading state
    if (isLoggingIn && pathname === '/admin/dashboard') {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        setIsLoggingIn(false);
      }, 100);
      return () => clearTimeout(timer);
    }

    // If we're logging out and we've reached the signin/home page, clear the loading state
    if (isLoggingOut && (pathname === '/signin' || pathname === '/')) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        setIsLoggingOut(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, isLoggingIn, isLoggingOut, setIsLoggingIn, setIsLoggingOut]);

  // Show loader if logging in or out
  if (isLoggingIn || isLoggingOut) {
    return <CustomLoaderForComponent />;
  }

  return null;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const { i18n: i18nInstance } = useTranslation();
  const [isRTL, setIsRTL] = useState(i18nInstance.language === 'he');

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
    // Function to update document direction and language
    const updateDocumentAttributes = () => {
      const currentLang = i18n.language || 'en';
      const dir = currentLang === 'he' ? 'rtl' : 'ltr';
      setIsRTL(currentLang === 'he');
      
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', currentLang);
        // Update ToastContainer RTL
        const toastContainer = document.querySelector('.Toastify');
        if (toastContainer) {
          (toastContainer as HTMLElement).setAttribute('dir', dir);
        }
      }
    };

    // Initial setup
    updateDocumentAttributes();

    // Listen for language changes
    i18n.on('languageChanged', updateDocumentAttributes);

    // Cleanup listener on unmount
    return () => {
      i18n.off('languageChanged', updateDocumentAttributes);
    };
  }, []);

  return (
    <>
      {/* Material-UI cache provider for Next.js App Router */}
      <AppRouterCacheProvider>
        {/* Theme context provider for dark/light mode switching */}
        <ColorModeContext.Provider value={colorMode}>
          {/* Material-UI theme provider */}
          <ThemeProvider theme={theme}>
            {/* React Query provider for data fetching */}
            <QueryClientProvider client={queryClient}>
              {/* I18n provider for translations */}
              <I18nextProvider i18n={i18n}>
                {/* CSS baseline for consistent styling */}
                <CssBaseline />

                {/* Global loader for login/logout navigation - must be inside QueryClientProvider */}
                <AuthLoaderHandler />

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
                rtl={isRTL}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              </I18nextProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </AppRouterCacheProvider>
    </>
  );
}

