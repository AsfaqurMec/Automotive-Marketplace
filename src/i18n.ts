/**
 * Internationalization (i18n) Configuration - NextDeal Frontend
 *
 * This file configures the internationalization system for the NextDeal application.
 * It supports multiple languages with automatic language detection and
 * provides translation resources for English, Hebrew (with RTL support), and Bengali.
 *
 * Supported Languages:
 * - English (en) - Default language, LTR
 * - Hebrew (he) - RTL language support
 * - Bengali (bn) - Bengali language support
 *
 * Features:
 * - Automatic language detection from browser
 * - Fallback to English if translation is missing
 * - RTL support for Hebrew language
 * - Translation interpolation and formatting
 */

'use client';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en.json';
import translationHE from './locales/he.json';
import translationBN from './locales/bn.json';

// Define available translation resources
const resources = {
  en: {
    translation: translationEN,
  },
  he: {
    translation: translationHE,
  },
  bn: {
    translation: translationBN,
  },
};

// Initialize i18n with configuration
i18n.use(LanguageDetector) // Enable automatic language detection
  .use(initReactI18next) // Initialize React i18next
  .init({
    resources, // Translation resources object
    fallbackLng: 'en', // Fallback language if translation is missing
    debug: false, // Disable debug mode in production

    // Interpolation settings for dynamic content
    interpolation: {
      escapeValue: false, // Don't escape HTML in translations
    },

    // Namespace configuration
    defaultNS: 'translation', // Default namespace
    ns: ['translation'], // Available namespaces
  });

export default i18n;
