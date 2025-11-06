import React, { useState, useEffect} from 'react';
import TopBarControls from '@/components/admin/ui/table/TopBarControls';
import { Box, Typography } from '@mui/material';
import colors from '@/components/styles';
import DealerTable from '@/components/admin/ui/table/DealerTable';
import { useQuery } from '@tanstack/react-query';
import Papa from 'papaparse';
import useAuth from '@/lib/hooks/useAuth';
import { getDealers } from '@/lib/api/users';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

const DealersList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { textBlack } = colors;
  const [dealers, setDealers] = useState([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItem, setTotalItem] = useState<number>(0);
  const router = useRouter();
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
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
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFilterClick = () => {};

  const handlePrintClick = () => {
    window.print();
  };

  const handleDownloadClick = () => {
    if (!dealers || dealers.length === 0) {
      return;
    }

    const formattedData = dealers.map((dealer: {
      fullName?: string;
      email?: string;
      phone?: string;
      createdAt?: string | Date;
    }) => ({
      Name: dealer.fullName,
      Email: dealer.email,
      Phone: dealer.phone,
      Source: '',
      Status: '',
      InterestedIn: '',
      Budget: '',
      Reminder: '',
      Task: '',
      AssignedTo: '',
      CreatedAt: dealer.createdAt ? new Date(dealer.createdAt).toLocaleString() : '',
    }));

    const csv = Papa.unparse(formattedData);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const {
    data: dealersData,
    isLoading,
  } = useQuery({
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getDealers(currentPage, limit, debouncedSearchTerm, user);
    },
    queryKey: ['get-dealers', currentPage, limit, debouncedSearchTerm],
    enabled: true,
  });

  useEffect(() => {
    setDealers(dealersData?.data?.data);
    setTotalPages(dealersData?.data?.pagination?.pages || 0);
    setCurrentPage(dealersData?.data?.pagination?.page || 0);
    setTotalItem(dealersData?.data?.pagination?.total || 0);
  }, [dealersData]);

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

  if(user?.role?.roleId !== 'admin') {
    router.push('/');
  }

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography variant="h6" sx={style}>
        {t('dealersManagement')}
      </Typography>
      <Box sx={{ m: { xs: 0, md: 4 } }}>
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
          t={undefined}
        />
      </Box>

      <DealerTable
        dealers={dealers}
        loading={isLoading}
      />
    </Box>
  );
};
export default DealersList;

