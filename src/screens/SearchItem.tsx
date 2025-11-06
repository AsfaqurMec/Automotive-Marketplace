import React from 'react';
import { Box, Grid } from '@mui/material';
import ReviewSection from '@/components/ui/ReviewSection';
import SpecificationCard from '@/components/ui/CarSpecification';
import CarListing from '@/components/ui/CarListing';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { vehicaleApi } from '@/lib/api/vehicale';
//import useAuth from '@/lib/hooks/useAuth';
//import { User } from '@/types';

const CarDetails: React.FC = () => {
  const { slug } = useParams();
  // const { user } = useAuth() as { user: User | null };
  const { data } = useQuery({
    queryKey: ['car', slug],
    queryFn: () => vehicaleApi.getVehicaleById(slug as string),
    enabled: !!slug,
  });

  return (
    <Box sx={{ maxWidth: '1800px', m: 'auto' }}>
      <CarListing car={data} />
      <Box
        sx={{
          padding: { xs: 2, md: 5 },
          marginTop: 2,
          display: 'flex',
          gap: 4,
          flexDirection: { xs: 'column', lg: 'row-reverse' },
        }}
      >
        <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <SpecificationCard car={data} />
            <ReviewSection />
          </Box>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row', lg: 'column' },
            flexWrap: 'wrap',
            gap: 2,
            flexShrink: 0,
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default CarDetails;
