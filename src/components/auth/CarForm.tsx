import React from 'react';
import { Formik, Form } from 'formik';
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { FaImage } from 'react-icons/fa';
import colors from '../styles';
import { useMutation } from '@tanstack/react-query';
import { vehicaleApi } from '@/lib/api/vehicale';
import { toast } from 'react-toastify';
import useAuth from '@/lib/hooks/useAuth';

interface CarFormData {
  make: string;
  model: string;
  year: string;
  comments: string;
  condition: string;
  zip: string;
  image: File | null;
  email: string;
}
const initialValues = {
  make: '',
  model: '',
  year: '',
  comments: '',
  condition: '',
  zip: '',
  image: null,
  email: '',
};

const MyCarForm: React.FC = () => {
  const { user } = useAuth();
  const textBlack = colors.textBlack;
  const { mutateAsync: createVehicale } = useMutation({
    mutationFn: (data: CarFormData) => {
      if (!user) throw new Error('User not authenticated');
      return vehicaleApi.createVehicale(data as unknown as Record<string, unknown>, user);
    },
    onSuccess: () => {
      toast.success('Vehicle created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Error creating vehicle: ${error.message}`);
    },
  });

  const handleSubmit = (values: CarFormData) => {
    createVehicale(values);
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles[0]) {
        // setFieldValue will be available in the Formik render prop
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });
  const Styles = {
    fontFamily: 'Rubik',
    fontSize: '48px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };
  return (
    <Box sx={{ maxWidth: 1017, mx: 'auto', mt: 5, p: 2 }}>
      <Typography variant="h5" sx={Styles} gutterBottom>
                Get an Instant Offer from Trusted Dealers
      </Typography>

      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, handleChange, setFieldValue }) => (
          <Form>
            <FormControl fullWidth margin="normal">
              <InputLabel>Make</InputLabel>
              <Select name="make" value={values.make} onChange={handleChange}>
                <MenuItem value="tesla">Tesla</MenuItem>
                <MenuItem value="toyota">Toyota</MenuItem>
                <MenuItem value="ford">Ford</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Model</InputLabel>
              <Select name="model" value={values.model} onChange={handleChange}>
                <MenuItem value="model-s">Model S</MenuItem>
                <MenuItem value="camry">Camry</MenuItem>
                <MenuItem value="f150">F-150</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Year</InputLabel>
              <Select name="year" value={values.year} onChange={handleChange}>
                {[2025, 2024, 2023, 2022].map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="comments"
              label="Comments"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={values.comments}
              onChange={handleChange}
            />

            <FormControl component="fieldset" margin="normal">
              <Typography variant="subtitle1">Condition</Typography>
              <RadioGroup
                row
                name="condition"
                value={values.condition}
                onChange={handleChange}
              >
                <FormControlLabel value="poor" control={<Radio />} label="Poor" />
                <FormControlLabel value="fair" control={<Radio />} label="Fair" />
                <FormControlLabel value="good" control={<Radio />} label="Good" />
                <FormControlLabel
                  value="excellent"
                  control={<Radio />}
                  label="Excellent"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              name="zip"
              label="Zip Code"
              fullWidth
              margin="normal"
              value={values.zip}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Make</InputLabel>
              <Select name="make" value={values.make} onChange={handleChange}>
                <MenuItem value="tesla">Tesla</MenuItem>
                <MenuItem value="toyota">Toyota</MenuItem>
                <MenuItem value="ford">Ford</MenuItem>
              </Select>
            </FormControl>

            {/* Add draggable file input with an image icon */}
            <Button
              variant="outlined"
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
              {...getRootProps()}
            >
              <FaImage size={24} />
              <span>Upload Image</span>
              <input
                {...getInputProps()}
                type="file"
                hidden
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue('image', event.currentTarget.files?.[0] || null);
                }}
              />
            </Button>

            <Box
              sx={{
                mt: 2,
                p: 2,
                border: '2px dashed #1976d2',
                borderRadius: 1,
                textAlign: 'center',
              }}
              {...getRootProps()}
            >
              <Typography variant="body2" color="textSecondary">
                                Drag and drop an image here, or click to select
              </Typography>
            </Box>

            <TextField
              name="comments"
              label="Comments"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={values.comments}
              onChange={handleChange}
            />

            <TextField
              name="email"
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={values.email}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, maxWidth: 250 }}
            >
                            Submit Form
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MyCarForm;

