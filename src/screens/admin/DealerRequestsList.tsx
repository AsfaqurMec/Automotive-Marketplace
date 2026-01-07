import React, { useState, useEffect } from 'react';
import TopBarControls from '@/components/admin/ui/table/TopBarControls';
import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';
import colors from '@/components/styles';
import DealerRequestTable from '@/components/admin/ui/table/DealerRequestTable';
import { useQuery } from '@tanstack/react-query';
import useAuth from '@/lib/hooks/useAuth';
import { getDealerRequests, DealerRequest } from '@/lib/api/dealerRequest';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const DealerRequestsList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { textBlack } = colors;
  const [requests, setRequests] = useState<DealerRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItem, setTotalItem] = useState<number>(0);
  const router = useRouter();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Debounce search term to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleFilterClick = () => {};

  const handlePrintClick = () => {
    window.print();
  };

  const handleDownloadClick = () => {
    // Implement download functionality if needed
  };

  const {
    data: requestsData,
    isLoading,
  } = useQuery({
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getDealerRequests(
        currentPage,
        limit,
        debouncedSearchTerm || undefined,
        statusFilter || undefined,
        user
      );
    },
    queryKey: ['get-dealer-requests', currentPage, limit, debouncedSearchTerm, statusFilter],
    enabled: !!user,
  });

  useEffect(() => {
    if (requestsData?.data?.data) {
      setRequests(requestsData.data.data);
      setTotalPages(requestsData.data.pagination?.pages || 0);
      setCurrentPage(requestsData.data.pagination?.page || 1);
      setTotalItem(requestsData.data.pagination?.total || 0);
    }
  }, [requestsData]);

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

  if (user?.role?.roleId !== 'admin' && user?.role?.roleId !== 'superAdmin') {
    router.push('/');
    return null;
  }

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography variant="h6" sx={style}>
        {t('dealerRequests') || 'Dealer Requests'}
      </Typography>
      <Box sx={{ m: { xs: 0, md: 4 } }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              displayEmpty
            >
              <MenuItem value="">{t('allStatuses') || 'All Statuses'}</MenuItem>
              <MenuItem value="pending">{t('pending') || 'Pending'}</MenuItem>
              <MenuItem value="approved">{t('approved') || 'Approved'}</MenuItem>
              <MenuItem value="rejected">{t('rejected') || 'Rejected'}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <TopBarControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={limit}
          totalItems={totalItem}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onFilterClick={handleFilterClick}
          onPrintClick={handlePrintClick}
          onDownloadClick={handleDownloadClick}
          t={t}
        />
      </Box>

      <DealerRequestTable
        requests={requests}
        loading={isLoading}
      />
    </Box>
  );
};

export default DealerRequestsList;





