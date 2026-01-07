'use client';
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  Grid, 
  Divider, 
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Paper
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn, 
  Business,
  DirectionsCar
} from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDealerById } from '@/lib/api/dealer';
import { useQuery } from '@tanstack/react-query';
import { ShareVehicaleApi } from '@/lib/api/shareVehicale';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

interface Dealer {
    _id: string;
    fullName?: string;
    email: string;
    phone?: string;
    companyName?: string;
    profileImage?: string;
    contactPerson?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    },
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
        setDealer(res.data as Dealer);
      } catch (err) {
        setError('Failed to fetch dealer');
      } finally {
        setLoading(false);
      }
    };

    fetchDealer();
  }, [id]);

  const { data } = useQuery({
    queryKey: ['get-vehicale', dealer?._id],
    queryFn: () => {
      if (!dealer) throw new Error('Dealer not found');
      return ShareVehicaleApi.getDealerVehicale();
    },
    enabled: !!dealer?._id,
  });
  
  const filteredVehicles = data?.data?.filter(
    (item: Vehicle) => item?.postedBy === dealer?._id && item?.public === true,
  ) || [];

  // Loading state
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh' 
        }}
      >
        <CircularProgress sx={{ color: '#c8a45e' }} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try again later
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // No dealer found
  if (!dealer) {
    return (
      <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          <Paper 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Dealer Not Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The dealer profile you're looking for doesn't exist.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 0, md: 0 } }}>
        {/* Profile Header Card */}
        <Box
          sx={{
            mb: 3,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          {/* Gold/Bronze Header Section */}
          <Box
            sx={{
              bgcolor: '#c8a45e',
              height: { xs: 100, md: 150 },
              position: 'relative',
              borderRadius: '10px 10px 0 0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          
          {/* White Content Section with Card Effect */}
          <Box
            sx={{
              bgcolor: 'white',
              position: 'relative',
              mt: { xs: -8, md: -10 },
              pt: { xs: 9, md: 11 },
              pb: { xs: 2.5, md: 3 },
              px: { xs: 2.5, md: 3.5 },
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: '0 0 8px 8px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: { xs: 2, md: 2.5 },
              }}
            >
              {/* Avatar - Overlapping both sections */}
              <Avatar
                src={dealer.profileImage || '/avatar.png'}
                sx={{
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  border: '4px solid white',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  position: 'relative',
                  zIndex: 2,
                  mt: { xs: -10, md: -15 },
                  flexShrink: 0,
                }}
              />

              {/* Dealer Info */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' }, mt: { xs: 1, md: 0.5 }, width: '100%' }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    color: '#1a1a1a',
                    mb: 0.75,
                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {dealer.fullName || dealer.contactPerson || 'Dealer Name'}
                </Typography>
                
                {dealer.companyName && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: { xs: 'center', md: 'flex-start' }, 
                      mb: 1.5,
                      mt: 0.25,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: '#f8f9fa',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1.5,
                      }}
                    >
                      <Business sx={{ fontSize: 18, color: '#c8a45e', mr: 1 }} />
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#495057',
                          fontWeight: 600,
                          fontSize: { xs: '0.875rem', md: '0.9375rem' },
                          letterSpacing: '0.01em',
                        }}
                      >
                        {dealer.companyName}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 1.5, borderColor: '#e9ecef' }} />

                {/* Contact Information */}
                <Box sx={{ mt: 0.5 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      mb: 1.25,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: '#fff8f0',
                        mr: 1.5,
                        flexShrink: 0,
                      }}
                    >
                      <Email sx={{ fontSize: 18, color: '#c8a45e' }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#495057',
                        fontSize: '0.875rem',
                        wordBreak: 'break-word',
                        fontWeight: 400,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {dealer.email}
                    </Typography>
                  </Box>
                  
                  {dealer.phone && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        mb: 1.25,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: '#fff8f0',
                          mr: 1.5,
                          flexShrink: 0,
                        }}
                      >
                        <Phone sx={{ fontSize: 18, color: '#c8a45e' }} />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#495057',
                          fontSize: '0.875rem',
                          fontWeight: 400,
                          letterSpacing: '0.01em',
                        }}
                      >
                        {dealer.phone}
                      </Typography>
                    </Box>
                  )}

                  {dealer.address && (dealer.address.city || dealer.address.country) && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        justifyContent: { xs: 'center', md: 'flex-start' },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: '#fff8f0',
                          mr: 1.5,
                          flexShrink: 0,
                          mt: 0.25,
                        }}
                      >
                        <LocationOn sx={{ fontSize: 18, color: '#c8a45e' }} />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#495057',
                          fontSize: '0.875rem',
                          fontWeight: 400,
                          letterSpacing: '0.01em',
                          lineHeight: 1.5,
                        }}
                      >
                        {[
                          dealer.address.city,
                          dealer.address.state,
                          dealer.address.zipCode,
                          dealer.address.country
                        ].filter(Boolean).join(', ')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Vehicles Section */}
        <Box sx={{ mt: 2 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4,
              pb: 2,
              borderBottom: '2px solid #e9ecef',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: '#fff8f0',
                mr: 2,
              }}
            >
              <DirectionsCar sx={{ fontSize: 28, color: '#c8a45e' }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  color: '#1a1a1a',
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  letterSpacing: '-0.02em',
                  mb: 0.5,
                }}
              >
                {t('yourVehicles')}
              </Typography>
              {filteredVehicles.length > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#6c757d',
                    fontSize: '0.875rem',
                  }}
                >
                  {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'} available
                </Typography>
              )}
            </Box>
          </Box>

          {filteredVehicles.length === 0 ? (
            <Card
              sx={{
                p: 8,
                textAlign: 'center',
                borderRadius: 3,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                bgcolor: 'white',
                border: '1px solid #e9ecef',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DirectionsCar sx={{ fontSize: 48, color: '#dee2e6' }} />
                </Box>
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#495057', 
                  fontWeight: 600,
                  mb: 1,
                }}
                gutterBottom
              >
                {t('notFound')}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6c757d',
                  maxWidth: 400,
                  mx: 'auto',
                }}
              >
                This dealer hasn't listed any vehicles yet. Check back later for new listings.
              </Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredVehicles.map((vehicle: Vehicle) => (
                <Grid key={vehicle._id} item xs={12} sm={6} md={4}>
                  <Link 
                    href={`/cars/${vehicle._id}`} 
                    passHref 
                    style={{ textDecoration: 'none' }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        border: '1px solid #e9ecef',
                        bgcolor: 'white',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          borderColor: '#c8a45e',
                        },
                      }}
                    >
                      {/* Vehicle Image */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: 240,
                          bgcolor: '#f0f0f0',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={vehicle.media?.[0]?.url || '/no-image.jpg'}
                          alt={vehicle.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'scale(1.08)',
                            },
                          }}
                        />
                        {vehicle.status && (
                          <Chip
                            label={vehicle.status}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              bgcolor: vehicle.status === 'available' ? '#28a745' : '#6c757d',
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              height: 28,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            }}
                          />
                        )}
                      </Box>

                      {/* Vehicle Details */}
                      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{
                            color: '#1a1a1a',
                            mb: 1,
                            fontSize: '1.125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.4,
                            minHeight: 48,
                          }}
                        >
                          {vehicle.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: '#6c757d',
                            mb: 2,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                          }}
                        >
                          {vehicle.brand} • {vehicle.model} • {vehicle.year}
                        </Typography>

                        {vehicle.location && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2.5,
                              color: '#6c757d',
                            }}
                          >
                            <LocationOn sx={{ fontSize: 16, mr: 0.75 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#6c757d',
                                fontSize: '0.8125rem',
                              }}
                            >
                              {vehicle.location.city}, {vehicle.location.country}
                            </Typography>
                          </Box>
                        )}

                        <Divider sx={{ my: 2, borderColor: '#e9ecef' }} />

                        {/* Price */}
                        <Box sx={{ mb: 2.5 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              color: '#c8a45e',
                              fontWeight: 700,
                              fontSize: '1.5rem',
                              letterSpacing: '-0.01em',
                            }}
                          >
                            ${vehicle.price.toLocaleString()}
                          </Typography>
                        </Box>

                        {/* Vehicle Specs */}
                        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #f0f0f0' }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#6c757d',
                                  fontSize: '0.75rem',
                                  display: 'block',
                                  mb: 0.75,
                                  fontWeight: 500,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                Fuel Type
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  color: '#212529',
                                }}
                              >
                                {vehicle.fuelType}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#6c757d',
                                  fontSize: '0.75rem',
                                  display: 'block',
                                  mb: 0.75,
                                  fontWeight: 500,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                Transmission
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  color: '#212529',
                                }}
                              >
                                {vehicle.transmission}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#6c757d',
                                  fontSize: '0.75rem',
                                  display: 'block',
                                  mb: 0.75,
                                  fontWeight: 500,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                Mileage
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  color: '#212529',
                                }}
                              >
                                {vehicle.mileage.toLocaleString()} km
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#6c757d',
                                  fontSize: '0.75rem',
                                  display: 'block',
                                  mb: 0.75,
                                  fontWeight: 500,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                Condition
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                  color: '#212529',
                                }}
                              >
                                {vehicle.condition}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </CardContent>
                    </Card>
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
