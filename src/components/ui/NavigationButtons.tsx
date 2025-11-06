'use client';
import React from 'react';
import { Button, Stack, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import colors from '../styles';

const menuItems = [
  { name: 'Agencies', url: '/recommended-agencies' },
  { name: 'Recommended Garages', url: '/certified-garages' },
  { name: 'Spare Parts Marketplace', url: '/marketplace' },
  { name: 'Rent Vehicles', url: '/rent-vehicles' },
  { name: 'Hot Vehicles', url: '/hot-vehicles' },
];

const NavigationMenu: React.FC = () => {
  const pathname = usePathname();
  const textBlack = colors.textBlack;
  const foreground = colors.foreground;
  const primary = colors.primary;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        pb: 1,
        justifyContent: 'center',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          mt: 2,
          alignItems: { xs: 'center', sm: 'center' },
          width: '95%',
          justifyContent: 'center',
          background: foreground,
          m: 2,
        }}
      >
        {menuItems.map((item, index) => {
          const isActive = pathname === item.url;

          return (
            <Link key={index} href={item.url} passHref>
              <Button
                variant="text"
                sx={{
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? foreground : textBlack,
                  background: isActive ? primary : 'transparent',
                  borderRadius: 0,
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: 'flex-start',
                  '&:hover': {
                    color: primary,
                    background: '#f4f4f4',
                  },
                }}
              >
                {item.name}
              </Button>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
};

export default NavigationMenu;

