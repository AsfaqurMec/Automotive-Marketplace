import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box, Paper } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import colors from '../styles';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';
import { Vehicle } from '@/types';
import Price from './Price';

const CarListing = ({ car }: { car: Vehicle }) => {
  const { t } = useTranslation();
  const bgColor = colors.background;
  const textBlack = colors.textBlack;
  const foreground = colors.foreground;
  const primary = colors.primary;

  const Styles = {
    fontFamily: 'Rubik',
    fontSize: { xs: '20px', sm: '24px', md: '28px' },
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };

  const images =
        car?.media?.map((img: { url: string }) => ({
          original: img.url,
          thumbnail: img.url,
        })) || [];
  return (
    <Card
      sx={{
        width: '100%',
        margin: 'auto',
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 2, sm: 4 },
        borderRadius: 2,
        boxShadow: 3,
        minHeight: { xs: 'auto', md: 400 },
        backgroundColor: bgColor,
      }}
    >
      <Grid container spacing={2}>
        {/* Text/Detail Section */}
        <Grid item xs={12} md={6}>
          <CardContent sx={{ textAlign: { xs: 'center', md: 'end' } }}>
            <Box
              display="flex"
              justifyContent={{ xs: 'flex-start', md: 'end' }}
              alignItems="center"
            >
              <Typography sx={Styles}>{car?.title}</Typography>
            </Box>

            <Grid
              container
              spacing={2}
              justifyContent={{ xs: 'flex-start', md: 'end' }}
              mt={2}
              gap={{ xs: 0, md: 1 }}
            >
              <Box
                display="flex"
                gap={2}
                mb={2}
                flexWrap="wrap"
                justifyContent={{ xs: 'flex-start', md: 'end' }}
              >
                <Paper sx={{ p: 1, backgroundColor: foreground }}>
                  <Typography variant="body2" color="text.primary">
                    {t('condition')}:{' '}
                    <strong style={{ color: '#D4A017' }}>
                      {car?.condition}
                    </strong>
                  </Typography>
                </Paper>
                <Paper sx={{ p: 1, backgroundColor: foreground }}>
                  <Typography variant="body2" color="text.primary">
                    {t('brand')}:{' '}
                    <strong style={{ color: '#D4A017' }}>{car?.brand}</strong>
                  </Typography>
                </Paper>
              </Box>

              <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                justifyContent={{ xs: 'flex-start', md: 'end' }}
              >
                <Paper sx={{ p: 1, backgroundColor: '#f9f9f9' }}>
                  <Typography variant="body2" color="text.primary">
                    {t('availability')}:{' '}
                    <strong style={{ color: '#D4A017' }}>
                      {t(car?.status?.toLowerCase())}
                    </strong>
                  </Typography>
                </Paper>
                <Paper sx={{ p: 1, backgroundColor: '#FAFAFA' }}>
                  <Typography variant="body2" color="text.primary">
                    {t('productCode')}:{' '}
                    <strong style={{ color: '#D4A017' }}>A07792</strong>
                  </Typography>
                </Paper>
              </Box>
            </Grid>

            {/* Basic Features */}
            <Typography sx={Styles} mt={2}>
              {t('basicFeatures')}
            </Typography>

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent={{ xs: 'flex-start', md: 'end' }}
              gap={1}
              mt={1}
              sx={{ fontFamily: 'Rubik' }}
            >
              {car?.features?.map((feature: string, idx: number) => (
                <Chip
                  key={idx}
                  sx={{ borderRadius: 0 }}
                  label={feature}
                  variant="outlined"
                />
              ))}
              {car?.transmission && (
                <Chip
                  sx={{ borderRadius: 0 }}
                  label={`${t('transmission')}: ${car.transmission}`}
                  variant="outlined"
                />
              )}
              {car?.fuelType && (
                <Chip
                  sx={{ borderRadius: 0 }}
                  label={`${t('fuelType')}: ${car.fuelType}`}
                  variant="outlined"
                />
              )}
            </Box>

            {/* Price */}
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              mt={3}
              textAlign={{ xs: 'center', md: 'end' }}
            >
              {t('price')}: <Price amountUSD={Number(car?.price) || 0} />
            </Typography>

            {/* Buttons */}
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'center', md: 'end' }}
              justifyContent={{ xs: 'center', md: 'end' }}
              gap={2}
              mt={2}
            >
              <CustomButton
                fullWidth
                onClick={() => {}}
                etcStyle={{
                  maxWidth: 262,
                  border: `1px solid var(--Primary, ${primary})`,
                  background: 'transparent',
                  color: primary,
                }}
              >
                {t('tradeIn')}
              </CustomButton>

              <CustomButton
                fullWidth
                onClick={() => {}} // Added required onClick prop
                etcStyle={{ minWidth: 262, fontSize: '18px' }}
              >
                <PhoneIcon sx={{ mr: 1 }} /> {t('call')}: +972-533-9975
              </CustomButton>
            </Box>
          </CardContent>
        </Grid>

        {/* Image Gallery */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            maxHeight: { xs: 300, sm: 400, md: 440 },
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: { xs: '100%', sm: '90%', md: '80%' } }}>
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
              additionalClass="responsive-gallery"
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CarListing;

