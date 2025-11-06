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
  Button,
  Checkbox,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';

import { useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import colors from '@/components/styles';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '@/lib/hooks/useAuth';
import UpdateDealerModal from '@/components/modal/UpdateDealerModal';
import DeleteConfirmationModal from '@/components/modal/ConfirmationModal';
import CreateDealerModal from '@/components/modal/CreateDealerModal';
import { updateDealer, deleteDealer, createDealer } from '@/lib/api/users';
import { useTranslation } from 'react-i18next';
import { User, Dealer, DealerFormData } from '@/types';

interface DealerTableProps {
    dealers: Dealer[];
    loading?: boolean;
}

const DealerTable: React.FC<DealerTableProps> = ({ dealers, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { primary, text, white } = colors;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDealer, setEditDealer] = useState<Record<string, unknown>>({});
  const [openDeletedModal, setOpenDeletedModal] = useState(false);
  const [deletedDealer, setDeletedDealer] = useState<Record<string, unknown>>({});
  const queryClient = useQueryClient();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();
  const { mutate: updateMutate } = useMutation({
    mutationFn: updateDealer,
    onSuccess: () => {
      toast.success('Dealer Updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-dealers'] });
    },
    onError: () => {
      toast.error('Failed to update dealers');
    },
  });
  const { mutate: createMutate } = useMutation({
    mutationFn: ({ data, user }: { data: DealerFormData, user: User }) =>
      createDealer(data as unknown as Record<string, unknown>, user).then((res) => res.data),
    onSuccess: (data: { message?: string }) => {
      toast.success(data?.message || 'Dealer Create successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-dealers'] });
    },
    onError: (error: { response?: { data?: { errors?: string[]; message?: string } } }) => {
      toast.error(
        error?.response?.data?.errors?.[0] ||
                    error?.response?.data?.message ||
                    'Failed to Create dealers',
      );
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: ({ id, user }: { id: string, user: User }) =>
      deleteDealer(id, user).then((res) => res.data),
    onSuccess: (data: { message?: string }) => {
      toast.success(data?.message || 'Dealer deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-dealers'] });
      setOpenDeletedModal(false);
    },
    onError: (error: { response?: { data?: { errors?: string[]; message?: string } } }) => {
      setOpenDeletedModal(false);
      toast.error(
        error?.response?.data?.errors?.[0] ||
                    error?.response?.data?.message ||
                    'Failed to delete dealers',
      );
    },
  });

  const style = {
    color: text,
    textAlign: 'start',
    fontFamily: 'Rubik',
    fontSize: isMobile ? '20px' : '28px',
    fontWeight: 500,
    my: 3,
  };

  return (
    <Box m={{ xs: 0, md: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        gap={2}
        mb={2}
      >
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            onClick={() => setOpenCreateModal(true)}
            variant="outlined"
            sx={{
              background: primary,
              maxHeight: 40,
              color: white,
              fontSize: isMobile ? '12px' : '14px',
            }}
          >
            {t('createDealer')}
          </Button>
        </Box>
        <Typography variant="h6" sx={style}>
          {t('dealersManagement')}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedRows?.length > 0 &&
                    selectedRows?.length < dealers.length
                  }
                  checked={
                    dealers?.length > 0 &&
                    selectedRows.length === dealers?.length
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedRows(
                      e.target.checked ? dealers?.map((d) => d._id) : [],
                    );
                  }}
                />
              </TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t('companyName')}
              </TableCell>
              <TableCell sx={{ minWidth: 160, whiteSpace: 'nowrap' }}>
                {t('fullName')}
              </TableCell>
              <TableCell sx={{ minWidth: 180, whiteSpace: 'nowrap' }}>
                {t('contactPerson')}
              </TableCell>
              <TableCell>{t('email')}</TableCell>
              <TableCell sx={{ minWidth: 130, whiteSpace: 'nowrap' }}>
                {t('phone')}
              </TableCell>
              <TableCell>{t('verified')}</TableCell>
              <TableCell>{t('blocked')}</TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t('lastLogin')}
              </TableCell>
              <TableCell sx={{ minWidth: 120, whiteSpace: 'nowrap' }}>
                {t('createdAt')}
              </TableCell>
              <TableCell sx={{ minWidth: 120, whiteSpace: 'nowrap' }} align="center">
                {t('actions')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : dealers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t ? t('noDataFound') : 'No data found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              dealers?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(row._id)}
                      onChange={() => {
                        const selectedIndex = selectedRows.indexOf(row._id);
                        const newSelected = [...selectedRows];
                        if (selectedIndex === -1) {
                          newSelected.push(row._id);
                        } else {
                          newSelected.splice(selectedIndex, 1);
                        }
                        setSelectedRows(newSelected);
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.companyName || t('na')}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.contactPerson || t('na')}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone || t('na')}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.isVerified ? t('verified') : t('unverified')}
                      color={row.isVerified ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.isBlocked ? t('blocked') : t('active')}
                      color={row.isBlocked ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {row.lastLogin
                      ? dayjs(row.lastLogin).format('DD MMM YYYY, hh:mm A')
                      : t('never')}
                  </TableCell>
                  <TableCell>{dayjs(row.createdAt).format('DD MMM YYYY')}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => {
                        setEditDealer(row as unknown as Record<string, unknown>);
                        setModalOpen(true);
                      }}
                    >
                      <MdEdit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setDeletedDealer(row as unknown as Record<string, unknown>);
                        setOpenDeletedModal(true);
                      }}
                    >
                      <MdDelete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <UpdateDealerModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        dealers={editDealer}
        onSave={(updatedDealer) => {
          updateMutate({
            data: updatedDealer,
            user: user!,
          });
        }}
      />

      <DeleteConfirmationModal
        open={openDeletedModal}
        onClose={() => setOpenDeletedModal(false)}
        onConfirm={() => deleteMutate({ id: (deletedDealer as Record<string, unknown>)?._id as string, user: user! })}
        itemName={t('dealer')}
      />
      <CreateDealerModal
        open={openCreateModal}
        handleClose={() => setOpenCreateModal(false)}
        onSubmit={(data: Record<string, unknown>) => {
          createMutate({ data: data as unknown as DealerFormData, user: user! });
        }}
      />
    </Box>
  );
};

export default DealerTable;

