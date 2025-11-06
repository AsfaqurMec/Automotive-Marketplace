import React, { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getDealers } from '@/lib/api/dealer';
import {
  Box,
  Avatar,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Divider,
  Tooltip,
  Chip,
  // Removed unused import
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useTranslation } from 'react-i18next';

import { useRouter } from 'next/navigation';

const DealerListSidebar: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const route = useRouter();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['sidebar-dealers', currentPage],
    queryFn: () => getDealers({ limit: itemsPerPage, page: currentPage }),
    placeholderData: keepPreviousData,
  });

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <StarIcon key={i} sx={{ color: '#FFD600', fontSize: 18 }} />
        ) : (
          <StarBorderIcon key={i} sx={{ color: '#FFD600', fontSize: 18 }} />
        ),
      );
    }
    return stars;
  };

  const handlePageChange = (event: React.ChangeEvent<unknown> | null, newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = (data as { data?: { totalPages?: number } })?.data?.totalPages || 1;
  const dealers = (data as { data?: { data?: Array<{ _id: string; address?: { city?: string; country?: string }; logo?: string; fullName?: string; isVerified?: boolean; companyName?: string; rating?: number; numberOfReviews?: number; email?: string }> } })?.data?.data || [];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 0,
        borderRadius: 4,
        minWidth: 260,
        maxWidth: '100%',
        bgcolor: '#f8fafc',
        border: '1.5px solid #e3e7ed',
        boxShadow: '0 4px 24px 0 rgba(60,72,88,0.10)',
        position: 'sticky',
        top: 32,
        maxHeight: '80vh',
        overflowY: 'auto',
        '::-webkit-scrollbar': {
          width: 8,
        },
        '::-webkit-scrollbar-thumb': {
          background: '#e0e0e0',
          borderRadius: 8,
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #e0e0e0',
          bgcolor: 'linear-gradient(90deg, #e3e7ed 0%, #f8fafc 100%)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box sx={{ width: 6, height: 32, borderRadius: 2, bgcolor: '#2d8cff', mr: 1 }} />
        <Typography
          variant="h6"
          fontWeight={700}
          textAlign="center"
          letterSpacing={1}
          sx={{ color: '#2d3a4b', textTransform: 'uppercase', flex: 1 }}
        >
          {t('dealers')}
        </Typography>
      </Box>

      {/* Content Area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(80vh - 80px)' }}>
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress size={28} />
          </Box>
        )}

        {isError && (
          <Typography color="error" textAlign="center" sx={{ my: 2 }}>
            {error?.message || 'Failed to load dealers'}
          </Typography>
        )}

        {/* Dealers List */}
        <Stack spacing={0} sx={{ px: 2, py: 2, flex: 1, overflowY: 'auto' }}>
          {dealers.length === 0 && !isLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="text.secondary">
                                No dealers found
              </Typography>
            </Box>
          ) : (
            dealers.map((dealer: {
              _id: string;
              address?: { city?: string; country?: string };
              logo?: string;
              fullName?: string;
              isVerified?: boolean;
              companyName?: string;
              rating?: number;
              numberOfReviews?: number;
              email?: string;
            }, idx: number, arr: Array<{
              _id: string;
              address?: { city?: string; country?: string };
              logo?: string;
              fullName?: string;
              isVerified?: boolean;
              companyName?: string;
              rating?: number;
              numberOfReviews?: number;
              email?: string;
            }>) => {
              const city = dealer.address?.city;
              const country = dealer.address?.country;
              return (
                <React.Fragment key={dealer._id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      transition: 'background 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'rgba(44, 130, 201, 0.10)',
                        boxShadow: '0 2px 12px 0 rgba(44,130,201,0.10)',
                      },
                    }}
                    onClick={() => {
                      route.push(`/admin/dealer/${dealer._id}`);
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={dealer.logo}
                        alt={dealer.fullName}
                        sx={{
                          width: 56,
                          height: 56,
                          border: '2px solid #e0e0e0',
                          transition: 'transform 0.18s',
                          '&:hover': {
                            transform: 'scale(1.08)',
                          },
                        }}
                      />
                      {dealer.isVerified && (
                        <CheckCircleIcon
                          sx={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            color: '#2d8cff',
                            fontSize: 22,
                            bgcolor: '#fff',
                            borderRadius: '50%',
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography
                          fontWeight={600}
                          sx={{
                            color: '#2d3a4b',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {dealer.fullName}
                        </Typography>
                        {dealer.isVerified && (
                          <Chip
                            label="Verified"
                            size="small"
                            color="primary"
                            sx={{
                              ml: 0.5,
                              fontWeight: 500,
                              height: 22,
                            }}
                            icon={
                              <CheckCircleIcon
                                sx={{ fontSize: 16 }}
                              />
                            }
                          />
                        )}
                      </Box>
                      {dealer.companyName && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {dealer.companyName}
                        </Typography>
                      )}
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mt={0.5}
                      >
                        <LocationOnIcon
                          sx={{ fontSize: 18, color: '#2d8cff' }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {[city, country].filter(Boolean).join(', ') ||
                                                        'N/A'}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mt={0.5}
                      >
                        {renderStars(dealer.rating)}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                          {dealer.rating?.toFixed(1) || '0.0'}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 0.5 }}
                        >
                                                    ({dealer.numberOfReviews || 0})
                        </Typography>
                      </Box>
                    </Box>
                    <Tooltip title={dealer.email} arrow placement="top">
                      <EmailIcon
                        sx={{ color: '#2d8cff', fontSize: 22, ml: 1 }}
                      />
                    </Tooltip>
                  </Box>
                  {idx < arr.length - 1 && <Divider sx={{ my: 0.5 }} />}
                </React.Fragment>
              );
            })
          )}
        </Stack>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Box
            sx={{
              borderTop: '1px solid #e0e0e0',
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: '#fafbfc',
            }}
          >
            <Typography variant="caption" color="text.secondary">
                            Page {currentPage} of {totalPages}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handlePageChange(null, Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || isLoading}
                sx={{
                  color: currentPage === 1 ? '#ccc' : '#2d8cff',
                  '&:hover': {
                    bgcolor:
                                            currentPage === 1
                                              ? 'transparent'
                                              : 'rgba(45, 140, 255, 0.1)',
                  },
                }}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>

              <Typography
                variant="caption"
                sx={{ minWidth: 20, textAlign: 'center' }}
              >
                {currentPage}
              </Typography>

              <IconButton
                size="small"
                onClick={() =>
                  handlePageChange(null, Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages || isLoading}
                sx={{
                  color: currentPage === totalPages ? '#ccc' : '#2d8cff',
                  '&:hover': {
                    bgcolor:
                                            currentPage === totalPages
                                              ? 'transparent'
                                              : 'rgba(45, 140, 255, 0.1)',
                  },
                }}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default DealerListSidebar;

