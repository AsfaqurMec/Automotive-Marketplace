'use client';
import { Box, Container, Typography, Avatar, Grid, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDealerById } from '@/lib/api/dealer';
import { useQuery } from '@tanstack/react-query';
import { ShareVehicaleApi } from '@/lib/api/shareVehicale';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

interface Dealer {
    _id: string;
    fullName: string;
    email: string;
    profileImage?: string;
}

interface Vehicle {
    _id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    fuelType: string;
    transmission: string;
    mileage: number;
    condition: string;
    status: string;
    type: string;
    postedBy: string;
    public: boolean;
    media?: Array<{ url: string }>;
    location?: {
        city: string;
        country: string;
    };
}

const DealerPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDealer = async () => {
      try {
        const res = await getDealerById(id as string);
        setDealer(res.data);
      } catch {
        setError('Failed to fetch dealer');
      } finally {
        setLoading(false);
      }
    };

    fetchDealer();
  }, [id]);

 // console.log('dealer', dealer);
 // console.log('id', id);

  const { data } = useQuery({
    queryKey: ['get-vehicale'],
    queryFn: () => {
      if (!dealer) throw new Error('Dealer not found');
      return ShareVehicaleApi.getDealerVehicale();
    },
  });
  const filteredVehicles = data?.data?.filter(
    (item: Vehicle) => item?.postedBy === dealer?._id && item?.public === true,
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!dealer) return <p>No dealer found.</p>;

  return (
    <Box sx={{ bgcolor: '#fdfdfd', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: 'white',
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h3" fontWeight="bold">
              {t('profile')}
            </Typography>
          </Box>

          {/* Avatar and Name */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} md="auto">
              <Box textAlign="center">
                <Avatar
                  src={dealer.profileImage}
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 1 }}
                />
                <Typography variant="body2" fontWeight="medium">
                  {t('profilePicture')}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md>
              <Typography variant="h5" fontWeight="bold">
                {dealer.fullName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {dealer.email}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* --- User Vehicles Section --- */}
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign={'center'}>
            {t('yourVehicles')}
          </Typography>

          {filteredVehicles?.length === 0 ? (
            <Typography>{t('notFound')}</Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredVehicles?.map((vehicle: Vehicle) => (
                <Grid key={vehicle._id} item xs={12} sm={6} md={4} lg={6}>
                  <Link href={`/cars/${vehicle._id}`} passHref style={{ textDecoration: 'none', color: 'black' }}>
                  <Box
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 2,
                      boxShadow: 2,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    {/* Image */}
                    <Box
                      component="img"
                      src={vehicle.media?.[0]?.url || '/no-image.jpg'}
                      alt={vehicle.title}
                      sx={{
                        width: '100%',
                        height: 300,
                        objectFit: 'cover',
                      }}
                    />

                    {/* Details */}
                    <Box p={2} flexGrow={1}>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        noWrap
                      >
                        {vehicle.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {vehicle.brand} • {vehicle.model} • {vehicle.year}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {vehicle.location?.city},{' '}
                        {vehicle.location?.country}
                      </Typography>

                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                        mt={1}
                      >
                                                Price: ${vehicle.price}
                      </Typography>

                      <Typography variant="h6" fontWeight="bold" mt={3}>
                                                Other Details:
                      </Typography>

                      <Grid container spacing={1} mt={0}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                                                        Fuel: {vehicle.fuelType}
                          </Typography>
                          <Typography variant="body2">
                                                        Trans: {vehicle.transmission}
                          </Typography>
                          <Typography variant="body2">
                                                        Mileage: {vehicle.mileage} km
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                                                        Condition: {vehicle.condition}
                          </Typography>
                          <Typography variant="body2">
                                                        Status: {vehicle.status}
                          </Typography>
                          <Typography variant="body2">
                                                        Type: {vehicle.type}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default DealerPage;
