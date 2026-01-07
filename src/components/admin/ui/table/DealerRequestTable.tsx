import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Collapse,
  Grid,
  Button,
} from '@mui/material';
import { MdEdit, MdDelete, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { HiDocumentText } from 'react-icons/hi';
import colors from '@/components/styles';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '@/lib/hooks/useAuth';
import UpdateStatusModal from '@/components/modal/UpdateDealerRequestStatusModal';
import DeleteConfirmationModal from '@/components/modal/ConfirmationModal';
import FileViewerModal from '@/components/modal/FileViewerModal';
import { updateDealerRequestStatus, deleteDealerRequest, DealerRequest } from '@/lib/api/dealerRequest';
import { useTranslation } from 'react-i18next';
import { User } from '@/types';

interface DealerRequestTableProps {
  requests: DealerRequest[];
  loading?: boolean;
}

const DealerRequestTable: React.FC<DealerRequestTableProps> = ({ requests, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { primary, text, white } = colors;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRequest, setEditRequest] = useState<DealerRequest | null>(null);
  const [openDeletedModal, setOpenDeletedModal] = useState(false);
  const [deletedRequestId, setDeletedRequestId] = useState<string | null>(null);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    url: string;
    filename: string;
    mimetype: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { mutate: updateMutate } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'approved' | 'rejected' }) =>
      updateDealerRequestStatus(id, status, user as User),
    onSuccess: () => {
      toast.success(t('requestUpdatedSuccessfully') || 'Request updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-dealer-requests'] });
      setModalOpen(false);
    },
    onError: () => {
      toast.error(t('failedToUpdateRequest') || 'Failed to update request');
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteDealerRequest(id, user as User),
    onSuccess: () => {
      toast.success(t('requestDeletedSuccessfully') || 'Request deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-dealer-requests'] });
      setOpenDeletedModal(false);
    },
    onError: () => {
      setOpenDeletedModal(false);
      toast.error(t('failedToDeleteRequest') || 'Failed to delete request');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const handleFileClick = (file: { url: string; filename: string; mimetype: string }) => {
    setSelectedFile(file);
    setFileViewerOpen(true);
  };

  const handleExpandRow = (requestId: string) => {
    setExpandedRowId(expandedRowId === requestId ? null : requestId);
  };

  const getDealerInfo = (dealer: DealerRequest['dealer']) => {
    if (typeof dealer === 'object' && dealer !== null) {
      return dealer;
    }
    return null;
  };

  return (
    <Box m={{ xs: 0, md: 3 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 50 }}></TableCell>
              <TableCell sx={{ minWidth: 180, whiteSpace: 'nowrap' }}>
                {t('fullName') || 'Full Name'}
              </TableCell>
              <TableCell sx={{ minWidth: 200, whiteSpace: 'nowrap' }}>
                {t('email') || 'Email'}
              </TableCell>
              <TableCell sx={{ minWidth: 120, whiteSpace: 'nowrap' }}>
                {t('status') || 'Status'}
              </TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t('createdAt') || 'Created At'}
              </TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }} align="center">
                {t('actions') || 'Actions'}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : requests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('noDataFound') || 'No data found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              requests?.map((request) => {
                const isExpanded = expandedRowId === request._id;
                const dealerInfo = getDealerInfo(request.dealer);
                return (
                  <React.Fragment key={request._id}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleExpandRow(request._id)}
                        >
                          {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{request.data?.fullName || t('na') || 'N/A'}</TableCell>
                      <TableCell>{request.data?.email || t('na') || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {request.createdAt
                          ? dayjs(request.createdAt).format('DD MMM YYYY, hh:mm A')
                          : t('na') || 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <IconButton
                            onClick={() => {
                              setEditRequest(request);
                              setModalOpen(true);
                            }}
                            size="small"
                          >
                            <MdEdit />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setDeletedRequestId(request._id);
                              setOpenDeletedModal(true);
                            }}
                            size="small"
                          >
                            <MdDelete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Content Row */}
                    <TableRow>
                      <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box
                            sx={{
                              borderRadius: 2,
                              p: 3,
                              backgroundColor: '#f9f9f9',
                              boxShadow: 2,
                              my: 2,
                            }}
                          >
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                              {t('applicationDetails') || 'Application Details'}
                            </Typography>

                            <Grid container spacing={2}>
                              {/* Basic Information */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  {t('basicInformation') || 'Basic Information'}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {t('firstName') || 'First Name'}:{' '}
                                    <strong>{request.data?.firstName || t('na') || 'N/A'}</strong>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {t('lastName') || 'Last Name'}:{' '}
                                    <strong>{request.data?.lastName || t('na') || 'N/A'}</strong>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {t('fullName') || 'Full Name'}:{' '}
                                    <strong>{request.data?.fullName || t('na') || 'N/A'}</strong>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {t('email') || 'Email'}:{' '}
                                    <strong>{request.data?.email || t('na') || 'N/A'}</strong>
                                  </Typography>
                                  {request.data?.companyName && (
                                    <Typography variant="body2" color="text.secondary">
                                      {t('companyName') || 'Company Name'}:{' '}
                                      <strong>{request.data.companyName}</strong>
                                    </Typography>
                                  )}
                                  {request.data?.bankAccountInfo && (
                                    <Typography variant="body2" color="text.secondary">
                                      {t('bankAccountInfo') || 'Bank Account Info'}:{' '}
                                      <strong>{request.data.bankAccountInfo}</strong>
                                    </Typography>
                                  )}
                                  <Typography variant="body2" color="text.secondary">
                                    {t('type') || 'Type'}:{' '}
                                    <strong>{request.data?.type || t('na') || 'N/A'}</strong>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {t('dataStatus') || 'Data Status'}:{' '}
                                    <strong>{request.data?.status || t('na') || 'N/A'}</strong>
                                  </Typography>
                                </Box>
                              </Grid>

                              {/* Dealer Information */}
                              {dealerInfo && (
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    {t('dealerInformation') || 'Dealer Information'}
                                  </Typography>
                                  <Box sx={{ mb: 2 }}>
                                    {dealerInfo.fullName && (
                                      <Typography variant="body2" color="text.secondary">
                                        {t('fullName') || 'Full Name'}:{' '}
                                        <strong>{dealerInfo.fullName}</strong>
                                      </Typography>
                                    )}
                                    {dealerInfo.email && (
                                      <Typography variant="body2" color="text.secondary">
                                        {t('email') || 'Email'}:{' '}
                                        <strong>{dealerInfo.email}</strong>
                                      </Typography>
                                    )}
                                    {dealerInfo.companyName && (
                                      <Typography variant="body2" color="text.secondary">
                                        {t('companyName') || 'Company Name'}:{' '}
                                        <strong>{dealerInfo.companyName}</strong>
                                      </Typography>
                                    )}
                                    {dealerInfo.status && (
                                      <Typography variant="body2" color="text.secondary">
                                        {t('status') || 'Status'}:{' '}
                                        <strong>{dealerInfo.status}</strong>
                                      </Typography>
                                    )}
                                  </Box>
                                </Grid>
                              )}

                              {/* Timestamps */}
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                  {t('timestamps') || 'Timestamps'}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {t('createdAt') || 'Created At'}:{' '}
                                    <strong>
                                      {request.createdAt
                                        ? dayjs(request.createdAt).format('DD MMM YYYY, hh:mm A')
                                        : t('na') || 'N/A'}
                                    </strong>
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {t('updatedAt') || 'Updated At'}:{' '}
                                    <strong>
                                      {request.updatedAt
                                        ? dayjs(request.updatedAt).format('DD MMM YYYY, hh:mm A')
                                        : t('na') || 'N/A'}
                                    </strong>
                                  </Typography>
                                </Box>
                              </Grid>

                              {/* Documents */}
                              {request.documents && request.documents.length > 0 && (
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    {t('documents') || 'Documents'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                                    {request.documents.map((doc, index) => (
                                      <Button
                                        key={index}
                                        variant="outlined"
                                        startIcon={<HiDocumentText />}
                                        onClick={() =>
                                          handleFileClick({
                                            url: doc.url,
                                            filename: doc.filename,
                                            mimetype: doc.mimetype,
                                          })
                                        }
                                        sx={{
                                          textTransform: 'none',
                                        }}
                                      >
                                        {doc.key || doc.filename}
                                      </Button>
                                    ))}
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <UpdateStatusModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditRequest(null);
        }}
        request={editRequest}
        onSave={(status) => {
          if (editRequest) {
            updateMutate({ id: editRequest._id, status });
          }
        }}
      />

      <DeleteConfirmationModal
        open={openDeletedModal}
        onClose={() => {
          setOpenDeletedModal(false);
          setDeletedRequestId(null);
        }}
        onConfirm={() => {
          if (deletedRequestId) {
            deleteMutate({ id: deletedRequestId });
          }
        }}
        itemName={t('dealerRequest') || 'dealer request'}
      />

      <FileViewerModal
        open={fileViewerOpen}
        onClose={() => {
          setFileViewerOpen(false);
          setSelectedFile(null);
        }}
        file={selectedFile}
      />
    </Box>
  );
};

export default DealerRequestTable;

