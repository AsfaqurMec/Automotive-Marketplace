import React from 'react';
import { useTranslation } from 'react-i18next';
import NavigationMenu from '@/components/ui/NavigationButtons';
import Box from '@mui/material/Box';
import LocationSearchBar from '@/components/ui/LocationSearchBar';
import colors from '@/components/styles';
import AutoShopCard from '@/components/ui/GarageCard';
import AgencyImage from '@/assets/Agency.png';

const RecommendedAgenciesComponent: React.FC = () => {
  const { t } = useTranslation();
  const cars = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const foreground = colors.foreground;
  return (
    <Box
      sx={{
        my: 3,
        background: foreground,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <NavigationMenu />
      <LocationSearchBar text={t('recommendedAgencies')} />

      <Box
        sx={{
          width: '85%',
          display: 'flex',
          margin: 'auto',
          my: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {cars.map((car, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <AutoShopCard image={AgencyImage} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecommendedAgenciesComponent;
