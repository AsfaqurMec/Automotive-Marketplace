import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { FiFilter } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const data = Array.from({ length: 10 }, (_, i) => ({
  phone: `+1 654-654-679${i}`,
  firstName: 'OHA',
  lastName: 'luafm',
  createdTime: '2025 Jan 02',
}));

const BulkMessage: React.FC = () => {
  const { t } = useTranslation();
  const style = {
    color: '#1E1E1E',
    textAlign: 'end',
    fontFamily: 'Rubik',
    fontSize: '28px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    letterSpacing: '-0.114px',
    my: 3,
  };
  return (
    <Box sx={{ m: { xs: 0, mb: 2 } }}>
      <Typography variant="h6" sx={style}>
        {t('bulkMessage')}
      </Typography>
      <Box display="flex" justifyContent="end" sx={{ width: '100%', gap: { xs: 1, md: 5 } }}>
        <Button
          variant="contained"
          startIcon={<FiFilter style={{ marginLeft: 2, marginRight: 2 }} />}
          sx={{ backgroundColor: '#c5a25b', minHeight: '50px' }}
        >
                    Filter
        </Button>
        <TextField
          fullWidth
          placeholder="Search by phone number, first name, last name..."
          variant="outlined"
          sx={{ maxWidth: '70%' }}
        />
      </Box>
      <Typography variant="h6" sx={style}>
        {t('hotCustomers')}
      </Typography>

      <TableContainer component={Paper} style={{ marginBottom: '50px' }}>
        <Table style={{ overflowX: 'scroll' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t('phoneNumber')}
              </TableCell>
              <TableCell sx={{ minWidth: 120, whiteSpace: 'nowrap' }}>
                {t('firstName')}
              </TableCell>
              <TableCell sx={{ minWidth: 120, whiteSpace: 'nowrap' }}>
                {t('lastName')}
              </TableCell>
              <TableCell sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
                {t('createdTime')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.firstName}</TableCell>
                <TableCell>{row.lastName}</TableCell>
                <TableCell>{row.createdTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BulkMessage;

