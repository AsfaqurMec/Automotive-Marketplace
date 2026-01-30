'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { Business, Email, Phone, LocationOn, VerifiedUser, Star, Edit } from '@mui/icons-material';
import { MdChat } from 'react-icons/md';
import { getDealerById } from '@/lib/api/dealer';
import { Dealer } from '@/types';
import Link from 'next/link';
import Price from '@/components/ui/Price';
import useAuth from '@/lib/hooks/useAuth';
import DealerChatModal from '@/components/modal/DealerChatModal';
import { updateDealer } from '@/lib/api/users';
import { updateUser } from '@/lib/api/auth';
import { toast } from 'react-toastify';

interface DealerProfileProps {
  dealerId: string;
}

interface Car {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;  
  fuelType: string;
  transmission: string;
  condition: string;
  media: Array<{ url: string }>;
  priceNegotiable: boolean;
  mileage: number;
  status: string;
}
const DealerProfile = ({ dealerId }: DealerProfileProps) => {
  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  
  // Edit profile form state
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
  
  // Profile image state
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('/avatar.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!dealerId) return;
    setLoading(true);
    getDealerById(dealerId)
      .then((res) => {
        setDealer(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch dealer');
        setLoading(false);
      });
  }, [dealerId]);

  // Sync form data when dealer is loaded or modal opens
  useEffect(() => {
    if (dealer && editModalOpen) {
      setFormData({
        name: dealer.fullName || '',
        email: dealer.email || '',
        phone: dealer.phone || '',
        companyName: dealer.companyName || '',
        contactPerson: dealer.contactPerson || '',
        address: {
          street: dealer.address?.street || '',
          city: dealer.address?.city || '',
          state: dealer.address?.state || '',
          zipCode: dealer.address?.zipCode || '',
          country: dealer.address?.country || '',
        },
      });
      setPreviewUrl(dealer.profileImage || '/avatar.png');
      setProfileImage(null);
    }
  }, [dealer, editModalOpen]);

  const handleOpenMessageDialog = () => {
    setOpenMessageDialog(true);
  };

  const handleCloseMessageDialog = () => {
    setOpenMessageDialog(false);
  };

  const handleSendMessage = () => {
    // Add your message sending logic here

    handleCloseMessageDialog();
  };

  const handleChatWithDealer = () => {
    setChatModalOpen(true);
  };

  const handleCloseChatModal = () => {
    setChatModalOpen(false);
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setProfileImage(null);
    if (dealer) {
      setPreviewUrl(dealer.profileImage || '/avatar.png');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (!dealer || !user) {
      toast.error('Dealer or user information not available');
      return;
    }

    const dealerUpdatePayload = {
      _id: dealer._id,
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
    };

    const imagePayload = new FormData();
    if (profileImage) {
      imagePayload.append('profileImage', profileImage);
    }

    try {
      setIsSaving(true);

      // Update dealer details
      await updateDealer({ data: dealerUpdatePayload as unknown as Record<string, unknown>, user });

      // Update profile image if selected
      if (profileImage) {
        await updateUser(imagePayload);
      }

      // Refresh dealer data
      const res = await getDealerById(dealerId);
      setDealer(res.data);

      toast.success('Profile updated successfully!');
      handleCloseEditModal();
    } catch (error: unknown) {
      const errMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update profile.';
      toast.error(errMsg);
      if (dealer) {
        setPreviewUrl(dealer.profileImage || '/avatar.png');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading dealer profile...</Typography>
      </Box>
    );
  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  if (!dealer) return null;
 // console.log("Dealer cars:", dealer.carsPosted);
  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
      <Card elevation={3}>
        <CardHeader
          avatar={
            <Avatar
              src={dealer.profileImage || ''}
              alt={`${dealer.companyName} Logo`}
              sx={{ width: 80, height: 80 }}
            />
          }
          title={
            <Typography variant="h4" component="div">
              {dealer.fullName} - {dealer.companyName}
            </Typography>
          }
          subheader={`Member since: ${dealer.createdAt ? new Date(dealer.createdAt).toLocaleDateString() : 'N/A'}`}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, mr: 2 }}>
              {dealer.isVerified && (
                <Chip
                  icon={<VerifiedUser />}
                  label="Verified"
                  color="success"
                  variant="outlined"
                />
              )}
              {user && (user._id === dealer._id || user.role?.roleId === 'admin') && (
                <Button
                  disabled={user?.email === 'nextdeal@gmail.com'}
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={handleOpenEditModal}
                  size="small"
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                                About Us
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                                Welcome to {dealer.companyName}, your trusted partner for
                                high-quality pre-owned vehicles. We are committed to providing an
                                exceptional car-buying experience with a focus on customer
                                satisfaction.
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                                Contact Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Email sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">{dealer.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">{dealer.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  {dealer.address &&
                                        `${dealer.address.street}, ${dealer.address.city}, ${dealer.address.state} ${dealer.address.zipCode}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Email />}
                  onClick={handleOpenMessageDialog}
                >
                  Send Email
                </Button>
                {user && (
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<MdChat />}
                    onClick={handleChatWithDealer}
                  >
                    Create Chat
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                                        Dealer Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Star sx={{ color: '#FFD700' }} />
                    <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {dealer.rating?.toFixed(1) || 'N/A'}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                                            ({dealer.numberOfReviews || 0} reviews)
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                                        Business Details
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Business sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                                            License: {dealer.businessLicenseNumber}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                                        Expires:{' '}
                    {dealer.licenseExpiry
                      ? new Date(dealer.licenseExpiry).toLocaleDateString()
                      : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, background: '#fff', borderRadius: 3, boxShadow: 2, p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={700} color="primary.main">
                    Cars by {dealer.companyName}
        </Typography>
        <Grid container spacing={3}>

        {dealer.carsPosted && dealer.carsPosted.length > 0 ? (
  (dealer.carsPosted as unknown as Car[]).map((car: Car) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={car._id}>
      <Card
        sx={{
          height: '100%',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-6px) scale(1.03)',
            boxShadow: 6,
          },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ✅ Car Image */}
        <Box
          sx={{
            position: 'relative',
            pt: '56.25%',
            bgcolor: 'grey.200',
            backgroundImage: car.media?.[0]?.url
              ? `url(${car.media[0].url})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
          }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
            {car.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
            {car.brand} {car.model} • {car.year}
          </Typography>
          <Typography
            variant="subtitle1"
            color="success.main"
            fontWeight={700}
          >
            <Price amountUSD={Number(car.price) || 0} />{" "}
            {car.priceNegotiable && (
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                (Negotiable)
              </Typography>
            )}
          </Typography>

          <Box
            sx={{
              mt: 1,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Chip label={`Fuel: ${car.fuelType}`} size="small" />
            <Chip label={`Condition: ${car.condition}`} size="small" />
            <Chip label={`Transmission: ${car.transmission}`} size="small" />
          </Box>
        </CardContent>

        <Box
          sx={{
            p: 2,
            pt: 0,
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-center',
            alignItems: 'center',
          }}
        >
          <Link href={`/cars/${car._id}`} style={{ textDecoration: 'none', width: '100%', paddingTop: '10px' }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            sx={{ borderRadius: 2, width: '100%' }}
          >
            View Details
          </Button>
          </Link>
        </Box>
      </Card>
    </Grid>
  ))
) : (
  <Grid item xs={12}>
    <Typography>No cars found for this dealer.</Typography>
  </Grid>
)}

          {/* {dealer.carsPosted && dealer.carsPosted.length > 0 ? (
            dealer.carsPosted.map((carId) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={carId._id as string}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: 6,
                    },
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                 
                  <Box
                    sx={{
                      position: 'relative',
                      pt: '56.25%',
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                                            Car Image
                    </Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      noWrap
                    >
                                            Car #{carId}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                                            Car Details
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="success.main"
                      fontWeight={700}
                    >
                                            Price: N/A
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Chip label="Details: N/A" size="small" />
                    </Box>
                  </CardContent>
                  <Box
                    sx={{
                      p: 2,
                      pt: 0,
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      href={`/cars/${carId}`}
                      sx={{ borderRadius: 2 }}
                    >
                                            View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography>No cars found for this dealer.</Typography>
            </Grid>
          )} */}
        </Grid>
      </Box>

      <Dialog open={openMessageDialog} onClose={handleCloseMessageDialog}>
        <DialogTitle>Contact {dealer.companyName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
                        Please fill out the form below to send a message to the dealer.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Your Name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="email"
            label="Your Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="message"
            label="Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessageDialog}>Cancel</Button>
          <Button onClick={handleSendMessage}>Send Message</Button>
        </DialogActions>
      </Dialog>

      <DealerChatModal
        open={chatModalOpen}
        dealer={dealer}
        onClose={handleCloseChatModal}
      />

      {/* Edit Profile Dialog */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        fullWidth
        maxWidth="md"
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
          Edit Dealer Profile
        </DialogTitle>
        <DialogContent>
          {/* Profile Image Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
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
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: 1,
                px: 3,
                py: 1,
              }}
            >
              Change Picture
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
              sx={{ color: '#6c757d', display: 'block', mt: 1, fontSize: '0.75rem' }}
            >
              Maximum file size: 5MB
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Personal Information */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#212529',
              mb: 2,
              fontSize: '1rem',
            }}
          >
            Personal Information
          </Typography>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                size="small"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                size="small"
                required
                InputProps={{ readOnly: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#f8f9fa',
                  },
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Company Information */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#212529',
              mb: 2,
              fontSize: '1rem',
            }}
          >
            Company Information
          </Typography>

          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleFormChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Person"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleFormChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Address Information */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#212529',
              mb: 2,
              fontSize: '1rem',
            }}
          >
            Address Information
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street"
                name="address.street"
                value={formData.address.street}
                onChange={handleFormChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleFormChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="address.state"
                value={formData.address.state}
                onChange={handleFormChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Zip Code"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleFormChange}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleFormChange}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCloseEditModal}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              color: '#6c757d',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProfile}
            disabled={isSaving}
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
              '&:disabled': {
                bgcolor: '#c8a45e',
                opacity: 0.6,
              },
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DealerProfile;

