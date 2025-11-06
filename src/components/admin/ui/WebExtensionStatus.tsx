import React from 'react';
import { Box, Button, Typography, Grid, useMediaQuery, useTheme } from '@mui/material';
import colors from '@/components/styles';
import { useTranslation } from 'react-i18next';

const WebExtensionStatus: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { foreground, text, background } = colors;

  const headingStyle = {
    color: text,
    textAlign: isMobile ? 'center' : 'end',
    fontFamily: 'Rubik',
    fontSize: '28px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    letterSpacing: '-0.114px',
    my: 3,
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4, minHeight: '50vh', backgroundColor: foreground }}>
      <Typography
        variant="subtitle1"
        align={isMobile ? 'center' : 'right'}
        sx={headingStyle}
        mb={2}
      >
        {t('importContacts')}
      </Typography>

      <Box
        sx={{
          p: isMobile ? 2 : 4,
          background: background,
          maxHeight: '600px',
          borderRadius: 2,
        }}
      >
        <Grid
          container
          spacing={4}
          direction={isMobile ? 'column' : 'row'}
          justifyContent={isMobile ? 'center' : 'space-between'}
          alignItems="center"
          sx={{ width: '100%' }}
        >
          {/* Image Section */}
          <Grid item xs={12} md={6} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
            <Box
              component="img"
              src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*S4gqxFvorS66ZFslGXJQXw.png"
              alt="Extension Graphic"
              sx={{
                maxWidth: isMobile ? '100%' : '353px',
                width: '100%',
                height: 'auto',
                borderRadius: 2,
              }}
            />
          </Grid>

          {/* Text Section */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                maxWidth: '306px',
                mx: isMobile ? 'auto' : 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'center' : 'flex-end',
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={headingStyle}
                gutterBottom
              >
                {t('webExtensionInactive')}
              </Typography>
              <Typography
                variant="body1"
                mb={3}
                textAlign={isMobile ? 'center' : 'right'}
              >
                {t('activateWebExtension')}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#c5a25b',
                  maxWidth: '269px',
                  width: '100%',
                }}
              >
                {t('goToWebExtensionPage')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WebExtensionStatus;

