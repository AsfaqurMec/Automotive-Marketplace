import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField,
  CircularProgress,
} from '@mui/material';
import { FiTrash2 } from 'react-icons/fi';
import colors from '@/components/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignLeads, deleteExclusiveLead, updateExclusiveLead } from '@/lib/api/leads';
import { toast } from 'react-toastify';
import useAuth from '@/lib/hooks/useAuth';
import { Lead } from '@/types';
import DeleteConfirmationModal from '@/components/modal/ConfirmationModal';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'success';
    case 'Closed':
      return 'error';
    case 'In progress':
      return 'warning';
    default:
      return 'default';
  }
};

const LeadsTable = ({ leads, t, loading = false }: { leads: Lead[]; t: (key: string, options?: Record<string, unknown>) => string; loading?: boolean }) => {
  const { background } = colors;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editableLead, setEditableLead] = useState<Lead | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [openDeletedModal, setOpenDeletedModal] = useState(false);

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const updateMutation = useMutation({
    mutationFn: updateExclusiveLead,
    onSuccess: () => {
      toast.success('Lead updated successfully');
      setOpenEditDialog(false);
      queryClient.invalidateQueries({ queryKey: ['getExcludeLeads'] });
    },
    onError: () => {
      toast.error('Failed to update lead');
    },
  });

  const assignMutation = useMutation({
    mutationFn: (ids: string[]) => {
      if (!user) throw new Error('User not authenticated');
      return assignLeads(ids, user);
    },
    onSuccess: () => {
      setSelectedRows([]);
      setOpenConfirm(false);
      toast.success('Leads assigned successfully');
      queryClient.resetQueries({ queryKey: ['getExcludeLeads'], exact: true });
    },
    onError: (error) => {
      toast.error(error.message || 'Something went wrong while assigning leads');
    },
  });

  const { mutate: onConfirm } = useMutation({
    mutationFn: deleteExclusiveLead,
    onSuccess: () => {
      toast.success(' Lead deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['getExcludeLeads'] });
      setOpenDeletedModal(false);
    },
    onError: () => {
      toast.error('Failed to delete lead. Please try again.');
    },
  });

  const handleSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isSelected = (id: string) => selectedRows.includes(id);

  const handleAssignClick = () => {
    if (user?.role?.roleId === 'admin') {
      setOpenConfirm(true);
    } else {
      toast.error('You do not have assign access!');
    }
  };

  const handleConfirmAssign = () => {
    if (user?.role?.roleId === 'admin') {
      assignMutation.mutate(selectedRows);
    } else {
      toast.error('You do not have assign access!');
    }
  };

  const handleDeleteClick = (id: string) => {
    if (user?.role?.roleId === 'admin') {
      onConfirm(id);
    } else {
      toast.error('You do not have delete access!');
    }
  };

  return (
    <Box>
      {selectedRows.length > 0 && (
        <Box mb={2}>
          <Button variant="contained" color="primary" onClick={handleAssignClick}>
            {t ? t('assign') : 'Assign'}
          </Button>
        </Box>
      )}

      <TableContainer sx={{ background }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t ? t('lead') : 'Lead'}
              </TableCell>
              <TableCell>{t ? t('email') : 'Email'}</TableCell>
              <TableCell>{t ? t('phone') : 'Phone'}</TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t ? t('carInterest') : 'Car Interest'}
              </TableCell>
              <TableCell sx={{ minWidth: 160, whiteSpace: 'nowrap' }}>
                {t ? t('budget') : 'Budget'}
              </TableCell>
              <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                {t ? t('leadStatus') : 'Lead Status'}
              </TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t ? t('notes') : 'Notes'}
              </TableCell>
              <TableCell>{t ? t('actions') : 'Actions'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : leads?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t ? t('noDataFound') : 'No data found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              leads?.map((row: Lead) => (
                <TableRow key={row._id || ''} selected={isSelected(row._id || '')}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row._id)}
                      onChange={() => handleSelect(row._id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontSize={15}>{row.fullName}</Typography>
                      {/* <Typography variant="caption">{t ? t('exportManager') : 'Export Manager'}</Typography> */}
                    </Box>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.interestedIn}</TableCell>
                  <TableCell>{row.budget}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status || '')}
                      sx={{ borderRadius: 0 }}
                      size="medium"
                    />
                  </TableCell>
                  <TableCell>{row.notes}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      {/* <IconButton onClick={() => handleOpenEditDialog(row)} size="small">
                        <FiEdit />
                      </IconButton> */}
                      <IconButton
                        onClick={() => {
                          if (user?.role?.roleId === 'admin') {
                            setId(row._id);
                            setOpenDeletedModal(true);
                          } else {
                            toast.error('You do not have delete access!');
                          }
                        }}
                        size="small"
                      >
                        <FiTrash2 />
                      </IconButton>
                      {/* <IconButton size="small">
                        <FiShare2 />
                      </IconButton> */}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteConfirmationModal
        open={openDeletedModal}
        onClose={() => setOpenDeletedModal(false)}
        onConfirm={() => handleDeleteClick(id as string)}
        itemName={t('lead')}
      />

      {/* lead update modal */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth>
        <DialogTitle>{t ? t('Edit Lead') : 'Edit Lead'}</DialogTitle>
        <DialogContent dividers>
          {editableLead && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Name"
                value={editableLead.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditableLead({ ...editableLead, fullName: e.target.value })
                }
              />
              <TextField
                label="Email"
                value={editableLead.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditableLead({ ...editableLead, email: e.target.value })
                }
              />
              <TextField
                label="Phone"
                value={editableLead.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditableLead({ ...editableLead, phone: e.target.value })
                }
              />
              <TextField
                label="Interested In"
                value={editableLead.interestedIn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditableLead({
                    ...editableLead,
                    interestedIn: e.target.value,
                  })
                }
              />
              <TextField
                label="Budget"
                value={editableLead.budget}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditableLead({ ...editableLead, budget: e.target.value })
                }
              />
              <TextField
                label="Status"
                value={editableLead.status}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditableLead({ ...editableLead, status: e.target.value as 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' })
                }
              />
              <TextField
                label="Notes"
                value={editableLead.notes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditableLead({ ...editableLead, notes: e.target.value })
                }
                multiline
                rows={3}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            {t ? t('cancel') : 'Cancel'}
          </Button>
          <Button
            onClick={() => updateMutation.mutate(editableLead as Partial<Lead>)}
            variant="contained"
            color="primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending
              ? t
                ? t('saving')
                : 'Saving...'
              : t
                ? t('saveChanges')
                : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>{t ? t('confirmAssignment') : 'Confirm Assignment'}</DialogTitle>
        <DialogContent>
          <Typography>
            {t
              ? t('areYouSureAssign', { count: selectedRows.length })
              : `Are you sure you want to assign ${selectedRows.length} lead(s)?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="secondary">
            {t ? t('cancel') : 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirmAssign}
            color="primary"
            variant="contained"
            disabled={assignMutation.isPending}
          >
            {assignMutation.isPending
              ? t
                ? t('assigning')
                : 'Assigning...'
              : t
                ? t('confirm')
                : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsTable;

