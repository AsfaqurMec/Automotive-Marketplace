import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';

import { useState } from 'react';
import { MdVisibility, MdChat } from 'react-icons/md';
import colors from '@/components/styles';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Dealer } from '@/types';
import { useRouter } from 'next/navigation';
import DealerChatModal from '../../../modal/DealerChatModal';

interface PublicDealerTableProps {
    dealers: Dealer[];
    loading?: boolean;
}

const PublicDealerTable: React.FC<PublicDealerTableProps> = ({ dealers, loading = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { text } = colors;
  const { t } = useTranslation();
  const router = useRouter();
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  const style = {
    color: text,
    textAlign: 'start',
    fontFamily: 'Rubik',
    fontSize: isMobile ? '20px' : '28px',
    fontWeight: 500,
    my: 3,
  };

  const handleViewDetails = (dealerId: string) => {
    router.push(`/admin/dealer/${dealerId}`);
  };

  const handleChatWithDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setChatModalOpen(true);
  };

  const handleCloseModal = () => {
    setChatModalOpen(false);
    setSelectedDealer(null);
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
        <Typography variant="h6" sx={style}>
          {t('dealersDirectory')}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t('companyName')}
              </TableCell>
              <TableCell sx={{ minWidth: 160, whiteSpace: 'nowrap' }}>
                {t('fullName')}
              </TableCell>
              <TableCell>{t('email')}</TableCell>
              <TableCell sx={{ minWidth: 130, whiteSpace: 'nowrap' }}>
                {t('phone')}
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
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : dealers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t ? t('noDataFound') : 'No data found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              dealers?.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.companyName || t('na')}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone || t('na')}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('DD MMM YYYY')}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleViewDetails(row._id)}
                      title={t('viewDetails')}
                    >
                      <MdVisibility />
                    </IconButton>
                    <IconButton
                      onClick={() => handleChatWithDealer(row)}
                      title={t('chatWithDealer')}
                    >
                      <MdChat />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <DealerChatModal
        open={chatModalOpen}
        dealer={selectedDealer}
        onClose={handleCloseModal}
      />
    </Box>
  );
};

export default PublicDealerTable;

