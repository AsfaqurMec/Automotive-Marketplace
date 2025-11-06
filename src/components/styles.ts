/**
 * Design System Colors - NextDeal Frontend
 *
 * This file defines the color palette and design tokens used throughout the NextDeal application.
 * It provides consistent colors for branding, UI elements, and user interface components.
 *
 * Color Palette:
 * - Primary: Gold/yellow theme for brand identity
 * - Secondary: Dark grays and navy for text and accents
 * - Background: Clean whites and light grays
 * - Accent: Red for alerts and important actions
 *
 * Usage:
 * Import this file in components to maintain consistent styling
 * and ensure brand compliance across the application.
 */

interface Colors {
    // Background colors
    background: string; // Main background color
    foreground: string; // Secondary background color

    // Text colors
    gray1: string; // Light gray for secondary text
    text: string; // Primary text color
    textBlack: string; // Dark text for headings
    grayText: string; // Gray text for secondary text
    // Brand colors
    navyBlue: string; // Navy blue for accents
    primary: string; // Primary brand color (gold)

    // Sign-up flow colors
    signColor2: string; // Light gold for sign-up backgrounds
    signColor3: string; // Very light gold for subtle backgrounds
    signColor4: string; // Almost white with gold tint

    // Basic colors
    white: string; // Pure white
    black: string; // Pure black

    // Accent colors
    accent: string; // Red accent for alerts and important actions
}

const colors: Colors = {
  // Background colors
  background: '#FFFFFF', // Main background color
  foreground: '#FAFAFA', // Secondary background color

  // Text colors
  gray1: '#A9A9A9', // Light gray for secondary text
  text: '#1E1E1E', // Primary text color
  textBlack: '#00050D', // Dark text for headings
  grayText: '#666666', // Gray text for secondary text
  // Brand colors
  navyBlue: '#1A478B', // Navy blue for accents
  primary: '#C8A457', // Primary brand color (gold)

  // Sign-up flow colors
  signColor2: '#F4DAA0', // Light gold for sign-up backgrounds
  signColor3: '#FFF2D6', // Very light gold for subtle backgrounds
  signColor4: '#FFFDF6', // Almost white with gold tint

  // Basic colors
  white: '#FFFFFF', // Pure white
  black: '#000000', // Pure black

  // Accent colors
  accent: '#F65959', // Red accent for alerts and important actions
};

export default colors;
