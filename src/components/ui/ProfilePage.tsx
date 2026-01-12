'use client';

import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState, useRef, useEffect } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useAuth from '@/lib/hooks/useAuth';
import { changePassword, updateUser } from '@/lib/api/auth';
import { updateDealer } from '@/lib/api/users';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vehicaleApi } from '@/lib/api/vehicale';
import MoreVertIcon from '@mui/icons-material/MoreVert';
// Removed unused imports
import { clearNavbarUserData } from '../layouts/Navbar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Price from './Price';

// Define types for better type safety
interface Vehicle {
    _id: string;
    title: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    fuelType: string;
    transmission: string;
    mileage: number;
    condition: string;
    status: string;
    type: string;
    public: boolean;
    postedBy: string;
    media?: Array<{ url: string }>;
    location?: {
        city: string;
        country: string;
    };
}

interface User {
    _id: string;
    fullName?: string;
    email?: string;
    profileImage?: string;
}

const ProfilePage: React.FC = () => {
  const { user, isLoading, logout, setIsLoading } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  // EXISTING STATES...
  // Removed unused state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('/avatar.png');
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '',
    phone: '',
    companyName: '',
    contactPerson: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  // Check if user is a dealer
  const isDealer = user?.role?.roleId === 'dealer' || user?.companyName || user?.contactPerson;

  //  Fix: sync form with user after fetch
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        contactPerson: user.contactPerson || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || '',
        },
      });
      setPreviewUrl(user.profileImage || '/avatar.png');
    }
  }, [user]);

  //  Fix: only fetch vehicles after user is available
  const { data } = useQuery({
    queryKey: ['get-vehicale'],
    queryFn: () => vehicaleApi.getAllVehicale(user as User),
    enabled: !!user?._id,
  });

  const filteredVehicles = data?.data?.filter((item: Vehicle) => item?.postedBy === user?._id) || [];

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordFields, setShowPasswordFields] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ----- NEW STATE FOR IMAGE UPLOAD -----
  // fallback to your default avatar path
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- EXISTING HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
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
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPasswordFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordSubmit = async () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!passwordFields.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordFields.newPassword) {
      errors.newPassword = 'New password is required';
    }
    if (!passwordFields.confirmPassword) {
      errors.confirmPassword = 'Confirm password is required';
    } else if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.values(errors).some((err) => err !== '')) {
      setPasswordErrors(errors);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordFields.currentPassword,
        newPassword: passwordFields.newPassword,
      });

      router.push('/signin');

      await logout();

      clearNavbarUserData();

      toast.success('Password changed successfully!');

      setPasswordFields({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsPasswordDialogOpen(false);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to change password';
      toast.error(message);
    }
  };

  // ----- NEW HANDLERS FOR IMAGE UPLOAD -----
  const handleOpenImageDialog = () => {
    setIsImageDialogOpen(true);
  };

  const handleCancel = () => {
    setIsImageDialogOpen(false);
    setPreviewUrl(user?.profileImage || '/avatar.png');
  };

  const handleCloseImageDialog = () => {
    setIsImageDialogOpen(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveChanges = async () => {
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    // Build dealer JSON payload (same approach as UpdateDealerModal)
    const dealerUpdatePayload = isDealer
      ? {
        _id: user?._id,
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        companyName: formData.companyName || '',
        contactPerson: formData.contactPerson || '',
        address: {
          street: formData.address.street || '',
          city: formData.address.city || '',
          state: formData.address.state || '',
          zipCode: formData.address.zipCode || '',
          country: formData.address.country || '',
        },
      }
      : null;

    // Prepare image payload separately (multipart)
    const imagePayload = new FormData();
    if (profileImage) {
      imagePayload.append('profileImage', profileImage);
    }

    try {
      setIsLoading(true);

      // 1) Update dealer details via users API (JSON), like UpdateDealerModal
      if (dealerUpdatePayload) {
        await updateDealer({ data: dealerUpdatePayload as unknown as Record<string, unknown>, user: user! });
      }

      // 2) Update profile image via auth API (multipart) if selected
      if (profileImage) {
        
        await updateUser(imagePayload);
      }

      toast.success('Profile updated successfully!');
    } catch (error: unknown) {
      setPreviewUrl(user?.profileImage || '/avatar.png');
      const errMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update profile.';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, vehicle: Vehicle) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle); // capture the clicked vehicle
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const { mutate: updatePublicStatus } = useMutation({
    mutationFn: (data: { id: string; isPublic: boolean }) => vehicaleApi.updateVehiclePublic(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['get-vehicale'] });
      toast.success('Visibility updated');
    },
    onError: () => {
      toast.error('Failed to update visibility');
    },
  });

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!user?._id) {
      toast.error('User ID not available');
      return;
    }
    const link = `${window.location.origin}/user/${user._id}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error('Failed to copy');
      });
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: { xs: 3, md: 4 } }}>
      <Container maxWidth="md">
        {/* Main Profile Card */}
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            overflow: 'hidden',
          }}
        >
          {/* Profile Picture Section - Centered at Top */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: 4,
              pb: 3,
              px: 3,
            }}
          >
            <Avatar
              src={previewUrl}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: '3px solid #f0f0f0',
              }}
            />
            <Button
              variant="contained"
              onClick={handleOpenImageDialog}
              sx={{
                bgcolor: '#c8a45e',
                color: 'white',
                textTransform: 'none',
                px: 3,
                py: 1,
                borderRadius: 1,
                mb: 1,
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#b89049',
                },
              }}
            >
              {t('changePicture')}
            </Button>
            <Typography
              variant="caption"
              sx={{
                color: '#6c757d',
                fontSize: '0.75rem',
                mt: 0.5,
              }}
            >
              {t('profileImageSize')}
            </Typography>
          </Box>

          <Divider />

          {/* Form Content */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* Personal Information Section */}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: '#212529',
                mb: 3,
                fontSize: '1rem',
              }}
            >
              Personal Information
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('profileName')}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('profileEmail')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputProps={{ readOnly: true }}
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      bgcolor: '#f8f9fa',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Dealer-specific fields */}
            {isDealer && (
              <>
                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#212529',
                    mb: 3,
                    fontSize: '1rem',
                  }}
                >
                  Company Information
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('companyName') || 'Company Name'}
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('contactPerson') || 'Contact Person'}
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('phone') || 'Phone'}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: '#212529',
                    mb: 3,
                    fontSize: '1rem',
                  }}
                >
                  Address Information
                </Typography>

                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('street') || 'Street'}
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('city') || 'City'}
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('state') || 'State'}
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('zipCode') || 'Zip Code'}
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('country') || 'Country'}
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 4,
                pt: 3,
                borderTop: '1px solid #e9ecef',
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setIsPasswordDialogOpen(true)}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                  borderColor: '#c8a45e',
                  color: '#c8a45e',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#b89049',
                    bgcolor: 'rgba(200, 164, 94, 0.08)',
                  },
                }}
              >
                {t('changePassword')}
              </Button>

              <Button
                variant="contained"
                onClick={handleSaveChanges}
                disabled={isLoading}
                sx={{
                  bgcolor: '#c8a45e',
                  color: 'white',
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: '#b89049',
                  },
                  '&:disabled': {
                    bgcolor: '#c8a45e',
                    opacity: 0.6,
                  },
                }}
              >
                {isLoading ? t('saving') : t('saveChanges')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Password Change Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1.5,
            fontWeight: 600,
            fontSize: '1.125rem',
            color: '#212529',
            pt: 3,
          }}
        >
          Change Password
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{ color: '#6c757d', mb: 3, fontSize: '0.875rem' }}
          >
            Enter your current password and choose a new one
          </Typography>
          <TextField
            fullWidth
            label={t('currentPassword')}
            name="currentPassword"
            type={showPasswordFields.current ? 'text' : 'password'}
            value={passwordFields.currentPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              sx: { fontSize: '0.875rem' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswordFields((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                    edge="end"
                    size="small"
                  >
                    {showPasswordFields.current ? (
                      <VisibilityOff sx={{ fontSize: '1.125rem' }} />
                    ) : (
                      <Visibility sx={{ fontSize: '1.125rem' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t('newPassword')}
            name="newPassword"
            type={showPasswordFields.new ? 'text' : 'password'}
            value={passwordFields.newPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword}
            size="small"
            sx={{ mb: 2 }}
            InputProps={{
              sx: { fontSize: '0.875rem' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswordFields((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                    edge="end"
                    size="small"
                  >
                    {showPasswordFields.new ? (
                      <VisibilityOff sx={{ fontSize: '1.125rem' }} />
                    ) : (
                      <Visibility sx={{ fontSize: '1.125rem' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label={t('confirmNewPassword')}
            name="confirmPassword"
            type={showPasswordFields.confirm ? 'text' : 'password'}
            value={passwordFields.confirmPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.confirmPassword}
            helperText={passwordErrors.confirmPassword}
            size="small"
            sx={{ mb: 1 }}
            InputProps={{
              sx: { fontSize: '0.875rem' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswordFields((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                    edge="end"
                    size="small"
                  >
                    {showPasswordFields.confirm ? (
                      <VisibilityOff sx={{ fontSize: '1.125rem' }} />
                    ) : (
                      <Visibility sx={{ fontSize: '1.125rem' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={() => setIsPasswordDialogOpen(false)}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              color: '#6c757d',
            }}
          >
            {t('cancelSubmission')}
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordSubmit}
            sx={{
              bgcolor: '#c8a45e',
              color: 'white',
              '&:hover': { bgcolor: '#b89049' },
              textTransform: 'none',
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {t('savePassword')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog
        open={isImageDialogOpen}
        onClose={handleCloseImageDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 1.5,
            fontWeight: 600,
            fontSize: '1.125rem',
            color: '#212529',
            textAlign: 'center',
            pt: 3,
          }}
        >
          {t('updateProfileImage')}
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" my={3}>
            <Avatar
              src={previewUrl}
              sx={{
                width: 140,
                height: 140,
                mx: 'auto',
                mb: 3,
                border: '3px solid #f0f0f0',
              }}
            />
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                px: 3,
                py: 1,
                borderColor: '#c8a45e',
                color: '#c8a45e',
                fontSize: '0.875rem',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#b89049',
                  bgcolor: 'rgba(200, 164, 94, 0.08)',
                },
              }}
            >
              Select Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageSelect}
            />
            <Typography
              variant="caption"
              sx={{ color: '#6c757d', display: 'block', mt: 2, fontSize: '0.75rem' }}
            >
              {t('profileImageSize')}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCancel}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              color: '#6c757d',
            }}
          >
            {t('cancelSubmission')}
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseImageDialog}
            sx={{
              bgcolor: '#c8a45e',
              color: 'white',
              '&:hover': { bgcolor: '#b89049' },
              textTransform: 'none',
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {t('done')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Profile Section */}
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#212529',
              mb: 2,
              fontSize: '0.9375rem',
            }}
          >
            {t('shareProfile')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleCopyLink}
            startIcon={<ContentCopyIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              bgcolor: '#c8a45e',
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              borderRadius: 1,
              fontSize: '0.875rem',
              fontWeight: 500,
              '&:hover': {
                bgcolor: '#b89049',
              },
            }}
          >
            {copied ? 'Copied!' : 'Copy Profile Link'}
          </Button>
        </Box>
      </Container>

      {/* User Vehicles Section */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box mb={3}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#212529',
              mb: 0.5,
              fontSize: '1.125rem',
            }}
          >
            {t('yourVehicles')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '0.875rem' }}>
            Manage your vehicle listings
          </Typography>
        </Box>

        {filteredVehicles?.length === 0 ? (
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
              p: 6,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: '#6c757d' }}>
              {t('notCreated')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filteredVehicles?.map((vehicle: Vehicle) => (
              <Grid key={vehicle._id} item xs={12} sm={6} md={4}>
                <Box
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  {/* Status Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 2,
                      bgcolor: vehicle.public ? '#28a745' : '#6c757d',
                      color: 'white',
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {vehicle.public ? 'Public' : 'Private'}
                  </Box>

                  {/* Menu Button */}
                  <IconButton
                    onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuOpen(e, vehicle)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      zIndex: 2,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: '1.25rem' }} />
                  </IconButton>

                  {/* Vehicle Image */}
                  <Box
                    component="img"
                    src={vehicle.media?.[0]?.url || '/no-image.jpg'}
                    alt={vehicle.title}
                    sx={{
                      width: '100%',
                      height: 200,
                      objectFit: 'cover',
                    }}
                  />

                  {/* Vehicle Details */}
                  <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: '#212529',
                        mb: 0.5,
                        fontSize: '0.9375rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {vehicle.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6c757d',
                        mb: 1,
                        fontSize: '0.8125rem',
                      }}
                    >
                      {vehicle.brand} • {vehicle.model} • {vehicle.year}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6c757d',
                        mb: 2,
                        fontSize: '0.8125rem',
                      }}
                    >
                      {vehicle.location?.city}, {vehicle.location?.country}
                    </Typography>

                    <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #e9ecef' }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#c8a45e',
                          mb: 2,
                          fontWeight: 600,
                          fontSize: '1.125rem',
                        }}
                      >
                        <Price amountUSD={Number(vehicle.price) || 0} />
                      </Typography>

                      <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: '#6c757d', fontSize: '0.75rem', display: 'block', mb: 0.5 }}
                          >
                            Fuel
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                            {vehicle.fuelType}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: '#6c757d', fontSize: '0.75rem', display: 'block', mb: 0.5 }}
                          >
                            Transmission
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                            {vehicle.transmission}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: '#6c757d', fontSize: '0.75rem', display: 'block', mb: 0.5 }}
                          >
                            Mileage
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                            {vehicle.mileage.toLocaleString()} km
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="caption"
                            sx={{ color: '#6c757d', fontSize: '0.75rem', display: 'block', mb: 0.5 }}
                          >
                            Condition
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8125rem' }}>
                            {vehicle.condition}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>

                  {/* Menu */}
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedVehicle?._id === vehicle._id}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    PaperProps={{
                      sx: {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                        borderRadius: 1,
                        minWidth: 160,
                        mt: 0.5,
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        if (selectedVehicle) {
                          updatePublicStatus({
                            id: selectedVehicle._id,
                            isPublic: !selectedVehicle.public,
                          });
                        }
                        handleMenuClose();
                      }}
                      sx={{
                        py: 1.25,
                        fontSize: '0.875rem',
                      }}
                    >
                      Make {selectedVehicle?.public ? 'Private' : 'Public'}
                    </MenuItem>
                    <MenuItem
                      sx={{
                        py: 1.25,
                        fontSize: '0.875rem',
                      }}
                    >
                      <Link
                        href={`/cars/${vehicle._id}`}
                        passHref
                        style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
                      >
                        View Details
                      </Link>
                    </MenuItem>
                  </Menu>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ProfilePage;

