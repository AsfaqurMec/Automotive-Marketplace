import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import DirectionsIcon from '@mui/icons-material/Directions';
import colors from '../styles';
import CustomButton from './CustomButton';

interface AutoShopCardProps {
    image?: { src: string };
    title?: string;
    marketPlace?: boolean;
    onClick?: () => void;
}

const AutoShopCard: React.FC<AutoShopCardProps> = ({
  image,
  title = 'One Stop Auto Zone',
  marketPlace = false,
  onClick,
}) => {
  const bgColor = colors.background;
  const textBlack = colors.textBlack;
  const primary = colors.primary;
  const Styles = {
    fontFamily: 'Rubik',
    fontSize: '28px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };

  return (
    <Card sx={{ maxWidth: 400, borderRadius: 3, boxShadow: 3, padding: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={
          image
            ? image?.src
            : 'data:image/jpeg;base64,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'
        }
        alt="Auto Shop Image"
      />
      <CardContent sx={{ textAlign: 'end' }}>
        <Typography variant="h6" sx={Styles}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={1}>
                    It looks like readable English. Many desktop publishing packages and web page
                    editors now use...
        </Typography>

        <Box display="flex" justifyContent={'end'} gap={1} mb={1}>
          <Chip
            sx={{ borderRadius: 0 }}
            label="Hour: Closed|Open 9AM"
            variant="outlined"
          />
          <Chip
            sx={{ borderRadius: 0, mb: 2 }}
            label="Areas served: Israel"
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" fontWeight="bold">
                    Address: Altalef St 9, Yehud-Monosson, Israel
        </Typography>

        {marketPlace ? (
          <CustomButton
            etcStyle={{ fontSize: '18px', color: bgColor }}
            onClick={onClick || (() => {})}
          >
                      Price quotations from dealers
          </CustomButton>
        ) : (
          <Box display="flex" gap={1} mt={2}>
            <Button variant="outlined" startIcon={<DirectionsIcon />}>
                            Directions
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: primary }}
              startIcon={<CallIcon />}
            >
                            Call: +972 3-535-3976
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoShopCard;

