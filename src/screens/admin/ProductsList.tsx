import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Typography,
} from '@mui/material';
import TopBarControls from '@/components/admin/ui/table/TopBarControls';
import LeadsTable from '@/components/admin/ui/table/ProductTable';

import { useQuery } from '@tanstack/react-query';
import { getExcludeLeads, aiAnalyzeLeads, assignLeads } from '@/lib/api/leads';
import { useTranslation } from 'react-i18next';
import useAuth from '@/lib/hooks/useAuth';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import { Lead, User } from '@/types';

const ProductsList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItem, setTotalItem] = useState<number>(0);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLeads, setAiLeads] = useState<Lead[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);

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
    if (!leads || leads.length === 0) {
      toast.warn('No leads to download');
      return;
    }

    const formattedData = leads.map((lead: Lead) => ({
      Name: lead.fullName,
      Email: lead.email,
      Phone: lead.phone,
      Source: lead.source || '',
      Status: lead.status,
      InterestedIn: lead.interestedIn || '',
      Budget: lead.budget || '',
      Reminder: lead.reminder ? new Date(lead.reminder).toLocaleString() : '',
      Task: lead.task || '',
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

  const { data: leadsData, isLoading } = useQuery({
    queryFn: () => getExcludeLeads(currentPage, limit, debouncedSearchTerm, user as User),
    queryKey: ['getExcludeLeads', currentPage, limit, debouncedSearchTerm],
    enabled: true,
  });

  useEffect(() => {
    setLeads(leadsData?.data?.data as Lead[]);
    setTotalPages(leadsData?.data?.pagination?.pages || 1);
    setCurrentPage(leadsData?.data?.pagination?.page || 1);
    setTotalItem(leadsData?.data?.pagination?.total || 0);
  }, [leadsData]);

  const handleAiAnalyze = async () => {
    setAiLoading(true);
    setAiModalOpen(true);
    setAiLeads([]);
    try {
      const res = await aiAnalyzeLeads(user as User);
      setAiLeads(Array.isArray(res?.data?.data) ? res?.data?.data : []);
    } catch {
      setAiLeads([]);
    }
    setAiLoading(false);
  };

  const handleAssign = async (leadId: string) => {
    setAssigningId(leadId);
    try {
      await assignLeads([leadId], user as User);
      setAiLeads((prev: Lead[]) => prev.filter((l: Lead) => l._id !== leadId));
    } catch {
      // Handle error silently
    }
    setAssigningId(null);
  };

  return (
    <Box sx={{ m: { xs: 1, md: 4 } }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAiAnalyze}
        sx={{ mb: 2, mt: { xs: 3 } }}
      >
        {aiLoading ? <CircularProgress size={24} /> : 'AI Analyze Top Leads'}
      </Button>
      <Dialog
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Top 10 AI-Selected Leads</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        These leads were selected by AI based on their likelihood to convert. See
                        the reasoning for each lead below.
          </Typography>
          {aiLoading ? (
            <CircularProgress />
          ) : aiLeads.length === 0 ? (
            <div>No leads found.</div>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Interested In</TableCell>
                  <TableCell>Budget</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Assign</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aiLeads.map((lead: Lead) => (
                  <TableRow key={lead._id}>
                    <TableCell>{lead.fullName}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.status}</TableCell>
                    <TableCell>{lead.interestedIn}</TableCell>
                    <TableCell>{lead.budget}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 180,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <Tooltip
                        title={lead.aiReason || ''}
                        placement="top"
                        arrow
                      >
                        <span>{lead.aiReason || '-'}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleAssign(lead._id)}
                        disabled={assigningId === lead._id}
                      >
                        {assigningId === lead._id ? (
                          <CircularProgress size={16} />
                        ) : (
                          'Assign'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
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
      <LeadsTable leads={leads} t={t} loading={isLoading} />
    </Box>
  );
};
export default ProductsList;

