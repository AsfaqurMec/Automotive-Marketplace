'use client';

import React, { useMemo, useState } from 'react';
import { Box, Typography, Menu, MenuItem, IconButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, Link as MLink } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import colors from '../styles';
import i18n from '@/i18n';
import { useCurrency } from '@/lib/hooks/CurrencyProvider';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

type Lang = 'en' | 'he' | 'bn';

const LANGUAGE_LABEL: Record<Lang, string> = {
  en: 'English',
  he: 'Hebrew',
  bn: 'Bengali',
};

const LANGUAGE_FLAG: Record<Lang, string> = {
  en: '🇺🇸',
  he: '🇮🇱',
  bn: '🇧🇩',
};

const CURRENCY_FLAG: Record<'USD' | 'BDT' | 'INR', string> = {
  USD: '🇺🇸',
  BDT: '🇧🇩',
  INR: '🇮🇳',
};

export default function TopBar(): React.JSX.Element {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const { primary, white } = colors as { primary: string; white: string };

  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const [currAnchor, setCurrAnchor] = useState<null | HTMLElement>(null);

  const currentLang = (i18n.language as Lang) || 'en';
  const { currency, setCurrency } = useCurrency();

  const currentLangLabel = useMemo(() => LANGUAGE_LABEL[currentLang] || 'English', [currentLang]);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        px: 2,
        py: 0.5,
        backgroundColor: primary,
        color: white,
      }}
    >
      {/* Left: Social icons + contact email */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton size="small" component="a" href="https://facebook.com" target="_blank" rel="noopener noreferrer" sx={{ color: white }}>
          <FacebookIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton size="small" component="a" href="https://x.com" target="_blank" rel="noopener noreferrer" sx={{ color: white }}>
          <XIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton size="small" component="a" href="https://instagram.com" target="_blank" rel="noopener noreferrer" sx={{ color: white }}>
          <InstagramIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <IconButton size="small" component="a" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" sx={{ color: white }}>
          <LinkedInIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <MLink href="mailto:contact@nextdeal.com" underline="none" sx={{ color: white, fontSize: 12 }}>
          contact@nextdeal.com
        </MLink>
      </Box>

      {/* Right: Currency and Language */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          size="small"
          onClick={(e) => setCurrAnchor(e.currentTarget)}
          sx={{
            borderRadius: 1,
            px: 1,
            height: 32,
            backgroundColor: 'transparent',
            color: white,
          }}
        >
          <Typography sx={{ mr: 0.5 }}>{CURRENCY_FLAG[currency]}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: white }}>{currency}</Typography>
          <ExpandMoreIcon sx={{ fontSize: 18, ml: 0.25 }} />
        </IconButton>
        <Menu
          anchorEl={currAnchor}
          open={Boolean(currAnchor)}
          onClose={() => setCurrAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {(['USD', 'BDT', 'INR'] as const).map((c) => (
            <MenuItem
              key={c}
              selected={currency === c}
              onClick={() => {
                setCurrency(c);
                setCurrAnchor(null);
              }}
            >
              <ListItemIcon>
                <span style={{ fontSize: 18 }}>{CURRENCY_FLAG[c]}</span>
              </ListItemIcon>
              <ListItemText primary={c} />
            </MenuItem>
          ))}
        </Menu>
        {/* Language selector */}
        <IconButton
          size="small"
          onClick={(e) => setLangAnchor(e.currentTarget)}
          sx={{
            borderRadius: 1,
            px: 1,
            height: 32,
            backgroundColor: 'transparent',
            color: white,
          }}
        >
          <Typography sx={{ mr: 0.5 }}>{LANGUAGE_FLAG[currentLang]}</Typography>
          {!isXs && (
            <Typography variant="body2" sx={{ fontWeight: 600, color: white }}>
              {currentLangLabel}
            </Typography>
          )}
          <ExpandMoreIcon sx={{ fontSize: 18, ml: 0.25 }} />
        </IconButton>
        <Menu
          anchorEl={langAnchor}
          open={Boolean(langAnchor)}
          onClose={() => setLangAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {(['en', 'he', 'bn'] as const).map((lng) => (
            <MenuItem
              key={lng}
              selected={currentLang === lng}
              onClick={() => {
                i18n.changeLanguage(lng);
                // Direction change if needed for Hebrew
                if (typeof window !== 'undefined') {
                  document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
                }
                setLangAnchor(null);
              }}
            >
              <ListItemIcon>
                <span style={{ fontSize: 18 }}>{LANGUAGE_FLAG[lng]}</span>
              </ListItemIcon>
              <ListItemText primary={LANGUAGE_LABEL[lng]} />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
}


