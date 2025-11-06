import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { createGarage } from '@/lib/api/garage';

const garageSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  services: Yup.array().min(1, 'At least one service is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email().required('Email is required'),
});

const CreateCarGarageModal: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
  const queryClient = useQueryClient();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => createGarage(data),
    onSuccess: () => {
      toast.success('Garage created successfully');
      queryClient.invalidateQueries({ queryKey: ['garages'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to create garage');
    },
  });
  const handleSubmit = (values: Record<string, unknown>) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, val]: [string, unknown]) => {
      if (key === 'services') {
        (val as string[]).forEach((s: string, i: number) => formData.append(`services[${i}]`, s));
      } else if (key !== 'image') {
        formData.append(key, String(val));
      }
    });

    imageFiles.forEach((file) => {
      formData.append('images', file); //  field name MUST be "images"
    });

    // Convert FormData to Record<string, unknown> for the API call
    const data: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      if (key === 'images') {
        data[key] = imageFiles;
      } else {
        data[key] = value;
      }
    });

    mutation.mutate(data);
  };
  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []).filter(
      (file) => file.size < 5 * 1024 * 1024,
    );
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((file: File) => URL.createObjectURL(file))]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((e.target as HTMLInputElement).files || []).filter((file) => file.size < 5 * 1024 * 1024);
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      services: [],
      city: '',
      country: '',
      phone: '',
      email: '',
      image: null,
    },
    validationSchema: garageSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Create Car Garage</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <FormControl>
              <FormLabel>Garage Name</FormLabel>
              <TextField
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <TextField
                name="description"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Services Offered</FormLabel>
              <Select
                name="services"
                multiple
                value={formik.values.services}
                onChange={formik.handleChange}
                error={formik.touched.services && !!formik.errors.services}
                fullWidth
              >
                {[
                  'General Service',
                  'Oil Change',
                  'Engine Repair',
                  'Brake Repair',
                  'Battery Replacement',
                  'Tire Service',
                  'AC Repair',
                  'Electrical Work',
                  'Diagnostics',
                ].map((service) => (
                  <MenuItem key={service} value={service}>
                    {service}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>City</FormLabel>
              <TextField
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && !!formik.errors.city}
                helperText={formik.touched.city && formik.errors.city}
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Country</FormLabel>
              <TextField
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                error={formik.touched.country && !!formik.errors.country}
                helperText={formik.touched.country && formik.errors.country}
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <TextField
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && !!formik.errors.phone}
                helperText={formik.touched.phone && formik.errors.phone}
                fullWidth
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel>Add Vehicle Images</FormLabel>
              <Box
                onDrop={handleDrop}
                onDragOver={(e: React.MouseEvent<HTMLElement>) => e.preventDefault()}
                onClick={handleClickUpload}
                sx={{
                  border: '1px dashed gray',
                  borderRadius: 2,
                  minHeight: 150,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  flexWrap: 'wrap',
                  gap: 2,
                  padding: 2,
                }}
              >
                {previewUrls.length === 0 ? (
                  <Box textAlign="center">
                    <CloudUploadIcon fontSize="large" />
                    <Typography variant="body2" mt={1}>
                                            Click to upload or drag and drop
                    </Typography>
                    <Typography variant="caption">
                                            JPG, JPEG, PNG files less than 5MB
                    </Typography>
                  </Box>
                ) : (
                  previewUrls.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e: React.MouseEvent<HTMLElement>) => {
                          e.stopPropagation();
                          const updatedPreviews = [...previewUrls];
                          const updatedFiles = [...imageFiles];
                          updatedPreviews.splice(index, 1);
                          updatedFiles.splice(index, 1);
                          setPreviewUrls(updatedPreviews);
                          setImageFiles(updatedFiles);
                        }}
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          zIndex: 1,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.8)',
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>

                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                  ))
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleFileChange}
                />
              </Box>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
                        Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCarGarageModal;

