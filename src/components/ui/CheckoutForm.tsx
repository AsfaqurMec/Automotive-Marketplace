'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal, Box, Typography, TextField, Stack } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CheckoutForm: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.2checkout.com/checkout/api/2co.min.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = (document.getElementById('name') as HTMLInputElement)?.value;
    const email = (document.getElementById('email') as HTMLInputElement)?.value;

    const redirectUrl = `https://secure.2checkout.com/checkout/purchase?sid=255627191290&mode=2CO&li_0_type=product&li_0_name=Monthly%20Subscription&li_0_price=10&card_holder_name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

    window.location.href = redirectUrl;
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
                Pay Using 2Checkout
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
                        Enter Payment Details
          </Typography>

          <form onSubmit={handlePayment}>
            <Stack spacing={2}>
              <TextField id="name" label="Full Name" variant="outlined" required />
              <TextField
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                required
              />
              {/* <TextField id="card-number" label="Card Number" variant="outlined" required />
              <TextField id="exp-month" label="Expiry Month (MM)" variant="outlined" required />
              <TextField id="exp-year" label="Expiry Year (YY)" variant="outlined" required />
              <TextField id="cvv" label="CVV" variant="outlined" required /> */}
              <Button type="submit" variant="contained" color="primary">
                                Pay Now
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CheckoutForm;

