/**
 * Next.js Configuration - NextDeal Frontend
 * 
 * This file configures Next.js settings for the NextDeal application.
 * It includes URL rewrites for file uploads, development settings,
 * and other Next.js-specific configurations.
 * 
 * Features:
 * - URL rewrites for serving uploaded files from API server
 * - Development mode settings
 * - Performance optimizations
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
    // URL rewrites for serving static files from the API server
    async rewrites() {
        return [
            {
                // Rewrite upload URLs to proxy to the API server
                // This allows serving uploaded files (images, documents) from the API
                source: '/uploads/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/uploads/:path*`,
            },
        ];
    },
    
    // React Strict Mode - disabled for development flexibility
    // Note: Consider enabling in production for better error detection
    reactStrictMode: false,
};

export default nextConfig;
  