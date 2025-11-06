import React from 'react';
import { Box, FormControl, Select, MenuItem, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface SectionHeaderProps {
  showValue: number;
  sortValue: string;
  onShowChange: (event: SelectChangeEvent<number>) => void;
  onSortChange: (event: SelectChangeEvent<string>) => void;
  text: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  showValue,
  sortValue,
  onShowChange,
  onSortChange,
  text,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        {text}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select value={showValue} onChange={onShowChange}>
            <MenuItem value="10">Show 10</MenuItem>
            <MenuItem value="20">Show 20</MenuItem>
            <MenuItem value="50">Show 50</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select value={sortValue} onChange={onSortChange}>
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="price-high">Price High to Low</MenuItem>
            <MenuItem value="price-low">Price Low to High</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SectionHeader;

