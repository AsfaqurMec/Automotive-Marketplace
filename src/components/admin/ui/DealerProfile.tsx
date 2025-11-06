'use client';

import React, { useState, useEffect } from 'react';
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
import { Business, Email, Phone, LocationOn, VerifiedUser, Star } from '@mui/icons-material';
import { getDealerById } from '@/lib/api/dealer';
import { Dealer } from '@/types';

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
              src={dealer.logo || ''}
              alt={`${dealer.companyName} Logo`}
              sx={{ width: 80, height: 80 }}
            />
          }
          title={
            <Typography variant="h4" component="div">
              {dealer.companyName}
            </Typography>
          }
          subheader={`Member since: ${dealer.createdAt ? new Date(dealer.createdAt).toLocaleDateString() : 'N/A'}`}
          action={
            dealer.isVerified ? (
              <Chip
                icon={<VerifiedUser />}
                label="Verified"
                color="success"
                variant="outlined"
                sx={{ mt: 2, mr: 2 }}
              />
            ) : null
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
              <Button
                variant="contained"
                color="primary"
                startIcon={<Email />}
                onClick={handleOpenMessageDialog}
                sx={{ mt: 2 }}
              >
                                Send Message
              </Button>
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
            ${car.price?.toLocaleString()}{" "}
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
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            color="primary"
            href={`/cars/${car._id}`}
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
    </Box>
  );
};

export default DealerProfile;

