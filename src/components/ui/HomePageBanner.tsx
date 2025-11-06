import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import bannerImage from '@/assets/Banner.png';

const BannerElement: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        p: { xs: 2, md: 2 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: { xs: '95%', sm: '90%', md: '80%' } }}>
        <Image
          src={bannerImage}
          alt="Banner"
          layout="responsive"
          width={100}
          height={400}
        />
      </Box>
    </Box>
  );
};

export default BannerElement;

