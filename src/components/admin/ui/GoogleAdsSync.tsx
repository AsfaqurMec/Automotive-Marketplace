'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { MdAdsClick } from 'react-icons/md'; // Example, replace if needed
import Cookies from 'js-cookie';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { getTokens } from '@/lib/api/campaign';
import { useTranslation } from 'react-i18next';
import useAuth from '@/lib/hooks/useAuth';
// Make sure to replace this with an actual Ads icon if available and preferred
const GoogleAdsIcon = MdAdsClick;

interface AdsComponentProps {
  setHasAccessToken: (value: boolean) => void;
}

const AdsComponent = ({ setHasAccessToken }: AdsComponentProps) => {
  const [adData] = useState([]); // Changed from 'events' to 'adData'
  const [loading, setLoading] = useState(false);
  const [needSync, setNeedSync] = useState(false); // True if a sync action is required
  const { t } = useTranslation();
  const { user } = useAuth();
  const getGoogleAdsData = useCallback(async () => {
    const accessToken = Cookies.get('google_ads_accessToken');
    if (!accessToken) {
      setNeedSync(true);
      setLoading(false);
      return;
    }
    setNeedSync(false);
    setLoading(false);
  }, []); // useCallback to memoize the function

  useEffect(() => {
    const token = Cookies.get('google_ads_accessToken');

    if (token) {
      // We have a token, let's try to get data.
      // getGoogleAdsData will manage needSync based on outcome.
      getGoogleAdsData();
    } else {
      // No token, user definitely needs to initiate sync.
      setNeedSync(true);
    }
  }, [getGoogleAdsData]); // Include getGoogleAdsData in dependency array

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/adwords', // Your required scopes
    flow: 'auth-code', //  <--- IMPORTANT: Use authorization code flow
    onSuccess: async () => {
      setLoading(true);

      // Send the authorization code to your backend
      try {
        // TODO: This needs to be fixed - getTokens expects { dealerId: string }
        // For now, we'll need to get the dealerId from context or props
        const dealerId = user?._id; // This should come from user context
        const backendResponse = await getTokens({ dealerId: dealerId || '' });

        // The response structure should match the API definition
        const { tokens } = backendResponse.data;
        const accessToken = tokens[0]; // Assuming first token is access token

        if (accessToken) {
          Cookies.set('google_ads_accessToken', accessToken, {
            expires: 1 / 24, // 1 hour
            sameSite: 'Strict',
            // secure: process.env.NODE_ENV === 'production',
          });
          setHasAccessToken(true);

          toast.success('Successfully connected to Google Ads!');
          await getGoogleAdsData();
        } else {
          setHasAccessToken(false);

          toast.error('Failed to retrieve access token from backend.');
        }
      } catch (error) {
      //  console.log(error);
        toast.error('Failed to complete Google login with backend.');
      } finally {
        // setLoading(false); // setLoading should be handled by getGoogleAdsData or based on backend response
      }
    },
    onError: () => {
      toast.error('Google login failed. Please try again.');
      setLoading(false);
    },
  });
  const hasAccessToken = !!Cookies.get('google_ads_accessToken');

  return (
    <Box sx={{ p: 3 }}>
      <Button
        onClick={() => login()}
        variant="contained"
        color="primary"
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <GoogleAdsIcon size={20} />
          )
        }
        disabled={loading}
      >
        {loading
          ? t('processing', 'Processing...')
          : needSync || !hasAccessToken
            ? t('syncGoogleAds', 'Sync Google Ads')
            : t('resyncGoogleAds', 'Re-sync Google Ads')}
      </Button>

      {loading && (
        <Box mt={2} display="flex" justifyContent="center">
          <CircularProgress />
          <Typography sx={{ ml: 1 }}>
            {t('loadingAdsData', 'Loading Ads Data...')}
          </Typography>
        </Box>
      )}

      {!loading && hasAccessToken && !needSync && (
        <Box mt={2}>
          <Alert severity="success" sx={{ mt: 1 }}>
            {t('googleAdsIsSynced', 'Google Ads is synced.')}
            {/* You can display a count or summary if adData is populated */}
            {adData.length > 0
              ? ` ${t('foundDataEntries', { count: adData.length, defaultValue: 'Found {{count}} data entries.' })}`
              : ` ${t('noNewDataEntries', 'No new data entries found or data is not itemized here.')}`}
          </Alert>
        </Box>
      )}

      {!loading && (needSync || !hasAccessToken) && (
        <Box mt={2}>
          <Alert severity={hasAccessToken && needSync ? 'warning' : 'info'}>
            {hasAccessToken && needSync
              ? t(
                'googleAdsNeedsResync',
                'Google Ads data needs to be re-synced or there was an issue fetching data.',
              )
              : t(
                'pleaseSyncGoogleAds',
                'Please sync with Google Ads to fetch your advertising data.',
              )}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

interface GoogleAdsSyncProps {
  setHasAccessToken: (value: boolean) => void;
}

const GoogleAdsSync = ({ setHasAccessToken }: GoogleAdsSyncProps) => {
  const { t } = useTranslation();
  // IMPORTANT: Ensure process.env.NEXT_PUBLIC_Google_Client_id is correctly configured
  // in your Google Cloud  for Google Ads API access.
  // This might be the same or different from your Calendar client ID.
  if (!process.env.NEXT_PUBLIC_Google_Client_id) {
    toast.error(
      'Google Client ID is not configured. Check .env.local or your environment variables for NEXT_PUBLIC_Google_Client_id',
    );
    return (
      <Alert severity="error">
        {t(
          'googleClientIdNotConfigured',
          'Google Client ID is not configured. Ads sync cannot be initialized.',
        )}
      </Alert>
    );
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_Google_Client_id}>
      <AdsComponent setHasAccessToken={setHasAccessToken} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAdsSync;

