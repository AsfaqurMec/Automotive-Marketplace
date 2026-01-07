import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { DealerRequest } from '@/lib/api/dealerRequest';
import { useTranslation } from 'react-i18next';

interface UpdateStatusModalProps {
  open: boolean;
  onClose: () => void;
  request: DealerRequest | null;
  onSave: (status: 'pending' | 'approved' | 'rejected') => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  open,
  onClose,
  request,
  onSave,
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (request) {
      setStatus(request.status);
    }
  }, [request]);

  const handleSave = () => {
    onSave(status);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('updateRequestStatus') || 'Update Request Status'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mt: 1 }}>
          {request && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('requestFor') || 'Request for'}: <strong>{request.data?.fullName}</strong>
            </Typography>
          )}
          <TextField
            select
            fullWidth
            label={t('status') || 'Status'}
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as 'pending' | 'approved' | 'rejected')
            }
            margin="normal"
          >
            <MenuItem value="pending">{t('pending') || 'Pending'}</MenuItem>
            <MenuItem value="approved">{t('approved') || 'Approved'}</MenuItem>
            <MenuItem value="rejected">{t('rejected') || 'Rejected'}</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t('cancel') || 'Cancel'}
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {t('update') || 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusModal;





