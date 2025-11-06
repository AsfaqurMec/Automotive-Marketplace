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
        phone: formData.phone || undefined,
        companyName: formData.companyName || undefined,
        contactPerson: formData.contactPerson || undefined,
        address: {
          street: formData.address.street || undefined,
          city: formData.address.city || undefined,
          state: formData.address.state || undefined,
          zipCode: formData.address.zipCode || undefined,
          country: formData.address.country || undefined,
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
    <Box sx={{ bgcolor: '#fdfdfd', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: 'white',
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h3" fontWeight="bold">
              {t('profileEdit')}
            </Typography>
          </Box>

          {/* Buttons and Avatar */}
          <Grid
            container
            spacing={3}
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Grid item xs={12} md="auto">
              <Box display="flex" gap={2}>
                {/* UPDATED: open image dialog */}
                <Button
                  variant="contained"
                  sx={{ bgcolor: 'black', '&:hover': { bgcolor: '#333' } }}
                  onClick={handleOpenImageDialog}
                >
                  {t('changePicture')}
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md="auto">
              <Box textAlign="center">
                {/* UPDATED: Avatar shows previewUrl */}
                <Avatar
                  src={previewUrl}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                />
                <Typography variant="body2" fontWeight="medium">
                  {t('profilePicture')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('profileImageSize')}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('profileName')}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('profileEmail')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Dealer-specific fields */}
            {isDealer && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('companyName') || 'Company Name'}
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('contactPerson') || 'Contact Person'}
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('phone') || 'Phone'}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('street') || 'Street'}
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('city') || 'City'}
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('state') || 'State'}
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label={t('zipCode') || 'Zip Code'}
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label={t('country') || 'Country'}
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {/* Buttons */}
          <Box mt={2} display="flex" flexDirection={'column-reverse'} gap={2}>
            {/* UPDATED: Added onClick for save */}
            <Button
              variant="contained"
              sx={{
                bgcolor: '#c8a45e',
                '&:hover': { bgcolor: '#b89049' },
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
              onClick={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? t('saving') : t('saveChanges')}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsPasswordDialogOpen(true)}
              sx={{ px: 3, py: 1 }}
              style={{
                maxWidth: '200px',
                fontSize: 16,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              {t('changePassword')}
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Password Change Dialog */}
      <Dialog
        open={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {/* ...existing password fields (unchanged) */}
          <TextField
            fullWidth
            label={t('currentPassword')}
            name="currentPassword"
            type={showPasswordFields.current ? 'text' : 'password'}
            value={passwordFields.currentPassword}
            onChange={handlePasswordChange}
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
            sx={{ my: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswordFields((prev) => ({
                        ...prev,
                        current: !prev.current,
                      }))
                    }
                  >
                    {showPasswordFields.current ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
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
            sx={{ my: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswordFields((prev) => ({
                        ...prev,
                        new: !prev.new,
                      }))
                    }
                  >
                    {showPasswordFields.new ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
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
            sx={{ my: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPasswordFields((prev) => ({
                        ...prev,
                        confirm: !prev.confirm,
                      }))
                    }
                  >
                    {showPasswordFields.confirm ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsPasswordDialogOpen(false)}>
            {t('cancelSubmission')}
          </Button>
          <Button variant="contained" onClick={handlePasswordSubmit}>
            {t('savePassword')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- NEW: Image Upload Dialog --- */}
      <Dialog open={isImageDialogOpen} onClose={handleCloseImageDialog} fullWidth>
        <DialogTitle textAlign={'center'}>{t('updateProfileImage')}</DialogTitle>
        <DialogContent>
          <Box textAlign="center" my={2}>
            {previewUrl ? (
              <Avatar src={previewUrl} sx={{ width: 100, height: 100, mx: 'auto' }} />
            ) : (
              <Typography variant="body2">No Image Selected</Typography>
            )}
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              sx={{ mt: 2 }}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>{t('cancelSubmission')}</Button>
          <Button variant="contained" onClick={handleCloseImageDialog}>
            {t('done')}
          </Button>
        </DialogActions>
      </Dialog>

      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" mt={5}>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          style={{ marginLeft: 5, marginRight: 5 }}
        >
          {t('shareProfile')}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleCopyLink}
          startIcon={<ContentCopyIcon style={{ marginLeft: 7, marginRight: 2 }} />}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </Button>
      </Stack>

      {/* --- User Vehicles Section --- */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h3" fontWeight="bold" mb={3} textAlign={'center'}>
          {t('yourVehicles')}
        </Typography>

        {filteredVehicles?.length === 0 ? (
          <Typography>{t('notCreated')}</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredVehicles?.map((vehicle: Vehicle) => (
              <Grid key={vehicle._id} item xs={12} sm={6} md={4} lg={6}>
                <Box
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#c8a45e',
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      textTransform: 'none',
                      color: '#ffff',
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {vehicle.public ? 'Public' : 'Private'}
                  </Button>
                  {/* Image */}
                  <Box
                    component="img"
                    src={vehicle.media?.[0]?.url || '/no-image.jpg'}
                    alt={vehicle.title}
                    sx={{
                      width: '100%',
                      height: 300,
                      objectFit: 'cover',
                    }}
                  />

                  <IconButton
                    onClick={(e: React.MouseEvent<HTMLElement>) => handleMenuOpen(e, vehicle)}
                    disableRipple
                    sx={{
                      display: 'flex',
                      justifyContent: 'right',
                      justifyItems: 'right',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                      '&:focus': {
                        backgroundColor: 'transparent',
                      },
                      '&:active': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <Box sx={{ flexGrow: 0, justifyContent: 'end' }}>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
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
                          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.06)',
                        },
                      }}
                    >
                      <MenuItem
                      sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (selectedVehicle) {
                            updatePublicStatus({
                              id: selectedVehicle._id,
                              isPublic: !selectedVehicle.public,
                            });
                          }
                          handleMenuClose();
                        }}
                      >
                                                Make{' '}
                        {selectedVehicle?.public ? 'Private' : 'Public'}
                      </MenuItem>
                      <MenuItem>
                        <Link href={`/cars/${vehicle._id}`} passHref style={{ textDecoration: 'none', color: 'black' }}>
                              
                              More Details
                              
                            </Link>
                      </MenuItem>
                    </Menu>
                  </Box>

                  {/* Details */}
                  <Box p={2} flexGrow={1}>
                    {/* Title & Basic Info */}
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      gutterBottom
                      noWrap
                    >
                      {vehicle.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {vehicle.brand} • {vehicle.model} • {vehicle.year}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {vehicle.location?.city}, {vehicle.location?.country}
                    </Typography>

                    {/* Price */}
                    <Typography
                      variant="h4"
                      color="primary"
                      fontWeight="bold"
                      mt={1}
                    >
                                            Price : ${vehicle.price}
                    </Typography>

                    <Typography variant="h4" fontWeight="bold" mt={3}>
                                            Other Details
                    </Typography>

                    {/* More Info: 2 columns */}
                    <Grid container spacing={1} mt={0}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" color="text.secondary">
                                                    Fuel: {vehicle.fuelType}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                                                    Trans: {vehicle.transmission}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                                                    Mileage: {vehicle.mileage} km
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" color="text.secondary">
                                                    Condition: {vehicle.condition}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                                                    Status: {vehicle.status}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                                                    Type: {vehicle.type}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
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

