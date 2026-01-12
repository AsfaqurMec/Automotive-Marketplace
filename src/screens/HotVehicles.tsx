import React, { useState } from 'react';
import { SelectChangeEvent, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NavigationMenu from '@/components/ui/NavigationButtons';
import CarList from '@/components/ui/Category';
import SearchBar from '@/components/ui/SearchBar';
import HomePageCars from '@/components/ui/HomePageCars';
// Removed unused import
import MenuList from '@/components/ui/MenuItems';
import colors from '@/components/styles';
import SectionHeader from '@/components/ui/SectionHeader';

const HotVehiclesComponent: React.FC = () => {
  const { t } = useTranslation();
  const bgColor = colors.background;

  const foreground = colors.foreground;
  const [showValue, setShowValue] = useState<number>(10);
  const [sortValue, setSortValue] = useState<string>('default');
  return (
    <Box
      sx={{
        width: '100%',
        background: foreground,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '80%',
          textAlign: 'center',
          margin: 'auto',
          background: bgColor,
          my: 3,
        }}
      >
        <NavigationMenu />
      </Box>
      <SearchBar text={t('vehiclePredictionTrends')} />
      <CarList />
      <Box sx={{ width: '80%', textAlign: 'center', margin: 'auto', my: 3 }}>
        <SectionHeader
          showValue={showValue}
          sortValue={sortValue}
          onShowChange={(e: SelectChangeEvent<number>) => setShowValue(e.target.value as number)}
          onSortChange={(e: SelectChangeEvent<string>) => setSortValue(e.target.value)}
          text={`${t('hotVehicle')} 🔥`}
        />
      </Box>
      <MenuList menuItems={[t('availability'), t('engine'), t('model'), t('type'), t('brand')]} />
      <HomePageCars
        text={t('vehiclePredictionTrends')}
        cars={[]}
        buttonText={t('contactDealer')}
      />
    </Box>
  );
};

export default HotVehiclesComponent;
