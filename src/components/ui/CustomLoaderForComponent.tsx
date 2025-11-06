import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { keyframes } from '@mui/system';

const spinPulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const dots = keyframes`
  0% { content: ''; }
  33% { content: '.'; }
  66% { content: '..'; }
  100% { content: '...'; }
`;

const CustomLoaderForComponent: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        zIndex: 9999,
      }}
    >
      <CircularProgress
        sx={{
          animation: `${spinPulse} 1.5s infinite ease-in-out`,
          color: 'primary.main',
          width: 60,
          height: 60,
          mb: 2,
        }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: 'text.secondary',
          '&::after': {
            content: '""',
            animation: `${dots} 1.5s infinite steps(3)`,
            display: 'inline-block',
            width: '1em',
          },
        }}
      >
                Loading
      </Typography>
    </Box>
  );
};

export default CustomLoaderForComponent;

