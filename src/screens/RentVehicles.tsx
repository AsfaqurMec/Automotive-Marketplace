import React from 'react';
import { useTranslation } from 'react-i18next';
import NavigationMenu from '@/components/ui/NavigationButtons';
import CarList from '@/components/ui/Category';
import HomePageCars from '@/components/ui/HomePageCars';
import LocationSearchBar from '@/components/ui/LocationSearchBar';
import colors from '@/components/styles';
import Box from '@mui/material/Box';
import { Vehicle } from '@/types';

const RentVehiclesComponent: React.FC = () => {
  const { t } = useTranslation();
  const bgColor = colors.background;

  const foreground = colors.foreground;
  return (
    <Box
      sx={{
        width: '100%',
        background: foreground,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '80%',
          textAlign: 'center',
          margin: 'auto',
          background: bgColor,
          my: 3,
        }}
      >
        <NavigationMenu />
      </Box>
      <LocationSearchBar text={t('rentVehicle')} />

      <CarList />

      <HomePageCars
        text={t('rentCar')}
        cars={[0, 1, 3, 4, 5, 6, 7, 8, 9, 10] as unknown as Vehicle[]}
        buttonText={t('rentCar')}
      />
    </Box>
  );
};

export default RentVehiclesComponent;
