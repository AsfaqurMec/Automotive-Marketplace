import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';

interface DealerAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface DealerData {
  companyName?: string;
  fullName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  licenseExpiry?: string;
  isVerified?: boolean;
  address?: DealerAddress;
  [key: string]: unknown;
}

interface UpdateDealerModalProps {
    open: boolean;
    onClose: () => void;
    dealers?: DealerData;
    onSave: (data: DealerData) => void;
}

const UpdateDealerModal: React.FC<UpdateDealerModalProps> = ({ open, onClose, dealers = {}, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    fullName: '',
    contactPerson: '',
    email: '',
    phone: '',
    licenseExpiry: '',
    isVerified: false,
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const dealerData = useMemo(() => ({
    companyName: dealers.companyName || '',
    fullName: dealers.fullName || '',
    contactPerson: dealers.contactPerson || '',
    email: dealers.email || '',
    phone: dealers.phone || '',
    licenseExpiry: dealers.licenseExpiry
      ? dayjs(dealers.licenseExpiry).format('YYYY-MM-DD')
      : '',
    isVerified: dealers.isVerified || false,
    address: {
      street: dealers?.address?.street || '',
      city: dealers?.address?.city || '',
      state: dealers?.address?.state || '',
      zipCode: dealers?.address?.zipCode || '',
      country: dealers?.address?.country || '',
    },
  }), [dealers]);

  useEffect(() => {
    if (dealers) {
      setFormData(dealerData);
    }
  }, [dealers, dealerData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleSubmit = () => {
    onSave({ ...dealers, ...formData });
    setFormData(dealerData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update dealers</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="License Expiry"
              name="licenseExpiry"
              value={formData.licenseExpiry}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {/* Address Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="City"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Zip Code"
              name="address.zipCode"
              value={formData.address.zipCode}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Country"
              name="address.country"
              value={formData.address.country}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isVerified}
                  onChange={handleSwitchChange}
                  name="isVerified"
                />
              }
              label="Verified"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
                    Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
                    Update dealers
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDealerModal;
