import React from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NavigationMenu from '@/components/ui/NavigationButtons';
import MenuList from '@/components/ui/MenuItems';
import LocationSearchBar from '@/components/ui/LocationSearchBar';
import colors from '@/components/styles';
import AutoShopCard from '@/components/ui/GarageCard';
import MarketPlaceImage from '@/assets/MarketPlaceImage.png';

const cars = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const MarketPlaceComponent: React.FC = () => {
  const { t } = useTranslation();
  const foreground = colors.foreground;
  return (
    <Box
      sx={{
        width: '100%',
        background: foreground,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        my: 3,
      }}
    >
      <NavigationMenu />
      <LocationSearchBar text={t('sparePartsMarketplace')} />
      <MenuList menuItems={[t('availability'), t('engine'), t('model'), t('type'), t('brand')]} />
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
        {cars.map((index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <AutoShopCard image={MarketPlaceImage} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MarketPlaceComponent;
