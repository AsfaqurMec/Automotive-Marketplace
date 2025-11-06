/**
 * CarCard Component - NextDeal Frontend
 *
 * A reusable card component for displaying vehicle information in the marketplace.
 * This component shows vehicle details including image, title, description, price,
 * and action buttons for user interaction.
 *
 * Features:
 * - Responsive design with Material-UI components
 * - Internationalization support
 * - Contact dealer action button
 * - Consistent styling with theme colors
 *
 * @param {Object} car - Vehicle data object containing all car information
 * @param {Function} onContact - Callback function when contact button is clicked
 */

import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import colors from '../styles';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { Vehicle } from '../../types';
import Price from './Price';

interface CarCardProps {
  car: Vehicle;
  onContact?: (carId: string) => void;
}

const CarCard: React.FC<CarCardProps> = React.memo(({
  car,
  onContact,
}) => {
  const { t } = useTranslation();

  // Extract theme colors for consistent styling
  const bgColor = colors.background;
  const gray1 = colors.gray1;
  const textBlack = colors.textBlack;
  const primary = colors.primary;

  // Typography styles for vehicle title
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
    <Card
      sx={{
        width: '100%',
        maxWidth: '100%',
        borderRadius: 3,
        boxShadow: 3,
        padding: 2,
        maxHeight: 597,
        mt: 2,
        background: bgColor,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Action buttons row - Favorite and Share */}
      <Box display="flex" justifyContent="start" p={1}>
        <IconButton>
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton>
          <ShareIcon />
        </IconButton>
      </Box>

      {/* Vehicle image */}
      <Box
        component="img"
        src={car?.media?.[0]?.url}
        alt="Mercedes-Benz GLA"
        sx={{ width: '100%', borderRadius: 2, maxHeight: '190px' }}
      />

      {/* Vehicle information content */}
      <CardContent>
        {/* Vehicle title */}
        <Typography variant="h6" fontWeight="bold" textAlign={'end'} sx={Styles}>
          {car?.title}
        </Typography>

        {/* Brand / Model */}
        <Typography
          variant="body2"
          textAlign={'end'}
          sx={{ color: gray1, fontFamily: 'Rubik', mb: 1 }}
        >
          {car?.brand} • {car?.model}
        </Typography>

        {/* Vehicle description */}
        <Typography
          variant="body1"
          textAlign={'end'}
          sx={{ color: gray1, fontFamily: 'Rubik' }}
        >
          {car?.description}
        </Typography>

        {/* Vehicle price */}
        <Typography variant="body1" fontWeight="bold" color={textBlack} mt={1}>
          {t('price')}: <br />
          <Typography component="span" sx={{ color: 'primary.main' }}>
            <Price amountUSD={Number(car?.price) || 0} />
          </Typography>
        </Typography>
      </CardContent>

      {/* Actions */}
      <Box display="flex" justifyContent="space-between" gap={1} px={2} pb={2}>
        <Link href={`/cars/${car._id}`} style={{ textDecoration: 'none' }}>
          <Button variant="outlined" sx={{ textTransform: 'none' }}>
            {t('moreDetails') || 'More Details'}
          </Button>
        </Link>
        <Button
          variant="contained"
          onClick={() => onContact?.(car.postedBy)}
          sx={{
            textTransform: 'none',
            backgroundColor: primary,
            '&:hover': { backgroundColor: '#9c783d' },
          }}
        >
          {t('contactDealer')}
        </Button>
      </Box>
    </Card>
  );
});

CarCard.displayName = 'CarCard';

export default CarCard;

