import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Tooltip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorefrontIcon from '@mui/icons-material/Storefront';
import colors from '@/components/styles';

const AutoShopAdminView = ({
  image,
  title = 'One Stop Auto Zone',
  marketPlace = false,
  status = 'Pending',
  updatedAt = '2025-05-01',
  onEdit,
  onDelete,
  data,
}: {
    image: string;
    title: string;
    marketPlace: boolean;
    status: string;
    updatedAt: string;
    onEdit: (data: { _id: string; title: string; status: string; marketPlace: boolean; image: string; updatedAt: string }) => void;
    onDelete: (id: string) => void;
    data: { _id: string; title: string; status: string; marketPlace: boolean; image: string; updatedAt: string };
}) => {
  const {
    white,
    primary,
  } = colors;

  const titleStyle = {
    fontFamily: 'Rubik',
    fontSize: '22px',
    fontWeight: 600,
    color: colors.textBlack,
    mb: 1,
  };

  return (
    <Card
      sx={{
        maxWidth: 460,
        borderRadius: 3,
        boxShadow: 4,
        bgcolor: white,
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={image ? image : 'https://via.placeholder.com/400x200?text=Auto+Shop'}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ px: 2, py: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography sx={titleStyle}>{title}</Typography>
          {marketPlace && (
            <Tooltip title="Listed on Marketplace">
              <Chip
                label="Marketplace"
                icon={<StorefrontIcon />}
                size="small"
                sx={{ bgcolor: primary, color: white, fontWeight: 500 }}
              />
            </Tooltip>
          )}
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <LocationOnIcon fontSize="small" sx={{ color: primary }} />
          <Typography variant="body2" color={primary}>
                        123 Main St, City
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <CallIcon fontSize="small" sx={{ color: primary }} />
          <Typography variant="body2" color={primary}>
                        +1 (555) 123-4567
          </Typography>
        </Stack>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip
            label={status}
            color={
              status === 'Approved'
                ? 'success'
                : status === 'Pending'
                  ? 'warning'
                  : 'default'
            }
            icon={<CheckCircleIcon />}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          <Typography variant="caption" color={primary}>
                        Updated: {updatedAt}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            size="small"
            color="primary"
            onClick={() => onEdit(data)}
            sx={{ fontWeight: 500 }}
          >
                        Edit
          </Button>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            size="small"
            color="error"
            onClick={() => onDelete(data?._id)}
            sx={{ fontWeight: 500 }}
          >
                        Delete
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AutoShopAdminView;

