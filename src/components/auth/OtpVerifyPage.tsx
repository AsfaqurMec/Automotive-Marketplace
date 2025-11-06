'use client';
import React, { useState } from 'react';
import { Box, Typography, TextField, Link } from '@mui/material';
import colors from '../styles';
import CustomButton from '../ui/CustomButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OptVerify: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const gray1 = colors.gray1;

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',

        width: '100%',
        bgcolor: '#f9f9f9',
      }}
    >
      <Box
        sx={{ display: 'flex', alignItems: 'start', m: 2 }}
        style={{ justifyContent: 'start !important' }}
      >
        <ArrowBackIcon fontSize="small" sx={{ color: gray1 }} />
        <Link
          href="/login"
          sx={{
            ml: 1,
            color: gray1,
            cursor: 'pointer',
            textDecoration: 'none',
            fontFamily: 'Rubik',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
          }}
        >
                    Back
        </Link>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: '700px',
          width: '100%',
          bgcolor: '#f9f9f9',
          mt: '30%',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'Rubik',
            fontSize: '44px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            mb: 2,
          }}
          mb={1}
        >
                    Password Reset
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: gray1,
            fontFamily: 'Rubik',
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
          }}
          mb={2}
        >
                    We sent a code to <span style={{ color: '#b5904b' }}>hamiusing@mail.com</span>
        </Typography>

        <Box display="flex" justifyContent={'center'} gap={1} mb={2}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              value={digit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
              variant="outlined"
              sx={{ width: '10%' }}
            />
          ))}
        </Box>

        <CustomButton etcStyle={{ width: '60%' }} onClick={() => {}}>Next</CustomButton>
      </Box>
    </Box>
  );
};

export default OptVerify;

