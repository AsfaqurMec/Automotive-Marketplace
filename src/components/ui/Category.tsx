import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import colors from '../styles';
const cars = [
  {
    name: 'SUV',
    image: 'https://media.istockphoto.com/id/858181030/vector/modern-generic-car-side-view-of-realistic-detailed-vector-car-middle-class-sedan-isolated-on.jpg?s=1024x1024&w=is&k=20&c=dQNT7Au_AXG6BfGxko5mwbEyikofIK2HaBmhG_o1ufA=',
  },
  {
    name: 'Sedan',
    image: 'https://media.istockphoto.com/id/858181030/vector/modern-generic-car-side-view-of-realistic-detailed-vector-car-middle-class-sedan-isolated-on.jpg?s=1024x1024&w=is&k=20&c=dQNT7Au_AXG6BfGxko5mwbEyikofIK2HaBmhG_o1ufA=',
  },
  {
    name: 'SUV',
    image: 'https://media.istockphoto.com/id/858181030/vector/modern-generic-car-side-view-of-realistic-detailed-vector-car-middle-class-sedan-isolated-on.jpg?s=1024x1024&w=is&k=20&c=dQNT7Au_AXG6BfGxko5mwbEyikofIK2HaBmhG_o1ufA=',
  },
  {
    name: 'Sedan',
    image: 'https://media.istockphoto.com/id/858181030/vector/modern-generic-car-side-view-of-realistic-detailed-vector-car-middle-class-sedan-isolated-on.jpg?s=1024x1024&w=is&k=20&c=dQNT7Au_AXG6BfGxko5mwbEyikofIK2HaBmhG_o1ufA=',
  },
  {
    name: 'SUV',
    image: 'https://media.istockphoto.com/id/858181030/vector/modern-generic-car-side-view-of-realistic-detailed-vector-car-middle-class-sedan-isolated-on.jpg?s=1024x1024&w=is&k=20&c=dQNT7Au_AXG6BfGxko5mwbEyikofIK2HaBmhG_o1ufA=',
  },
  {
    name: 'Sedan',
    image: 'https://media.istockphoto.com/id/858181030/vector/modern-generic-car-side-view-of-realistic-detailed-vector-car-middle-class-sedan-isolated-on.jpg?s=1024x1024&w=is&k=20&c=dQNT7Au_AXG6BfGxko5mwbEyikofIK2HaBmhG_o1ufA=',
  },
  {
    name: 'SUV',
    image: 'https://media.istockphoto.com/id/858181030/vector/modern-generic-car-side-view-of-realistic-detailed-vector-car-middle-class-sedan-isolated-on.jpg?s=1024x1024&w=is&k=20&c=dQNT7Au_AXG6BfGxko5mwbEyikofIK2HaBmhG_o1ufA=',
  },
];

const CarList: React.FC = () => {
  const bgColor = colors.background;

  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        gap: 2,
        justifyContent: 'center',
        '&::-webkit-scrollbar': { display: 'none' },
        width: '100%',
        my: 4,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 3,
          justifyContent: 'center',
          '&::-webkit-scrollbar': { display: 'none' },
          width: '85%',
          flexWrap: 'wrap',
        }}
      >
        {cars.map((car, index) => (
          <Card
            key={index}
            sx={{
              minWidth: '12%',
              textAlign: 'center',
              boxShadow: 3,
              background: bgColor,
            }}
          >
            <CardMedia component="img" height="90" image={car.image} alt={car.name} />
            <CardContent>
              <Typography variant="body2" fontWeight="bold">
                {car.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>{' '}
    </Box>
  );
};

export default CarList;

