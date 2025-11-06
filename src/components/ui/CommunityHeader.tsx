import React from 'react';
import { Box, Button, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import colors from '../styles';
import { useTranslation } from 'react-i18next';

const CommunityHeader = ({ handleChange }: { handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) => {
  const { t } = useTranslation();
  const { background } = colors;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 0, md: 3 },
        py: 2,
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          background: background,
          width: { xs: '100%', md: '60%', lg: '40%' },
          justifyContent: 'space-between',
          py: 2,
          px: 0,
        }}
      >
        <Button
          style={{ marginLeft: 5, marginRight: 5 }}
          variant="contained"
          sx={{
            bgcolor: '#b8914d',
            color: '#fff',
            px: 3,
            '&:hover': {
              bgcolor: '#9c783d',
            },
          }}
          startIcon={<SearchIcon style={{ marginRight: 0, marginLeft: 5 }} />}
        >
                    Search
        </Button>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: 2,
            px: 2,
            height: 40,
            width: { xs: '100%', sm: 250 },
          }}
        >
          <InputBase
            placeholder={t('searchYourVehicle')}
            sx={{
              flex: 1,
              border: 'none',
              outline: 'none',
              '& input': {
                border: 'none !important',
                outline: 'none !important',
                boxShadow: 'none !important',
              },
            }}
            inputProps={{ 'aria-label': 'search vehicles' }}
            onChange={handleChange}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CommunityHeader;

