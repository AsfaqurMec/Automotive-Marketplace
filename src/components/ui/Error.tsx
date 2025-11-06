import React from 'react';
import { Typography } from '@mui/material';

interface ErrorProps {
  message?: string | null;
  mt?: number;
}

const Error: React.FC<ErrorProps> = ({ message, mt = 0 }) => {
  return message ? (
    <Typography
      variant="body2"
      color="error"
      sx={{ mt: mt * 8 }}
    >
      {message}
    </Typography>
  ) : null;
};

export default Error;

