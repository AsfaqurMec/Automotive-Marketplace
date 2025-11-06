import {
  Card,
  Grid,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
} from '@mui/material';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

import i18n from '@/i18n';
import { Vehicle } from '@/types';

interface CarCardProps {
  data: Vehicle;
  handleDeleteClick: (id: string) => void;
  handleOpenUpdateModal: (data: Vehicle) => void;
}

export default function CarCard({ data, handleDeleteClick, handleOpenUpdateModal }: CarCardProps) {
  const { t } = useTranslation();
  const isRtl = i18n.language === 'he' || (typeof document !== 'undefined' && document.dir === 'rtl');

  const style = {
    fontSize: '24px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
  };

  const getChipProps = (status: string) => {
    if (!status) return {};

    const value = status.toLowerCase();

    switch (value) {
      case 'sold':
        return {
          label: t('sold'),
          sx: {
            background: 'rgba(218, 32, 32, 0.10)',
            color: 'red',
            borderRadius: 0,
            width: 'fit-content',
          },
        };
      case 'available':
        return {
          label: t('available'),
          sx: {
            background: 'rgba(0, 128, 0, 0.10)',
            color: 'green',
            borderRadius: 0,
            width: 'fit-content',
          },
        };
      case 'pending':
        return {
          label: t('pending'),
          sx: {
            background: 'rgba(255, 165, 0, 0.10)',
            color: 'orange',
            borderRadius: 0,
            width: 'fit-content',
          },
        };
      default:
        return {
          label: status,
          sx: {
            background: 'rgba(0, 0, 0, 0.05)',
            color: '#333',
            borderRadius: 0,
            width: 'fit-content',
          },
        };
    }
  };
  return (
    <Card sx={{ borderRadius: 4, p: { xs: 1, md: 2 }, maxWidth: 800 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={7}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Chip size="medium" {...getChipProps(data?.status)} />
              <Typography variant="h6" fontWeight="bold" sx={style}>
                {data?.title}
              </Typography>
            </Box>
            <Grid container spacing={2} mt={2}>
              <Box display={'flex'} gap={1} mb={2}>
                <Typography variant="body2" color="text.primary">
                  {t('condition')}:{' '}
                  <strong style={{ color: '#D4A017' }}>{data?.condition}</strong>
                </Typography>

                <Typography variant="body2" color="text.primary">
                  {t('brand')}:{' '}
                  <strong style={{ color: '#D4A017' }}>{data?.brand}</strong>
                </Typography>
              </Box>

              <Box display={'flex'} gap={2}>
                <Typography variant="body2" color="text.primary">
                  {t('availability')}:{' '}
                  <strong style={{ color: '#D4A017' }}>
                    {t(data?.status?.toLowerCase())}
                  </strong>
                </Typography>

                <Typography variant="body2" color="text.primary">
                  {t('productCode')}:{' '}
                  <strong style={{ color: '#D4A017' }}>
                    {data?.productCode}
                  </strong>
                </Typography>
              </Box>
            </Grid>

            <Typography
              variant="subtitle1"
              textAlign={isRtl ? 'start' : 'end'}
              fontWeight="bold"
              mt={1}
            >
              {t('price')}
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              textAlign={isRtl ? 'start' : 'end'}
              fontWeight="bold"
            >
              {data?.price} â‚ª
            </Typography>

            {/* Buttons */}
            <Stack direction={isRtl ? 'row-reverse' : 'row'} spacing={1} mt={1}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteClick(data?._id)}
                startIcon={!isRtl ? <MdDelete style={{ marginRight: -8 }} /> : null}
                endIcon={isRtl ? <MdDelete style={{ marginRight: 8 }} /> : null}
              >
                {t('delete')}
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => handleOpenUpdateModal(data)}
                startIcon={!isRtl ? <MdEdit style={{ marginRight: -3 }} /> : null}
                endIcon={isRtl ? <MdEdit style={{ marginRight: 8 }} /> : null}
              >
                {t('edit')}
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#c69c6d', color: '#fff' }}
                startIcon={
                  !isRtl ? <MdVisibility style={{ marginRight: -6 }} /> : null
                }
                endIcon={isRtl ? <MdVisibility style={{ marginRight: 8 }} /> : null}
                onClick={() =>
                  window.open(
                    `/cars/${data?.slug}`,
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              >
                {t('view')}
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={data?.media?.[0]?.url}
            alt="Mercedes-Benz GLA"
            sx={{ width: '100%', borderRadius: 2, minHeight: '150px' }}
          />
        </Grid>
      </Grid>
    </Card>
  );
}

