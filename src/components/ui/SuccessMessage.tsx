import { Typography } from '@mui/material';
import React from 'react';

interface SuccessMessageProps {
    message?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = (props) => {
  return props.message ? (
    <Typography
      variant="body1"
      color="success.main"
      align="center"
      style={{
        width: '100%',
        padding: '8px',
        backgroundColor: 'rgba(0, 128, 0, 0.1)',
        border: '1.5px solid',
        borderColor: 'rgba(0, 128, 0, 0.3)',
        borderRadius: '4px',
      }}
      {...props}
    >
      {props?.message}
    </Typography>
  ) : null;
};

export default SuccessMessage;

