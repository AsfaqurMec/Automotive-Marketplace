import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface StatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  onStatusSelect: (status: string) => void;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  open,
  onClose,
  onStatusSelect,
}) => {
  const { t } = useTranslation();
  const statusOptions = [
    { value: 'Pending', color: '#ff9800' },
    { value: 'Sold', color: '#4caf50' },
    { value: 'Available', color: '#2196f3' },
    { value: 'Discontinued', color: '#f44336' },
  ];

  const handleStatusClick = (status: string) => {
    onStatusSelect(status);
    // Don't close if Sold is selected - let the parent handle it
    if (status !== 'Sold') {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('changeStatus') || 'Change Status'}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 3, pb: 3 }}>
        <Grid container spacing={2}>
          {statusOptions.map((status) => (
            <Grid item xs={6} key={status.value}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleStatusClick(status.value)}
                sx={{
                  py: 2,
                  px: 2,
                  borderColor: status.color,
                  color: status.color,
                  borderWidth: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: status.color,
                    backgroundColor: `${status.color}10`,
                    borderWidth: 2,
                  },
                }}
              >
                {status.value}
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined">
          {t('cancel') || 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusChangeModal;

