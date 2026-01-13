import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  CircularProgress,
  Avatar,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getDealers } from '@/lib/api/users';
import useAuth from '@/lib/hooks/useAuth';
import { Dealer } from '@/types';
import { toast } from 'react-toastify';

interface SoldModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: SoldData, vehicleId?: string) => void;
  vehicleId: string;
  sellerId: string;
  isLoading?: boolean;
}

export interface SoldData {
  amount: number;
  sellerId: string;
  dealerID: string;
  name: string;
  email: string;
  contact: string;
  country: string;
}

const SoldModal: React.FC<SoldModalProps> = ({
  open,
  onClose,
  onConfirm,
  vehicleId,
  sellerId,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [buyerType, setBuyerType] = useState<'internal' | 'external'>('internal');
  const [selectedDealer, setSelectedDealer] = useState<string>('');
  const [formData, setFormData] = useState<SoldData>({
    amount: 0,
    sellerId,
    dealerID: '',
    name: '',
    email: '',
    contact: '',
    country: '',
  });

  // Fetch dealers for internal buyer
  const { data: dealersData, isLoading: dealersLoading } = useQuery({
    queryKey: ['get-dealers-for-sold', 1, 100, ''],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getDealers(1, 100, '', user);
    },
    enabled: open && buyerType === 'internal',
  });

  const dealers: Dealer[] = dealersData?.data?.data || [];

  // Reset form when modal closes and update sellerId when it changes
  useEffect(() => {
    if (!open) {
      setBuyerType('internal');
      setSelectedDealer('');
      setFormData({
        amount: 0,
        sellerId,
        dealerID: '',
        name: '',
        email: '',
        contact: '',
        country: '',
      });
    } else {
      // Update sellerId when modal opens
      setFormData((prev) => ({
        ...prev,
        sellerId,
      }));
    }
  }, [open, sellerId]);

  // Update form when dealer is selected (internal buyer)
  useEffect(() => {
    if (buyerType === 'internal' && selectedDealer) {
      const dealer = dealers.find((d) => d._id === selectedDealer);
      if (dealer) {
        setFormData((prev) => ({
          ...prev,
          dealerID: dealer._id,
          name: dealer.fullName || '',
          email: dealer.email || '',
          contact: dealer.phone || '',
          country: dealer.address?.country || '',
          // Preserve sellerId
          sellerId: prev.sellerId || sellerId,
        }));
      }
    } else if (buyerType === 'external') {
      // Clear all fields when switching to external buyer, but keep sellerId
      setFormData((prev) => ({
        ...prev,
        dealerID: '',
        name: '',
        email: '',
        contact: '',
        country: '',
        sellerId: prev.sellerId || sellerId,
      }));
      setSelectedDealer('');
    }
  }, [selectedDealer, buyerType, dealers, sellerId]);

  // Clear fields when buyer type changes
  const handleBuyerTypeChange = (newType: 'internal' | 'external') => {
    setBuyerType(newType);
    if (newType === 'external') {
      setSelectedDealer('');
      setFormData((prev) => ({
        ...prev,
        dealerID: '',
        name: '',
        email: '',
        contact: '',
        country: '',
      }));
    }
  };

  const handleInputChange = (field: keyof SoldData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
  //  console.log('handleSubmit called', { formData, buyerType, selectedDealer });
    
    // Validation
    if (!formData.amount || formData.amount <= 0) {
      toast.error(t('amountRequired') || 'Amount is required and must be greater than 0');
      return;
    }
    if (!formData.name || !formData.email || !formData.contact) {
      toast.error(t('requiredFields') || 'Please fill all required fields');
      return;
    }
    if (buyerType === 'internal' && !formData.dealerID) {
      toast.error(t('dealerRequired') || 'Please select a dealer');
      return;
    }

    // Ensure sellerId is set
    const submitData = {
      ...formData,
      sellerId: formData.sellerId || sellerId,
    };

  //  console.log('Calling onConfirm with data:', submitData);
    // Call the API - pass vehicleId as second parameter for safety
    onConfirm(submitData, vehicleId);
  };

  const isFormValid = () => {
    const valid = 
      formData.amount > 0 &&
      !!formData.name &&
      !!formData.email &&
      !!formData.contact &&
      (buyerType === 'external' || (buyerType === 'internal' && !!formData.dealerID));
    
  //  console.log('isFormValid check:', {
  //    valid,
  //    amount: formData.amount,
  //    name: formData.name,
  //    email: formData.email,
  //    contact: formData.contact,
  //    dealerID: formData.dealerID,
  //    buyerType,
  //  });
    
    return valid;
  };

  const selectedDealerData = dealers.find((d) => d._id === selectedDealer);

  return (
    <Dialog 
      open={open} 
      onClose={isLoading ? undefined : onClose} 
      maxWidth="md" 
      fullWidth
      disableEscapeKeyDown={isLoading}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('markAsSold') || 'Mark as Sold'}
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
      <DialogContent dividers>
        <Box sx={{ mt: 2 }}>
          {/* Buyer Type Selection */}
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('buyerType') || 'Buyer Type'}
            </Typography>
            <RadioGroup
              row
              value={buyerType}
              onChange={(e) => handleBuyerTypeChange(e.target.value as 'internal' | 'external')}
            >
              <FormControlLabel
                value="internal"
                control={<Radio />}
                label={t('internalBuyer') || 'Internal Buyer'}
              />
              <FormControlLabel
                value="external"
                control={<Radio />}
                label={t('externalBuyer') || 'External Buyer'}
              />
            </RadioGroup>
          </FormControl>

          <Grid container spacing={2}>
            {/* Dealer Selection for Internal Buyer */}
            {buyerType === 'internal' && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>{t('selectDealer') || 'Select Dealer'}</InputLabel>
                  <Select
                    value={selectedDealer}
                    onChange={(e: SelectChangeEvent<string>) => setSelectedDealer(e.target.value)}
                    label={t('selectDealer') || 'Select Dealer'}
                    disabled={dealersLoading}
                    renderValue={(value) => {
                      const dealer = dealers.find((d) => d._id === value);
                      if (!dealer) return '';
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={dealer.profileImage || dealer.logo}
                            alt={dealer.fullName || dealer.companyName}
                            sx={{ width: 32, height: 32 }}
                          >
                            {(dealer.fullName || dealer.companyName || 'D').charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>
                              {dealer.fullName || dealer.companyName || ''}
                            </Typography>
                            {dealer.companyName && dealer.fullName && (
                              <Typography variant="caption" color="text.secondary">
                                {dealer.companyName}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.secondary" display="block">
                              {dealer.email}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }}
                  >
                    {dealersLoading ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        {t('loading') || 'Loading...'}
                      </MenuItem>
                    ) : dealers.length === 0 ? (
                      <MenuItem disabled>
                        {t('noDealersAvailable') || 'No dealers available'}
                      </MenuItem>
                    ) : (
                      dealers.map((dealer) => (
                        <MenuItem key={dealer._id} value={dealer._id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', py: 0.5 }}>
                            <Avatar
                              src={dealer.profileImage || dealer.logo}
                              alt={dealer.fullName || dealer.companyName}
                              sx={{ width: 40, height: 40 }}
                            >
                              {(dealer.fullName || dealer.companyName || 'D').charAt(0).toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body2" fontWeight={500} noWrap>
                                {dealer.fullName || dealer.companyName || 'N/A'}
                              </Typography>
                              {dealer.companyName && dealer.fullName && (
                                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                  {dealer.companyName}
                                </Typography>
                              )}
                              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                                {dealer.email}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Amount Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('amount') || 'Amount'}
                type="number"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                required
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>

            {/* Name Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('name') || 'Name'}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={buyerType === 'internal' && !!selectedDealer}
                placeholder={buyerType === 'internal' ? t('autoFilled') || 'Auto-filled' : ''}
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('email') || 'Email'}
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={buyerType === 'internal' && !!selectedDealer}
                placeholder={buyerType === 'internal' ? t('autoFilled') || 'Auto-filled' : ''}
              />
            </Grid>

            {/* Contact Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('contact') || 'Contact'}
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                required
                disabled={buyerType === 'internal' && !!selectedDealer}
                placeholder={buyerType === 'internal' ? t('autoFilled') || 'Auto-filled' : ''}
              />
            </Grid>

            {/* Country Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('country') || 'Country'}
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={buyerType === 'internal' && !!selectedDealer}
                placeholder={buyerType === 'internal' ? t('autoFilled') || 'Auto-filled' : ''}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          color="secondary"
          disabled={isLoading}
        >
          {t('cancel') || 'Cancel'}
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Update button clicked');
            handleSubmit();
          }}
          variant="contained"
          color="primary"
          disabled={!isFormValid() || isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          type="button"
        >
          {isLoading ? (t('updating') || 'Updating...') : (t('update') || 'Update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SoldModal;

