'use client';
import { useEffect, useState, useRef } from 'react';
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
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { updateGarage } from '@/lib/api/garage';

interface GarageData {
  _id?: string;
  name?: string;
  email?: string;
  description?: string;
  city?: string[] | string;
  services?: string[] | string;
  country?: string | number;
  phone?: string;
  images?: string[];
}

// Removed unused import
const garageSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string(),
  services: Yup.array().min(1, 'At least one service is required'),
  city: Yup.string().required('City is required'),
  country: Yup.string().required('Country is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string().email().required('Email is required'),
});

const EditCarGarageModal: React.FC<{ open: boolean, onClose: () => void, initialData: GarageData }> = ({ open, onClose, initialData }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(initialData?.images || []);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: (data: { data: Record<string, unknown>; id: string }) => updateGarage(data),
    onSuccess: () => {
      toast.success('Garage updated successfully');
      queryClient.invalidateQueries({ queryKey: ['garages'] });
      onClose();
    },
    onError: () => {
      toast.error('Failed to update garage');
    },
  });
  const handleSubmit = (values: Record<string, unknown>) => {
    const data: Record<string, unknown> = { ...values };

    // Handle services array
    if (data.services && Array.isArray(data.services)) {
      data.services = data.services;
    }

    // Add existing images and new files
    data.existingImageUrls = existingImageUrls;
    data.imageFiles = imageFiles;

    if (!initialData?._id) {
      toast.error('Garage ID not found');
      return;
    }

    mutation.mutate({ data, id: initialData._id });
  };

  const removeImage = (index: number, type: string) => {
    if (type === 'existing') {
      const updated = [...existingImageUrls];
      updated.splice(index, 1);
      setExistingImageUrls(updated);
    } else {
      const updatedFiles = [...imageFiles];
      const updatedPreviews = [...previewUrls];
      updatedFiles.splice(index, 1);
      updatedPreviews.splice(index, 1);
      setImageFiles(updatedFiles);
      setPreviewUrls(updatedPreviews);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((e.target as HTMLInputElement).files || []).filter((file: File) => file.size < 5 * 1024 * 1024);
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
      services: [] as string[],
      city: '',
      country: '',
      phone: '',
      email: '',
      image: [] as string[],
    },
    validationSchema: garageSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  useEffect(() => {
    if (initialData) {
      setPreviewUrls([]);
      setImageFiles([]);
      setExistingImageUrls(initialData.images || []);

      formik.setValues({
        name: initialData.name || '',
        email: initialData.email || '',
        description: initialData.description || '',
        city: Array.isArray(initialData.city) ? initialData.city.join(',') : initialData.city || '',
        services: Array.isArray(initialData.services) ? initialData.services : [],
        country: String(initialData.country || ''),
        phone: initialData.phone || '',
        image: initialData.images || [],
      });
    }
  }, [initialData, formik]);

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
              <FormControl>
                <FormLabel>Vehicle Images</FormLabel>
                <Box
                  onDrop={(e: React.DragEvent<HTMLElement>) => {
                    e.preventDefault();
                    const files = Array.from((e.dataTransfer as DataTransfer).files || []).filter(
                      (file) => file.size < 5 * 1024 * 1024,
                    );
                    setImageFiles((prev) => [...prev, ...files]);
                    setPreviewUrls((prev) => [
                      ...prev,
                      ...files.map((file) => URL.createObjectURL(file)),
                    ]);
                  }}
                  onDragOver={(e: React.MouseEvent<HTMLElement>) => e.preventDefault()}
                  onClick={handleClickUpload}
                  sx={{
                    border: '1px dashed gray',
                    borderRadius: 2,
                    minHeight: 150,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    p: 2,
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {existingImageUrls?.length == 0 && previewUrls.length === 0 ? (
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
                    [
                      ...existingImageUrls?.map((url, idx) => ({
                        url,
                        type: 'existing',
                        index: idx,
                      })),
                      ...previewUrls?.map((url, idx) => ({
                        url,
                        type: 'new',
                        index: idx,
                      })),
                    ]?.map((img, i) => (
                      <Box
                        key={i}
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
                            removeImage(img.index, img.type);
                          }}
                          sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.8)',
                            },
                            zIndex: 2,
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <img
                          src={
                            img.type == 'existing'
                              ? `/${img.url}`
                              : img.url
                          }
                          alt={`Preview ${i}`}
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

export default EditCarGarageModal;

