import React from 'react';
import { Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Vehicle } from '@/types';
import Price from './Price';

const SpecificationCard = ({ car }: { car: Vehicle }) => {
  const { t } = useTranslation();
  if (!car) return null;

  const specifications = [
    {
      category: t('basicInfo'),
      fields: [
        { label: t('title'), value: car.title },
        { label: t('condition'), value: car.condition },
        { label: t('year'), value: car.year },
        { label: t('brand'), value: car.brand || t('na') },
        { label: t('model'), value: car.model },
        { label: t('price'), value: undefined },
        { label: t('negotiable'), value: car.priceNegotiable ? t('yes') : t('no') },
      ],
    },
    {
      category: t('performance'),
      fields: [
        { label: t('fuelType'), value: car.fuelType },
        { label: t('mileage'), value: `${car.mileage} ${t('km')}` },
        { label: t('transmission'), value: car.transmission },
      ],
    },
    {
      category: t('location'),
      fields: [
        { label: t('country'), value: car.location?.country },
        { label: t('state'), value: car.location?.state },
        { label: t('city'), value: car.location?.city },
      ],
    },
    {
      category: t('features'),
      fields: (car.features || []).map((feature: string) => ({
        label: t('feature'),
        value: feature,
      })),
    },
  ];

  return (
    <Box sx={{ py: 4, textAlign: 'start', marginTop: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {t('description')}
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        {car.description || t('noDescriptionProvided')}
      </Typography>

      <Typography variant="h6" fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
        {t('specification')}
      </Typography>

      {specifications.map((spec, index) => (
        <Box key={index}>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            {spec.category}
          </Typography>

          <Card sx={{ my: 2, backgroundColor: '#f9f9f9' }}>
            <CardContent>
              <Grid container spacing={2}>
                {spec?.fields?.map((item: { label: string; value: string | number | undefined }, idx: number) => (
                  <Grid item xs={12} sm={4} key={idx}>
                    <Typography variant="body2">
                      {item.label}: {item.label === t('price') ? <Price amountUSD={Number(car.price) || 0} /> : item.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  );
};

export default SpecificationCard;

