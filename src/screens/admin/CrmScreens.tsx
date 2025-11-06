'use client';
import React, { useState, useEffect } from 'react';
import TopBarControls from '@/components/admin/ui/table/TopBarControls';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import colors from '@/components/styles';
import CRMTable from '@/components/admin/ui/table/CRMTable';
import CreateLeadModal from '@/components/modal/CreateLeadModal';
import { getDealer } from '@/lib/api/dealer';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getLeads, createLead } from '@/lib/api/leads';
import GoogleCalendarSync from '@/components/admin/ui/GoogleCalendarSync ';
import Papa from 'papaparse';
import useAuth from '@/lib/hooks/useAuth';
import { toast } from 'react-toastify';
import { Lead, User } from '@/types';

const CrmList: React.FC = () => {
  const queryClient = useQueryClient();
  const { textBlack } = colors;
  const [open, setOpen] = useState(false);
  const [dealer, setDealer] = useState([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'my' | 'assigned' | 'public'>('my');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItem, setTotalItem] = useState<number>(0);
  const { user } = useAuth();
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

  const handleTabChange = (_: unknown, value: 'my' | 'assigned' | 'public') => {
    setActiveTab(value);
  };

  const handleDownloadClick = () => {
    if (!leads || leads.length === 0) {
      return;
    }

    const formattedData = leads.map((lead: Lead) => ({
      Name: lead.fullName,
      Email: lead.email,
      Phone: lead.phone || '',
      Source: lead.source || '',
      Status: lead.status || '',
      InterestedIn: '',
      Budget: '',
      Reminder: '',
      Task: '',
      AssignedTo: lead.assignedTo || '',
      CreatedAt: lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '',
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
  const { data, refetch } = useQuery({
    queryFn: () => getDealer(),
    queryKey: ['getDealer'],
    enabled: true,
  });

  const { data: leadsData, isLoading } = useQuery({
    queryFn: () => getLeads(currentPage, limit, debouncedSearchTerm, user as User),
    queryKey: ['getLeads', currentPage, limit, debouncedSearchTerm],
    enabled: true,
  });

  useEffect(() => {
    setDealer(data?.data);
    setLeads(leadsData?.data?.data as Lead[]);
    setTotalPages(leadsData?.data?.pagination?.pages || 0);
    setCurrentPage(leadsData?.data?.pagination?.page ?? 0);
    setTotalItem(leadsData?.data?.pagination?.total || 0);
  }, [data, leadsData]);

//console.log(leads);

  const filteredLeads = (leads || []).filter((lead) => {
    const userId = (user as User)?._id;
    if (activeTab === 'public') {
      return !lead.assignedTo;
    }
    if (activeTab === 'assigned') {
      return lead.assignedTo === userId;
    }
    // my
  //  console.log(userId);
    const createdBy = (lead as unknown as { createdBy?: string | { _id?: string } | undefined })?.createdBy;
    const createdById = typeof createdBy === 'string' ? createdBy : createdBy && createdBy._id ? createdBy._id : undefined;
    const possibleOwnerId = (lead as unknown as { ownerId?: string, dealerId?: string }).ownerId || (lead as unknown as { dealerId?: string }).dealerId;
    return createdById === userId || possibleOwnerId === userId;
  });

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

  const createLeadMutation = useMutation({
    mutationFn: (data: Partial<Lead>) => createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getLeads'] });
      toast.success('Lead created successfully!');
      refetch();
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to create lead');
    },
  });
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography variant="h6" sx={style}>
                CRM
      </Typography>
      <Box sx={{ m: { xs: 1, md: 4 } }}>
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

      <GoogleCalendarSync />
      <Box sx={{ px: { xs: 1, md: 4 }, mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
          <Tab value="my" label="My Leads" />
          <Tab value="assigned" label="Assigned Lead" />
          <Tab value="public" label="Leads" />
        </Tabs>
      </Box>
      <CRMTable
        refetch={refetch}
        setOpen={setOpen}
        leads={filteredLeads}
        loading={isLoading}
      />

      <CreateLeadModal
        open={open}
        onClose={() => setOpen(false)}
        dealer={dealer}
        onSubmit={(leadData) => {
          createLeadMutation.mutate(leadData as unknown as Partial<Lead>);
        }}
      />
    </Box>
  );
};
export default CrmList;

