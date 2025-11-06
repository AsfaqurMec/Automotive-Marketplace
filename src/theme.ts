/**
 * Theme Configuration - NextDeal Frontend
 *
 * This file defines the Material-UI theme configuration for the NextDeal application.
 * It includes light and dark mode support, custom color palette, typography,
 * and component style overrides.
 *
 * Features:
 * - Dynamic theme switching (light/dark mode)
 * - Custom color palette with brand colors
 * - Responsive typography with Rubik font
 * - Component-specific style overrides
 * - Local storage persistence for theme preference
 */

'use client';
import { createTheme, Theme } from '@mui/material/styles';
import { createContext, useMemo, useState } from 'react';
import { safeLocalStorage } from './lib/utils/secureStorage';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
    toggleColorMode: () => void;
}

/**
 * Theme settings configuration function
 * @param {string} mode - 'light' or 'dark' mode
 * @returns {object} Material-UI theme configuration object
 */
const themeSettings = (mode: ColorMode) => ({
  palette: {
    mode,
    // Primary brand color - gold/yellow theme
    primary: {
      main: '#C8A457',
      contrastText: '#FFFFFF',
    },
    // Secondary color - dark gray
    secondary: {
      main: '#323232',
      contrastText: '#FFFFFF',
    },
    // Conditional styling based on theme mode
    ...(mode === 'light'
      ? {
        // Light mode colors
        background: {
          default: '#FFFFFF',
          paper: '#F5F5F5',
        },
        text: {
          primary: '#323232',
          secondary: '#C4A76F',
          main: '#1E1E1E',
        },
      }
      : {
        // Dark mode colors
        background: {
          default: '#121212',
          paper: '#1E1E1E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#C4A76F',
          main: '#E0E0E0',
        },
      }),
  },
  // Typography configuration with Rubik font family
  typography: {
    fontFamily: 'var(--font-rubik), "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, color: '#323232' },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600, color: '#323232' },
    h4: { fontSize: '1.25rem', fontWeight: 600, color: '#1E1E1E' },
    h5: { fontSize: '1rem', fontWeight: 600, color: '#1E1E1E' },
    h6: { fontSize: '1rem', fontWeight: 500, color: '#1E1E1E' },
    body1: { fontSize: '1rem' },
    button: { textTransform: 'none' as const, fontWeight: 600 },
  },
  // Component-specific style overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: '8px', fontWeight: 'bold' },
        containedPrimary: {
          backgroundColor: '#C4A76F',
          '&:hover': { backgroundColor: '#B18C4B' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' },
      },
    },
  },
});

// Context for theme mode switching
export const ColorModeContext = createContext<ColorModeContextType>({ toggleColorMode: () => {} });

/**
 * Custom hook for theme management
 * Provides theme switching functionality and persistence
 * @returns {Array} [theme, colorMode] - Current theme and color mode controls
 */
export const useMode = (): [Theme, ColorModeContextType] => {
  // Initialize theme mode from secure storage or default to 'light'
  const [mode, setMode] = useState<ColorMode>(
        safeLocalStorage.getTheme() as ColorMode || 'light',
  );

  // Color mode controls with localStorage persistence
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const newMode = prev === 'light' ? 'dark' : 'light';
          // Persist theme preference to secure storage
          safeLocalStorage.setTheme(newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  // Create theme instance based on current mode
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};

export default useMode;
