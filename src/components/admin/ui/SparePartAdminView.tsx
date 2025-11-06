import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import colors from '@/components/styles';
// Removed unused import
import { useTranslation } from 'react-i18next';

interface SparePartData {
  _id?: string;
  title?: string;
  description?: string;
  price?: string;
  status?: string;
  image?: string;
  compatibleCars?: string[];
  updatedAt?: string;
  [key: string]: unknown;
}

interface SparePartAdminViewProps {
  image?: string;
  title?: string;
  status?: string;
  updatedAt?: string;
  price?: string;
  compatibleCars?: string[];
  onEdit: (data: SparePartData) => void;
  onDelete: (id: string) => void;
  data: SparePartData;
}

const SparePartAdminView = ({
  image,
  title = 'Brake Pad Set',
  status = 'Pending',
  updatedAt = '2025-05-01',
  price = '$49.99',
  compatibleCars = ['Toyota', 'Honda', 'Ford'],
  onEdit,
  onDelete,
  data,
}: SparePartAdminViewProps) => {
  // Removed unused variables
  const { grayText, white } = colors;
  const { t } = useTranslation();
  return (
    <Card
      sx={{
        maxWidth: 450,
        borderRadius: 4,
        boxShadow: 6,
        bgcolor: white,
        p: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 10,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image ? `/${image}` : 'https://via.placeholder.com/400x200?text=Spare+Part'}
        alt={title}
        sx={{ borderRadius: 3, objectFit: 'cover' }}
      />

      <CardContent>
        <Typography
          sx={{
            fontFamily: 'Rubik',
            fontSize: '22px',
            fontWeight: 600,
            color: 'text.primary',
            mb: 1.5,
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
          <LocalOfferIcon fontSize="small" sx={{ color: grayText }} />
          <Typography variant="body2" color={grayText}>
            {t('price')}: {price} â‚ª
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
          <DirectionsCarIcon fontSize="small" sx={{ color: grayText }} />
          <Typography variant="body2" color={grayText}>
            {t('compatibleWith')}:{' '}
            {Array.isArray(compatibleCars) ? compatibleCars.join(', ') : compatibleCars}
          </Typography>
        </Stack>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip
            label={t(status.toLowerCase())}
            color={
              status === 'Approved'
                ? 'success'
                : status === 'Pending'
                  ? 'warning'
                  : status === 'Rejected'
                    ? 'error'
                    : 'default'
            }
            icon={<CheckCircleIcon />}
            variant="outlined"
            sx={{
              fontWeight: 500,
              px: 1,
            }}
          />
          <Typography variant="caption" color={grayText}>
            {t('updated')}: {updatedAt}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<EditIcon style={{ marginLeft: 8 }} />}
            size="small"
            color="primary"
            onClick={() => onEdit(data)}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              boxShadow: 1,
              '&:hover': {
                boxShadow: 3,
              },
            }}
          >
            {t('edit')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon style={{ marginLeft: 8 }} />}
            size="small"
            color="error"
            onClick={() => onDelete(data?._id || '')}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              '&:hover': {
                backgroundColor: '#ffe6e6',
              },
            }}
          >
            {t('delete')}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SparePartAdminView;

