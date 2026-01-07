import React from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Close } from '@mui/icons-material';
const validationSchema = Yup.object().shape({
  companyName: Yup.string().nullable(),
  fullName: Yup.string().required('Full name is required'),
  contactPerson: Yup.string().nullable(),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().nullable(),
  licenseExpiry: Yup.date().nullable(),
  isVerified: Yup.boolean(),
  address: Yup.object().shape({
    street: Yup.string().nullable(),
    city: Yup.string().nullable(),
    state: Yup.string().nullable(),
    zipCode: Yup.string().nullable(),
    country: Yup.string().nullable(),
  }),
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto',
};

const CreateDealerModal = ({ open, handleClose, onSubmit }: { open: boolean, handleClose: () => void, onSubmit: (values: Record<string, unknown>) => void }) => {
  const initialValues = {
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
  };

  const handleFormSubmit = (values: Record<string, unknown>, { resetForm }: { resetForm: () => void }) => {
    onSubmit(values);
    resetForm();
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '20px' }}>
                        Create Dealer
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Company Name"
                    name="companyName"
                    fullWidth
                    value={values.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    fullWidth
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName as string}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Contact Person"
                    name="contactPerson"
                    fullWidth
                    value={values.contactPerson}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && (errors.email as string)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="License Expiry"
                    name="licenseExpiry"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={values.licenseExpiry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="isVerified"
                        checked={values.isVerified as boolean}
                        onChange={handleChange}
                      />
                    }
                    label="Is Verified"
                  />
                </Grid>

                {/* Address Fields */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Address</Typography>
                </Grid>

                {['street', 'city', 'state', 'zipCode', 'country'].map((field) => (
                  <Grid item xs={12} sm={6} key={field}>
                    <TextField
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={`address.${field}`}
                      fullWidth
                      value={values.address[field as keyof typeof values.address]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button type="submit" variant="contained" fullWidth>
                                        Create Dealer
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Modal>
  );
};

export default CreateDealerModal;

