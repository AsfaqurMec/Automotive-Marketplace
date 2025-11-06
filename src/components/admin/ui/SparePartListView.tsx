import React from 'react';
import { Paper, Typography, Box, Stack, Chip, Avatar, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import colors from '@/components/styles';
import { useTranslation } from 'react-i18next';

interface SparePartData {
  _id: string;
  title: string;
  brand?: string;
  condition?: string;
  status?: string;
  price: string;
  compatibleCars?: string[];
  updatedAt?: string;
  images?: string[];
}

interface SparePartListViewProps {
  data: SparePartData;
  selectedItemId?: string;
  handleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (data: SparePartData) => void;
}

const SparePartListView = ({
  data,
  selectedItemId,
  handleSelect,
  onDelete,
  onEdit,
}: SparePartListViewProps) => {
  const {
    _id,
    title,
    brand,
    condition,
    status,
    price,
    compatibleCars,
    updatedAt,
    images,
  } = data || {};

  const { white, grayText, textBlack } = colors;
  const { t } = useTranslation();

  return (
    <Paper
      elevation={selectedItemId === _id ? 6 : 1}
      onClick={() => handleSelect(_id)}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 4,
        border: selectedItemId === _id ? '2px solid #1976d2' : '1px solid #e0e0e0',
        bgcolor: white,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar
          variant="rounded"
          src={`/${images?.[0]}` || 'https://via.placeholder.com/100'}
          alt={title}
          sx={{ width: 100, height: 100, borderRadius: 3 }}
        />

        <Box flexGrow={1}>
          <Typography
            sx={{ fontWeight: 600, fontSize: '1.2rem', color: textBlack, mb: 1 }}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={1} mb={0.5} alignItems="center">
            <LocalOfferIcon fontSize="small" sx={{ color: grayText }} />
            <Typography variant="body2" color={grayText}>
              {t('price')}: {price} â‚ª
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} mb={0.5} alignItems="center">
            <DirectionsCarIcon fontSize="small" sx={{ color: grayText }} />
            <Typography variant="body2" color={grayText}>
              {t('compatibleWith')}:{' '}
              {Array.isArray(compatibleCars)
                ? compatibleCars.join(', ')
                : compatibleCars}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
            {brand && (
              <Chip
                label={brand}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  bgcolor: '#e3f2fd',
                  color: '#1976d2',
                  fontWeight: 500,
                }}
              />
            )}
            {condition && (
              <Chip
                label={condition}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  bgcolor: '#f3e5f5',
                  color: '#6a1b9a',
                  fontWeight: 500,
                }}
              />
            )}
            <Chip
              label={t((status || 'Pending').toLowerCase())}
              icon={<CheckCircleIcon />}
              variant="outlined"
              color={
                status === 'Approved'
                  ? 'success'
                  : status === 'Pending'
                    ? 'warning'
                    : status === 'Rejected'
                      ? 'error'
                      : 'default'
              }
              sx={{
                fontWeight: 500,
              }}
            />
          </Stack>

          <Typography variant="caption" color={grayText} mt={1} display="block">
            {t('updated')}: {updatedAt}
          </Typography>
        </Box>

        {/* Actions */}
        <Stack direction="column" spacing={1}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<EditIcon style={{ marginLeft: 8 }} />}
            onClick={() => {
              onEdit(data);
            }}
            sx={{ textTransform: 'none', px: 2 }}
          >
            {t('edit')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<DeleteIcon style={{ marginLeft: 8 }} />}
            onClick={() => {
              onDelete(data?._id);
            }}
            sx={{ textTransform: 'none', px: 2 }}
          >
            {t('delete')}
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#c69c6d',
              color: '#fff',
              textTransform: 'none',
              px: 2,
              '&:hover': {
                backgroundColor: '#b68d5f',
              },
            }}
            startIcon={<VisibilityIcon />}
            onClick={() => {}}
          >
            {t('view')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SparePartListView;

