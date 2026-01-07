'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle, ApiResponse } from '@/types';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
  Container,
  Paper,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { useQuery } from '@tanstack/react-query';
import { vehicaleApi } from '@/lib/api/vehicale';
import CommunityHeader from '@/components/ui/CommunityHeader';
import colors from '@/components/styles';
import { useTranslation } from 'react-i18next';
import CarCard from '@/components/ui/CarCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/lib/hooks/useAuth';
import Price from '@/components/ui/Price';

type ViewMode = 'grid' | 'flex' | 'single';
const ALLOWED_ROLES = new Set(['admin', 'superAdmin', 'dealer']);

const ITEMS_PER_PAGE = 10;

const VehiclesScreen: React.FC = () => {
  const { t } = useTranslation();
  const { foreground } = colors;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [displayedCount, setDisplayedCount] = useState<number>(ITEMS_PER_PAGE);
  const theme = useTheme();
  const router = useRouter();
  const { user, isGettingLoggedIn } = useAuth();
  const isAuthorized = user?.role?.roleId ? ALLOWED_ROLES.has(user.role.roleId) : false;

  useEffect(() => {
    if (!isGettingLoggedIn && user && !isAuthorized) {
      router.replace('/');
    }
  }, [isAuthorized, isGettingLoggedIn, router, user]);

  if (!isGettingLoggedIn && user && !isAuthorized) {
    return null;
  }
  const {
    data,
    isLoading,
    isError,
  } = useQuery<ApiResponse<Vehicle[]>>({
    queryKey: ['get-vehicale'],
    queryFn: () => {
      return vehicaleApi.getAllPublicVehicale();
    },
  });

  // Filter for public vehicles and apply search
  const filteredVehicles = useMemo(() => {
    if (!data?.data) return [];
    
    let vehicles = data.data.filter((vehicle: Vehicle) => vehicle.public === true);
  //  console.log(vehicles);
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      vehicles = vehicles.filter((vehicle: Vehicle) =>
        vehicle.title?.toLowerCase().includes(searchLower) ||
        vehicle.brand?.toLowerCase().includes(searchLower) ||
        vehicle.model?.toLowerCase().includes(searchLower) ||
        vehicle.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return vehicles;
  }, [data, searchTerm]);

  // Get vehicles to display (for infinite scroll simulation)
  const displayedVehicles = useMemo(() => {
    return filteredVehicles.slice(0, displayedCount);
  }, [filteredVehicles, displayedCount]);

  const hasMore = displayedCount < filteredVehicles.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + ITEMS_PER_PAGE);
  };

  // Reset displayed count when search changes
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchTerm]);

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleContactDealer = (dealerId: string) => {
    router.push(`/admin/dealer/${dealerId}`);
  };

  const SingleVehicleCard = ({ vehicle }: { vehicle: Vehicle }) => (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        mb: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Image on left (desktop) */}
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          height: { xs: 250, md: 'auto' },
          minHeight: { xs: 250, md: 300 },
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={vehicle?.media?.[0]?.url || '/no-image.jpg'}
          alt={vehicle?.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Details on right */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 600,
              fontSize: { xs: '24px', md: '32px' },
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {vehicle?.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
              fontSize: { xs: '14px', md: '16px' },
            }}
          >
            {vehicle?.brand} • {vehicle?.model} • {vehicle?.year}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            {vehicle?.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Typography variant="body2">
              <strong>{t('price')}:</strong> <Price amountUSD={Number(vehicle?.price) || 0} />
            </Typography>
            {vehicle?.mileage && (
              <Typography variant="body2">
                <strong>{t('mileage')}:</strong> {vehicle.mileage.toLocaleString()} km
              </Typography>
            )}
            {vehicle?.fuelType && (
              <Typography variant="body2">
                <strong>{t('fuelType')}:</strong> {vehicle.fuelType}
              </Typography>
            )}
            {vehicle?.transmission && (
              <Typography variant="body2">
                <strong>{t('transmission')}:</strong> {vehicle.transmission}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', mt: 1 }}>
          <Link href={`/cars/${vehicle._id}`} style={{ textDecoration: 'none' }}>
            <Button variant="outlined" sx={{ textTransform: 'none', fontSize: '14px', py: 1 }}>
              {t('moreDetails') || 'More Details'}
            </Button>
          </Link>
          <Button
            variant="contained"
            onClick={() => handleContactDealer(vehicle.postedBy as string)}
            sx={{
              bgcolor: colors.primary,
              color: '#fff',
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#9c783d',
              },
            }}
          >
            {t('contactDealer')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: foreground,
        py: { xs: 2, md: 4 },
        maxWidth: '100%',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 0, md: 3 } }}>
        {/* Header with Search and View Toggle */}
        <Box
          sx={{
            mb: { xs: 3, md: 5 },
            top: 0,
            zIndex: 80,
            background: foreground,
            py: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '60%' } }}>
              <CommunityHeader
                handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  setSearchTerm(e.target.value)
                }
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {t('viewMode')}:
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                size="small"
              >
                <Tooltip title={t('gridView') || 'Grid (3 per row)'}>
                  <ToggleButton value="grid" aria-label="grid">
                    <ViewModuleIcon />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title={t('flexView') || 'Flex (2 per row)'}>
                  <ToggleButton value="flex" aria-label="flex">
                    <ViewComfyIcon />
                  </ToggleButton>
                </Tooltip>
                <Tooltip title={t('singleView') || 'Single (full width)'}>
                  <ToggleButton value="single" aria-label="single">
                    <ViewListIcon />
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>

        {/* Title */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 }, px: { xs: 1, md: 0 } }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Rubik, sans-serif',
              fontWeight: 600,
              fontSize: {
                xs: '28px',
                sm: '32px',
                md: '40px',
              },
              lineHeight: 1.2,
              color: theme.palette.text.primary,
              mb: 1,
            }}
          >
            {t('vehicles')}
          </Typography>
        </Box>

        {/* Vehicle List */}
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 8,
            }}
          >
            <CircularProgress size={40} />
          </Box>
        ) : isError ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              border: `1px solid ${theme.palette.error.light}`,
              background: `${theme.palette.error.light}10`,
            }}
          >
            <Typography color="error" variant="h6">
              {t('failedToLoadVehicles') || 'Failed to load vehicles'}
            </Typography>
          </Paper>
        ) : (
          <>
            {displayedVehicles.length === 0 ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  background: theme.palette.background.paper,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {t('noVehiclesFound') || 'No vehicles found'}
                </Typography>
              </Paper>
            ) : (
              <>
                {viewMode === 'single' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {displayedVehicles.map((vehicle: Vehicle) => (
                      <SingleVehicleCard key={vehicle._id} vehicle={vehicle} />
                    ))}
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {displayedVehicles.map((vehicle: Vehicle) => (
                      <Grid
                        item
                        xs={12}
                        sm={viewMode === 'grid' ? 6 : 6}
                        md={viewMode === 'grid' ? 4 : 6}
                        key={vehicle._id}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                             borderRadius: 3,
                            // overflow: 'hidden',
                            // border: `1px solid ${theme.palette.divider}`,
                            // background: theme.palette.background.paper,
                            transition: 'all 0.2s ease-in-out',
                            height: '100%',
                            '&:hover': {
                              boxShadow: theme.shadows[4],
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <CarCard car={vehicle} onContact={handleContactDealer} />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* Load More Button */}
                {hasMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4, mt: 2 }}>
                    <Button
                      onClick={handleLoadMore}
                      variant="outlined"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '16px',
                        fontWeight: 500,
                        minWidth: 140,
                      }}
                    >
                      {t('loadMore') || 'Load More'}
                    </Button>
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default VehiclesScreen;

