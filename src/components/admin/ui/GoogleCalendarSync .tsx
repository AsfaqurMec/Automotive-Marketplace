'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SiGooglecalendar } from 'react-icons/si';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { secureTokenStorage } from '../../../lib/utils/secureStorage';

const CalendarComponent: React.FC = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [needSync, setNeedSync] = useState(false);

  const getGoogleCalenderEvent = useCallback(async () => {
    try {
      const accessToken = secureTokenStorage.getGoogleAccessToken();
      if (accessToken === undefined) {
        // toast.error(t('noGoogleAccessToken'));
        setNeedSync(true);
        return;
      }

      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads/calendar/events`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        },
      );

      setEvents(res.data?.items || []);
      toast.success(t('syncedCalendar'));
      setNeedSync(false);
    } catch {
      toast.error(t('failedToSyncGoogleCalendar'));
      setNeedSync(true);
    } finally {
      setLoading(false);
    }
  }, [t]);
  useEffect(() => {
    if (secureTokenStorage.getGoogleAccessToken() === undefined) {
      setNeedSync(true);
      getGoogleCalenderEvent();

    } else {
      toast.success(t('googleCalendarSynced'));
    }
  }, [getGoogleCalenderEvent]);
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar',
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const accessToken = tokenResponse.access_token;
      const refreshToken = (tokenResponse as { refresh_token?: string }).refresh_token;

      if (accessToken) {
        secureTokenStorage.setGoogleAccessToken(accessToken);
      }

      if (refreshToken) {
        secureTokenStorage.setGoogleRefreshToken(refreshToken);
      }

      await getGoogleCalenderEvent();
    },
    onError: () => {
      toast.error(t('googleLoginFailed'));
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Button
        onClick={() => login({})}
        variant="contained"
        color="primary"
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SiGooglecalendar size={20} />
          )
        }
        disabled={loading}
      >
        {needSync ? t('syncGoogleCalendar') : t('resyncGoogleCalendar')}
      </Button>

      {!loading && events.length > 0 && (
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            {t('eventsSynced', { count: events.length })}
          </Typography>
          <Alert severity="success" sx={{ mt: 1 }}>
            {t('googleCalendarAlreadySynced')}
          </Alert>
        </Box>
      )}

      {!loading && !needSync && events.length >= 0 && (
        <Box mt={2}>
          <Alert severity="success">{t('googleCalendarSynced')}</Alert>
        </Box>
      )}
      {!loading && needSync && (
        <Box mt={2}>
          <Alert severity="warning">{t('needGoogleCalendarSync')}</Alert>
        </Box>
      )}
    </Box>
  );
};

const GoogleCalendarSync: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_Google_Client_id as string}>
      <CalendarComponent />
    </GoogleOAuthProvider>
  );
};

export default GoogleCalendarSync;

