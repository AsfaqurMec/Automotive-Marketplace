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
import { SiGooglecalendar } from 'react-icons/si';
import colors from '@/components/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { deleteLead, sendEmails } from '@/lib/api/leads';
import { toast } from 'react-toastify';
import UpdateReminderStatusModal from '@/components/modal/UpdateReminderStatusModal';
import { ApiResponse, Lead, EmailLog } from '@/types';

interface ExtendedLead extends Lead {
  reminder?: string;
  task?: string;
  eventId?: string;
}
import dynamic from 'next/dynamic';
import EmailLogModal from '@/components/modal/EmailLogModal';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import useAuth from '@/lib/hooks/useAuth';
import DeleteConfirmationModal from '@/components/modal/ConfirmationModal';

const EmailSender = dynamic(() => import('../../Mail/SendEmail'), {
  ssr: false,
});

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

interface CRMTableProps {
  setOpen: (open: boolean) => void;
  leads: Lead[];
  refetch: () => void;
  loading?: boolean;
}

const CRMTable: React.FC<CRMTableProps> = ({ leads, setOpen, loading = false }) => {
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<ExtendedLead | null>(null);
  const [open, SetOpen] = useState(false);
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [id, setId] = useState<string | null>(null);
  const [openDeletedModal, setOpenDeletedModal] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { primary, text, white } = colors;

  const { mutate: mutation } = useMutation({
    mutationFn: (data: { leadsIds: string[]; subject: string; content: string }) => {
      if (!user) throw new Error('User not authenticated');
      return sendEmails({ emails: data.leadsIds, subject: data.subject, content: data.content, leadsIds: data.leadsIds }, user);
    },
    onSuccess: (data: { message: string } | ApiResponse<{ success: boolean }>) => {
      toast.success(data.message || 'Emails sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['getLeads'] });
      setSelectedRows([]);
    },
    onError: (error: { response?: { data?: { message?: string } }; message?: string }) => {
      toast.error(error?.response?.data?.message || error.message || 'Failed to send emails');
    },
  });

  const handleSubmitEmail = ({ subject, content, leadsIds }: { subject: string, content: string, leadsIds: string[] }) => {
    const data = { leadsIds, subject, content };
    mutation(data);
  };

  const { mutate: onConfirm } = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      toast.success('Lead deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['getLeads'] });
      setOpenDeletedModal(false);
    },
    onError: () => {
      toast.error('Failed to delete lead. Please try again.');
    },
  });

  const handleDeleteClick = (id: string) => {
    if (user?.role?.roleId === 'admin') {
      onConfirm(id);
    } else {
      toast.error('You do not have delete access!');
    }
  };

  return (
    <Box m={isMobile ? 0 : 3}>
      {/* Top Controls */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={2}
        gap={2}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button
            onClick={() => setOpen(true)}
            variant="outlined"
            sx={{
              background: primary,
              color: white,
              maxHeight: 40,
              fontSize: { xs: '12px', sm: '14px' },
              px: 2,
            }}
          >
            {t('createLeads')}
          </Button>
          {selectedRows.length > 0 && (
            <EmailSender
              leadsIds={selectedRows}
              handleSubmitEmail={(data) =>
                handleSubmitEmail({
                  subject: data.subject,
                  content: data.content,
                  leadsIds: data.leadsIds ?? selectedRows,
                })
              }
            />
          )}
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: text,
            fontFamily: 'Rubik',
            fontSize: { xs: '18px', sm: '24px', md: '28px' },
            fontWeight: 500,
            my: 2,
            textAlign: { xs: 'center', md: 'start' },
          }}
        >
          {t('crmForLeadAndCustomerManagement')}
        </Typography>
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < leads?.length
                    }
                    checked={
                      leads?.length > 0 &&
                      selectedRows.length === leads?.length
                    }
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedRows(
                        e.target.checked ? (leads?.map((row: Lead) => row._id) as string[]) : [],
                      )
                    }
                  />
                </TableCell>
                {[
                  'lead',
                  'email',
                  'phone',
                  'carInterest',
                  'budget',
                  'leadsStatus',
                  'notes',
                  'reminder',
                  'task',
                ].map((key) => (
                  <TableCell
                    sx={{ minWidth: 150, whiteSpace: 'nowrap' }}
                    key={key}
                  >
                    <Box sx={{ whiteSpace: 'nowrap', textAlign: '' }}>
                      {t(key)}
                    </Box>
                  </TableCell>
                ))}
                {!isMobile && (
                  <>
                    <TableCell>
                      <Box sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <SiGooglecalendar color="#4285F4" size={20} />
                          <Typography variant="body2">
                            {t('googleCalendar')}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                        {t('trackingAdRemoval')}
                      </Box>
                    </TableCell>
                  </>
                )}
                <TableCell align="center">
                  <Box sx={{ whiteSpace: 'nowrap' }}>{t('actions')}</Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : leads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t ? t('noDataFound') : 'No data found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                leads?.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.includes(row._id)}
                        onChange={() => {
                          const selectedIndex = selectedRows.indexOf(row._id);
                          const newSelected =
                            selectedIndex === -1
                              ? [...selectedRows, row._id]
                              : [
                                ...selectedRows.slice(
                                  0,
                                  selectedIndex,
                                ),
                                ...selectedRows.slice(
                                  selectedIndex + 1,
                                ),
                              ];
                          setSelectedRows(newSelected);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={15}>{row.fullName}</Typography>
                      {/* <Typography variant="caption">
                        {t("exportManager")}
                      </Typography> */}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.interestedIn}</TableCell>
                    <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                      ₪{row.budget || 0}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        color={getStatusColor(row.status as string)}
                        sx={{ borderRadius: 0 }}
                        size="medium"
                      />
                    </TableCell>
                    <TableCell>{row.notes}</TableCell>
                    <TableCell>
                      {row.reminder
                        ? dayjs(row.reminder).format('DD MMM YYYY, hh:mm A')
                        : t('na')}
                    </TableCell>
                    <TableCell>{row.task}</TableCell>
                    {!isMobile && (
                      <>
                        <TableCell>{row.googleCalendarSyncStatus}</TableCell>
                        <TableCell>{row.trackingInfo}</TableCell>
                      </>
                    )}
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        <IconButton
                          onClick={() => {
                            SetOpen(true);
                            setEmailLogs(row?.emailLogs as unknown as EmailLog[]);
                          }}
                        >
                          <HiOutlineMailOpen />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (user?.role?.roleId === 'admin') {
                              setEditLead(row);
                              setModalOpen(true);
                            } else {
                              toast.error('You do not have edit access!');
                            }
                          }}
                        >
                          <MdEdit />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            if (user?.role?.roleId === 'admin') {
                              setId(row._id);
                              setOpenDeletedModal(true);
                            } else {
                              toast.error('You do not have delete access!');
                            }
                          }}
                        >
                          <MdDelete />
                        </IconButton>
                        {/* <IconButton>
                          <MdShare />
                        </IconButton> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <DeleteConfirmationModal
        open={openDeletedModal}
        onClose={() => setOpenDeletedModal(false)}
        onConfirm={() => handleDeleteClick(id as string)}
        itemName={t('lead')}
      />

      {/* Modals */}
      <UpdateReminderStatusModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditLead(null);
        }}
        lead={editLead}
        // onSave={() => {}}
        //refetch={refetch}
        setEditLead={setEditLead}
      />

      {open && (
        <EmailLogModal
          open={open}
          handleClose={() => SetOpen(false)}
          emailLogs={emailLogs}
        />
      )}
    </Box>
  );
};

export default CRMTable;

