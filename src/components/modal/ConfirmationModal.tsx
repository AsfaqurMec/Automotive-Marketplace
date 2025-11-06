import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  itemName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this {itemName}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
                    Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
                    Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;

