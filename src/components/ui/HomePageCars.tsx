import React from 'react';
import { Box } from '@mui/material';
import CarCard from './CarCard';
import { Vehicle } from '@/types';

const HomePageCars = ({ cars }: { text?: string, cars: Vehicle[], buttonText?: string }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {cars.map((car, index) => (
        <CarCard key={index} car={car} />
      ))}
    </Box>
  );
};

export default HomePageCars;

