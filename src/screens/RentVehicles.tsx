import React from 'react';
import NavigationMenu from '@/components/ui/NavigationButtons';
import CarList from '@/components/ui/Category';
import HomePageCars from '@/components/ui/HomePageCars';
import LocationSearchBar from '@/components/ui/LocationSearchBar';
import colors from '@/components/styles';
import Box from '@mui/material/Box';
import { Vehicle } from '@/types';

const RentVehiclesComponent: React.FC = () => {
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
      <LocationSearchBar text={'Rent Vehicle'} />

      <CarList />

      <HomePageCars
        text={'Rent Car'}
        cars={[0, 1, 3, 4, 5, 6, 7, 8, 9, 10] as unknown as Vehicle[]}
        buttonText={'Rent Car'}
      />
    </Box>
  );
};

export default RentVehiclesComponent;
