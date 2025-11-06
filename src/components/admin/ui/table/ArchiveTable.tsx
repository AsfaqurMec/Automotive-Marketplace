import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const rows = Array.from({ length: 12 }, () => ({
  brand: 'Toyota',
  model: 'Corolla Z',
  year: '2022',
  mileage: '12,456km',
  accidents: 'N/A',
  service: 'N/A',
  ownership: '1st Party',
}));

const ArchiveTable: React.FC = () => {
  const [page] = React.useState<number>(0);
  const rowsPerPage = 10;

  return (
    <Box sx={{ p: 4, maxWidth: '100%' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Mileage</TableCell>
              <TableCell>Previous Accidents</TableCell>
              <TableCell>Service History</TableCell>
              <TableCell>Ownership History</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.brand}</TableCell>
                  <TableCell>{row.model}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell>{row.mileage}</TableCell>
                  <TableCell>{row.accidents}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>{row.ownership}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ArchiveTable;

