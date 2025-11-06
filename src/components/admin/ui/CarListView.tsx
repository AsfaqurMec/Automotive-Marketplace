import { Paper, Typography, Box, Stack, Chip, Avatar, Button } from '@mui/material';
import { MdDelete, MdEdit, MdVisibility } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { Vehicle } from '@/types';

interface CarListViewProps {
  data: Vehicle;
  selectedCarId?: string;
  handleSelectCar: (id: string) => void;
  handleDeleteClick: (id: string) => void;
  handleOpenUpdateModal: (id: string) => void;
}

export default function CarListViewComponent({
  data,
  selectedCarId,
  handleSelectCar,
  handleDeleteClick,
  handleOpenUpdateModal,
}: CarListViewProps) {
  const { t } = useTranslation();
  const isRtl =
        i18n.language === 'he' || (typeof document !== 'undefined' && document.dir === 'rtl');
  return (
    <Paper
      elevation={selectedCarId === data?._id ? 5 : 1}
      onClick={() => handleSelectCar(data?._id)}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        border: selectedCarId === data?._id ? '2px solid #1976d2' : '1px solid #e0e0e0',
        backgroundColor: selectedCarId === data?._id ? '#f0f8ff' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          variant="rounded"
          src={data?.media?.[0]?.url}
          alt={data?.title}
          sx={{ width: 64, height: 64 }}
        />

        <Box flexGrow={1}>
          <Typography sx={{ fontWeight: 600 }}>{data?.title}</Typography>
          <Stack direction="row" spacing={1} mt={0.5}>
            {data?.brand && (
              <Chip
                label={data.brand}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  fontWeight: 500,
                }}
              />
            )}
            {data?.condition && (
              <Chip
                label={t(data.condition.toLowerCase())}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  backgroundColor: '#f3e5f5',
                  color: '#6a1b9a',
                  fontWeight: 500,
                }}
              />
            )}
          </Stack>
          <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
            {data?.status === 'sold' && (
              <Chip
                label={t('sold')}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  backgroundColor: '#ffe5e5',
                  color: '#b30000',
                  fontWeight: 500,
                }}
              />
            )}
            {data?.status === 'Available' && (
              <Chip
                label={t('available')}
                size="small"
                sx={{
                  fontSize: '0.7rem',
                  backgroundColor: '#e0f7e9',
                  color: '#2e7d32',
                  fontWeight: 500,
                }}
              />
            )}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
            {data?.price} â‚ª
          </Typography>
          <Typography variant="caption" sx={{ color: '#888' }}>
            {data?.productCode}
          </Typography>
        </Box>
      </Stack>

      {/* Action Buttons */}
      <Stack
        direction={isRtl ? 'row-reverse' : 'row'}
        spacing={1}
        mt={1}
        justifyContent="flex-end"
        flexWrap="wrap"
      >
        <Button
          variant="contained"
          color="error"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation(); // prevent parent onClick
            handleDeleteClick(data?._id);
          }}
          startIcon={!isRtl ? <MdDelete /> : null}
          endIcon={isRtl ? <MdDelete style={{ marginRight: 8 }} /> : null}
        >
          {t('delete')}
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            e.stopPropagation(); // prevent parent onClick
            handleOpenUpdateModal(data._id);
          }}
          startIcon={!isRtl ? <MdEdit /> : null}
          endIcon={isRtl ? <MdEdit style={{ marginRight: 8 }} /> : null}
        >
          {t('edit')}
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#c69c6d', color: '#fff' }}
          startIcon={!isRtl ? <MdVisibility /> : null}
          endIcon={isRtl ? <MdVisibility style={{ marginRight: 8 }} /> : null}
          onClick={() =>
            window.open(`/cars/${data?.slug}`, '_blank', 'noopener,noreferrer')
          }
        >
          {t('view')}
        </Button>
      </Stack>
    </Paper>
  );
}

