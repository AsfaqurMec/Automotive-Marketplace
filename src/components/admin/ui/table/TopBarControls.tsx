import React from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Pagination,
  Typography,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { FiFilter, FiPrinter, FiDownload } from 'react-icons/fi';
import { styled } from '@mui/system';
import colors from '@/components/styles';

const SearchBox = styled(Box)(() => ({
  background: '#f1f1f1',
  borderRadius: 8,
  padding: '2px 8px',
  display: 'flex',
  alignItems: 'center',
  width: 200,
}));

interface TopBarControlsProps {
  pageSize: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFilterClick: () => void;
  onPrintClick: () => void;
  onDownloadClick: () => void;
  t?: (key: string) => string;
}

const TopBarControls: React.FC<TopBarControlsProps> = ({
  pageSize,
  totalItems,
  currentPage,
  totalPages,
  onSearch,
  onPageChange,
  onPageSizeChange,
  onFilterClick,
  onPrintClick,
  onDownloadClick,
  t,
}) => {
  const { background } = colors;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? 'column' : 'row'}
      alignItems={isMobile ? 'stretch' : 'center'}
      justifyContent="space-between"
      px={isMobile ? 0 : 6}
      py={1}
      bgcolor={background}
      width="100%"
      mb={2}
      gap={isMobile ? 2 : 0}
    >
      <SearchBox sx={{ width: isMobile ? '100%' : 'auto' }}>
        <InputBase
          placeholder={t ? t('search') : 'Search'}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
          sx={{ ml: 1, flex: 1 }}
        />
      </SearchBox>

      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent={isMobile ? 'flex-start' : 'flex-end'}
        gap={isMobile ? 0.2 : 1.5}
        mt={isMobile ? 1 : 0}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {onPageSizeChange && (
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                displayEmpty
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          )}
          <Typography variant="body2" whiteSpace="nowrap">
            {start} - {end} {t ? t('of') : 'of'} {totalItems}
          </Typography>

          <Pagination
            count={totalPages || 1}
            page={currentPage ?? 1}
            size="small"
            onChange={(e, value) => onPageChange(value)}
            style={{ paddingRight: isMobile ? 0 : 0 }}
          />
        </Box>
        <IconButton onClick={onFilterClick}>
          <FiFilter />
        </IconButton>
        <IconButton onClick={onPrintClick}>
          <FiPrinter />
        </IconButton>
        <IconButton onClick={onDownloadClick}>
          <FiDownload />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopBarControls;

