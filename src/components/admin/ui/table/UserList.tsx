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
} from '@mui/material';

import { MdEdit, MdDelete } from 'react-icons/md';

import { useState } from 'react';
import colors from '@/components/styles';

import dayjs from 'dayjs';

import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserEditModal from '@/components/modal/UserEditModal';
import { updateCustomer, deleteCustomer, createCustomer } from '@/lib/api/users';
import DeleteConfirmationModal from '@/components/modal/ConfirmationModal';
import CreateCustomerModal from '@/components/modal/CreateCustomerModal';
import useAuth from '@/lib/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { User } from '@/types';

interface CustomerData {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  role?: { roleId: string; permissions?: Record<string, Record<string, boolean>> };
  isBlocked?: boolean;
  isEmailVerified?: boolean;
  lastLogin?: string | Date;
  createdAt: string | Date;
  [key: string]: unknown;
}

interface UpdateCustomerData {
  id: string;
  data: Record<string, unknown>;
}

interface CustomerTableProps {
    customer: CustomerData[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customer }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user } = useAuth();
  const { t } = useTranslation();
  const { primary, text, white } = colors;
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<CustomerData | null>(null);
  const [deletedCustomer, setDeletedCustomer] = useState<CustomerData | null>(null);
  const [openDeletedModal, setOpenDeletedModal] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const { mutate: mutation } = useMutation({
    mutationFn: ({ data, user }: { data: UpdateCustomerData, user: User }) => updateCustomer(data, user),
    onSuccess: (response: { data: { message?: string } }) => {
      toast.success(response.data.message || 'Customer Update successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-customer'] });
    },
    onError: (error: { response?: { data?: { errors?: string[], message?: string } } }) => {
      toast.error(
        error?.response?.data?.errors?.[0] ||
                    error?.response?.data?.message ||
                    'Failed to Update Customer  ',
      );
      // setEmailModal(!emailModal);
    },
  });
  const { mutate: createMutation } = useMutation({
    mutationFn: ({ data, user }: { data: { fullName: string; email: string; phone: string }, user: User }) => createCustomer(data, user),
    onSuccess: (response: { data: { message?: string } }) => {
      toast.success(response.data.message || 'Customer Create successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-customer'] });
    },
    onError: (error: { response?: { data?: { errors?: string[], message?: string } } }) => {
      toast.error(
        error?.response?.data?.errors?.[0] ||
                    error?.response?.data?.message ||
                    'Failed to Create Customer  ',
      );
      // setEmailModal(!emailModal);
    },
  });
  const { mutate: deletedMutation } = useMutation({
    mutationFn: ({ id, user }: { id: string, user: User }) => deleteCustomer(id, user),
    onSuccess: (response: { data: { message?: string } }) => {
      toast.success(response.data.message || 'Customer Delete successfully!');
      queryClient.invalidateQueries({ queryKey: ['get-customer'] });
      setOpenDeletedModal(false);
    },
    onError: (error: { response?: { data?: { errors?: string[], message?: string } } }) => {
      setOpenDeletedModal(false);
      toast.error(
        error?.response?.data?.errors?.[0] ||
                    error?.response?.data?.message ||
                    'Failed to Delete Customer  ',
      );
      // setEmailModal(!emailModal);
    },
  });

  const style = {
    color: text,
    textAlign: 'start',
    fontFamily: 'Rubik',
    fontSize: isMobile ? '20px' : '28px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    letterSpacing: '-0.114px',
    my: 3,
  };

  const handleClick = (event: React.MouseEvent<unknown>, row: CustomerData) => {
    const selectedIndex = selectedRows.indexOf(row._id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row._id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }

    setSelectedRows(newSelected);
  };

  return (
    <Box m={{ xs: 0, md: 3 }} overflow={'auto'}>
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
              px: 2,
            }}
          >
            {t('createCustomer')}
          </Button>
        </Box>

        <Typography variant="h6" sx={style}>
          {t('customerManagement')}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selectedRows?.length > 0 &&
                                        selectedRows?.length < customer?.length
                  }
                  checked={
                    customer?.length > 0 &&
                                        selectedRows?.length === customer?.length
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      setSelectedRows(customer?.map((row: CustomerData) => row?._id) || []);
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>{t('fullName')}</TableCell>
              <TableCell>{t('email')}</TableCell>
              <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                {t('phone')}
              </TableCell>
              <TableCell>{t('gender')}</TableCell>
              <TableCell>{t('role')}</TableCell>
              <TableCell>{t('blocked')}</TableCell>
              <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                {t('emailVerified')}
              </TableCell>
              <TableCell sx={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                {t('lastLogin')}
              </TableCell>
              <TableCell sx={{ minWidth: 130, whiteSpace: 'nowrap' }}>
                {t('createdAt')}
              </TableCell>
              <TableCell align="center">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customer?.map((row) => (
              <TableRow key={row._id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedRows.includes(row._id)}
                    onChange={() => handleClick({} as React.MouseEvent<unknown>, row)}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600} noWrap>
                    {row.fullName}
                  </Typography>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone || t('na')}</TableCell>
                <TableCell>{row.gender || t('na')}</TableCell>
                <TableCell>{row.role?.roleId || t('buyer')}</TableCell>
                <TableCell>
                  <Chip
                    label={row.isBlocked ? t('blocked') : t('active')}
                    color={row.isBlocked ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {row.isEmailVerified ? t('verified') : t('unverified')}
                </TableCell>
                <TableCell>
                  {row.lastLogin
                    ? dayjs(row.lastLogin).format('DD MMM YYYY, hh:mm A')
                    : t('never')}
                </TableCell>
                <TableCell>{dayjs(row.createdAt).format('DD MMM YYYY')}</TableCell>
                <TableCell style={{ display: 'flex' }} align="center">
                  <IconButton
                    onClick={() => {
                      setEditUser(row);
                      setModalOpen(true);
                    }}
                  >
                    <MdEdit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setDeletedCustomer(row);
                      setOpenDeletedModal(true);
                    }}
                  >
                    <MdDelete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <UserEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={editUser as CustomerData}
        onSave={(updateCustomer: { fullName?: string; email?: string; phone?: string; gender?: string; isBlocked?: boolean; isEmailVerified?: boolean; role?: { permissions?: Record<string, Record<string, boolean>>; [key: string]: unknown }; [key: string]: unknown }) => {
          mutation({ data: { id: editUser?._id || '', data: updateCustomer }, user: user as User });
        }}
      />
      <DeleteConfirmationModal
        open={openDeletedModal}
        onClose={() => setOpenDeletedModal(!openDeletedModal)}
        onConfirm={() => deletedMutation({ id: deletedCustomer?._id || '', user: user as User })}
        itemName={t('customer')}
      />
      <CreateCustomerModal
        open={openCreateModal}
        handleClose={() => setOpenCreateModal(!openCreateModal)}
        handleSubmitCustomer={(data: { fullName: string; email: string; phone: string }) => createMutation({ data, user: user as User })}
      />
    </Box>
  );
};

export default CustomerTable;

