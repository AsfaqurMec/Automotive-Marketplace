'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { CiSettings } from 'react-icons/ci';

const MaintenanceSection4: React.FC = () => {
  return (
    <Box
      component="section"
      minHeight="100vh"
      display="grid"
      alignItems="center"
      justifyContent="center"
    >
      <Container>
        <Box textAlign="center">
          <CiSettings
            style={{
              height: '64px',
              width: '64px',
              margin: '0 auto',
              color: '#1976d2', // default MUI primary
            }}
          />
          <Typography
            variant="h5"
            fontWeight="500"
            sx={{
              my: 3,
              maxWidth: '600px',
              marginX: 'auto',
              textWrap: 'balance',
            }}
          >
                        We&apos;re currently undergoing maintenance to improve your experience.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.primary',
              maxWidth: '600px',
              marginX: 'auto',
              textWrap: 'balance',
            }}
          >
                        Please bear with us while we make these enhancements. We&apos;ll be back shortly.
                        Thank you for your patience!
          </Typography>
          <Box mt={4}>
            <Link href="/" passHref>
              <Button variant="contained" color="primary">
                                Back to Home
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MaintenanceSection4;

