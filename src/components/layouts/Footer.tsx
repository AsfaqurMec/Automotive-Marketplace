'use client';
import React from 'react';
import { Box, Typography, Link, IconButton, InputBase } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import colors from '../styles';
import logo from '@/assets/Group_1.svg';
import { FiSend } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const white = colors.white;
  const primary = colors.primary;
  const foreground = colors.foreground;
  return (
    <Box
      sx={{
        backgroundColor: primary,
        color: white,
        py: 4,
        px: { xs: 2, md: 4 },
        textAlign: 'center',
        minWidth: '100%',
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          component="img"
          src={logo?.src}
          alt="logo"
          sx={{ width: '50px', height: '50px' }}
        />
        <Typography variant="h2" sx={{ fontSize: '2rem', color: white }}>
                    NextDeal
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        gap={{ xs: 4, md: 2 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: { xs: '100%', md: '30%' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="body2" fontWeight="bold">
            {t('helpCenter')}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            justifyContent={{ xs: 'center', md: 'flex-start' }}
          >
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">(456) 505-3120</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            justifyContent={{ xs: 'center', md: 'flex-start' }}
          >
            <EmailIcon fontSize="small" />
            <Typography variant="body2">nextdeal789@gmail.com</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            justifyContent={{ xs: 'center', md: 'flex-start' }}
          >
            <LocationOnIcon fontSize="small" />
            <Typography variant="body2">
                            9022 Heatherridge St, Santa Ana, Illinois 85486
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '40%' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="body2">{t('footerDescription')}</Typography>
          <Box mt={3} pt={2} textAlign="center">
            <Typography variant="body2">
              <Link href="#" color="inherit" underline="none">
                {t('privacyPolicy')}
              </Link>{' '}
                            &nbsp;|&nbsp;
              <Link href="#" color="inherit" underline="none">
                {t('termsConditions')}
              </Link>
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '30%' },
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" fontWeight="bold" m={2}>
            {t('contactUsViaEmail')}
          </Typography>
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              borderRadius: '999px',
              px: 2,
              py: 0.5,
              width: '100%',
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={1}
          >
            <InputBase
              placeholder={t('yourEmail')}
              sx={{ ml: 5, flex: 1 }}
              inputProps={{ 'aria-label': t('yourEmail') }}
            />
            <IconButton
              type="submit"
              sx={{
                backgroundColor: '#c79f4c',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#b88f3a',
                },
              }}
              aria-label="send"
            >
              <FiSend />
            </IconButton>
          </Box>
          <Box mt={2} display="flex" justifyContent="center" gap={1}>
            <IconButton sx={{ color: white }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ color: white }}>
              <TwitterIcon />
            </IconButton>
            <IconButton sx={{ color: white }}>
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box textAlign="center" mt={3}>
        <Typography
          variant="caption"
          display="block"
          mt={1}
          sx={{
            color: foreground,
            fontFamily: 'Rubik',
            fontSize: '16px',
            fontWeight: 400,
            opacity: '56%',
          }}
        >
                    &copy; 2024 NextDeal | {t('poweredBy', { provider: 'NextStar' })}
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
