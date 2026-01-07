'use client';
import React, { useState, useEffect } from 'react';
import TopBarControls from '@/components/admin/ui/table/TopBarControls';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getSoldVehicles, SoldVehicleData } from '@/lib/api/soldVehicles';
import useAuth from '@/lib/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import colors from '@/components/styles';
import Price from '@/components/ui/Price';
import dayjs from 'dayjs';

const SoldVehicles: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { textBlack } = colors;

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItem, setTotalItem] = useState<number>(0);
  const [soldVehicles, setSoldVehicles] = useState<SoldVehicleData[]>([]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: soldVehiclesData,
    isLoading,
  } = useQuery({
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getSoldVehicles(currentPage, limit, debouncedSearchTerm, user);
    },
    queryKey: ['get-sold-vehicles', currentPage, limit, debouncedSearchTerm],
    enabled: true,
  });

  useEffect(() => {
    if (soldVehiclesData?.data) {
      setSoldVehicles(soldVehiclesData.data.data || []);
      setTotalPages(soldVehiclesData.data.pagination?.pages || 0);
      setCurrentPage(soldVehiclesData.data.pagination?.page || currentPage);
      setTotalItem(soldVehiclesData.data.pagination?.total || 0);
    }
  }, [soldVehiclesData, currentPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterClick = () => {
    // Future: Add filter functionality
  };

  const handlePrintClick = () => {
    window.print();
  };

  const handleDownloadClick = () => {
    if (!soldVehicles || soldVehicles.length === 0) {
      return;
    }

    // Create CSV content
    const headers = ['Date', 'Seller Name', 'Seller Email', 'Buyer Name', 'Buyer Email', 'Contact', 'Type', 'Vehicle', 'Amount'];
    const rows = soldVehicles.map((sale) => [
      sale.createdAt ? dayjs(sale.createdAt).format('YYYY-MM-DD HH:mm') : '',
      sale.seller?.fullName || 'N/A',
      sale.seller?.email || 'N/A',
      sale.name,
      sale.email,
      sale.contact,
      sale.dealerID ? 'Internal' : 'External',
      sale.vehicle?.title || 'N/A',
      sale.amount.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sold-vehicles-${dayjs().format('YYYY-MM-DD')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const style = {
    color: textBlack,
    fontFamily: 'Rubik',
    fontSize: '28px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    letterSpacing: '-0.114px',
    m: 3,
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Box sx={{ m: { xs: 1, md: 4 } }}>
        <Typography sx={style}>
          {t('soldVehicles') || 'Sold Vehicles'}
        </Typography>

        <TopBarControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={limit}
          totalItems={totalItem}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onFilterClick={handleFilterClick}
          onPrintClick={handlePrintClick}
          onDownloadClick={handleDownloadClick}
          t={t}
        />

        <TableContainer 
          component={Paper} 
          sx={{ 
            mt: 2, 
            boxShadow: 2,
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f3e5b6' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {t('date') || 'Date'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {t('seller') || 'Seller'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {t('buyer') || 'Buyer'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {t('email') || 'Email'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {t('contact') || 'Contact'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {t('type') || 'Type'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {t('vehicle') || 'Vehicle'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {t('amount') || 'Amount'}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography>{t('loading') || 'Loading...'}</Typography>
                  </TableCell>
                </TableRow>
              ) : soldVehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      {t('noSoldVehicles') || 'No sold vehicles found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                soldVehicles.map((sale) => (
                  <TableRow key={sale._id} hover>
                    <TableCell>
                      {sale.createdAt
                        ? dayjs(sale.createdAt).format('MMM DD, YYYY HH:mm')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {sale.seller ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}
                          >
                            {sale.seller.fullName?.charAt(0).toUpperCase() || 'S'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {sale.seller.fullName || 'N/A'}
                            </Typography>
                            {sale.seller.email && (
                              <Typography variant="caption" color="text.secondary">
                                {sale.seller.email}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('notAvailable') || 'N/A'}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                          sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                        >
                          {sale.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {sale.name}
                          </Typography>
                          {sale.dealer?.companyName && (
                            <Typography variant="caption" color="text.secondary">
                              {sale.dealer.companyName}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{sale.email}</TableCell>
                    <TableCell>{sale.contact}</TableCell>
                    <TableCell>
                      <Chip
                        label={sale.dealerID ? t('internal') || 'Internal' : t('external') || 'External'}
                        color={sale.dealerID ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {sale.vehicle ? (
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {sale.vehicle.title || `${sale.vehicle.brand} ${sale.vehicle.model}`}
                          </Typography>
                          {sale.vehicle.year && (
                            <Typography variant="caption" color="text.secondary">
                              {sale.vehicle.year}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {t('vehicleNotAvailable') || 'N/A'}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Price amountUSD={sale.amount} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default SoldVehicles;

