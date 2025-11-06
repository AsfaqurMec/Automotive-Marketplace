'use client';
import React, { useState, useEffect } from 'react';
import TopBarControls from '@/components/admin/ui/table/TopBarControls';
import { Box } from '@mui/material';

import CustomerTable from '@/components/admin/ui/table/UserList';
import { useQuery } from '@tanstack/react-query';

import Papa from 'papaparse';
import { getCustomer } from '@/lib/api/users';
import useAuth from '@/lib/hooks/useAuth';

const CustomerList: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItem, setTotalItem] = useState<number>(0);
  const [customer, setCustomer] = useState([]);
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterClick = () => {};

  const handlePrintClick = () => {
    window.print();
  };

  const handleDownloadClick = () => {
    if (!customer || customer.length === 0) {
      return;
    }

    const formattedData = customer.map((customerItem: {
      fullName?: string;
      email?: string;
      phone?: string;
      createdAt?: string | Date;
    }) => ({
      Name: customerItem.fullName,
      Email: customerItem.email,
      Phone: customerItem.phone,
      Source: '',
      Status: '',
      InterestedIn: '',
      Budget: '',
      Reminder: '',
      Task: '',
      AssignedTo: '',
      CreatedAt: customerItem.createdAt ? new Date(customerItem.createdAt).toLocaleString() : '',
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
    data: customerData,
  } = useQuery({
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getCustomer(currentPage, limit, searchTerm, user);
    },
    queryKey: ['get-customer', currentPage, limit, searchTerm],
    enabled: true,
  });

  useEffect(() => {
    setCustomer(customerData?.data?.data);
    setTotalPages(customerData?.data?.pagination.pages);
    setCurrentPage(customerData?.data?.pagination.page);
    setTotalItem(customerData?.data?.pagination.total);
  }, [customerData]);

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Box sx={{ m: { xs: 1, md: 4 } }}>
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
          t={undefined}
        />
      </Box>

      <CustomerTable
        customer={customer}
      />
    </Box>
  );
};
export default CustomerList;

