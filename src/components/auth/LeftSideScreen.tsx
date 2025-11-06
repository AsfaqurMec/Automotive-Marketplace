import React from 'react';
import { Typography, Box } from '@mui/material';
import {
  SvgComponent1,
  SvgComponent2,
  SvgComponent3,
  SvgComponent4,
  SvgComponent5,
  SvgComponent6,
} from '../ui/SvgComponent';
import colors from '../styles';
import logo from '@/assets/navbarLogo.png';

interface LeftSideScreenProps {
  width: string | { xs: string; lg: string; md: string };
}

const LeftSideScreen: React.FC<LeftSideScreenProps> = ({ width }) => {
  const textBlack = colors.textBlack;

  return (
    <Box
      sx={{
        width: width ? width : '100%',
        minHeight: '1001px',
        background: '#FFFDF6',
        position: 'relative',
        overflow: 'hidden',
        zIndex: -100,
        display: { xs: 'none', md: 'none', lg: 'flex' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '80%',
          transform: 'translate(-50%,-50%)',
          color: '#E8C983',
          zIndex: -100,
        }}
      >
        <SvgComponent1 />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '21%',
          left: '63%',
          transform: 'translate(-50%,-50%)',
          fill: '#E8C983!important',
          zIndex: -100,
        }}
      >
        <SvgComponent2 />
      </Box>

      <SvgComponent3 />

      <Box
        sx={{
          position: 'absolute',
          top: '0%',
          left: '10%',
          transform: 'translate(-50%,-50%)',
          zIndex: -100,
        }}
      >
        <SvgComponent4 />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '35%',
          transform: 'translate(-50%,-50%)',
          zIndex: -100,
        }}
      >
        <SvgComponent5 />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '64%',
          left: '29%',
          transform: 'translate(-70%,50%)',
          zIndex: -100,
        }}
      >
        <SvgComponent6 />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          zIndex: 100,
          gap: 1,
          textAlign: 'center',
          height: '100%',
          position: 'absolute',
          top: '40%',
          left: '30%',
        }}
      >
        <Box
          component="img"
          src={logo?.src}
          alt="logo"
          sx={{ width: '112px', height: '112px', zIndex: 100 }}
        />
        <Typography
          sx={{
            fontFamily: 'Rubik',
            fontSize: '80.758px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 'normal',
            mb: 2,
            color: textBlack,
          }}
        >
                    NextDeal
        </Typography>
      </Box>
    </Box>
  );
};
export default LeftSideScreen;

