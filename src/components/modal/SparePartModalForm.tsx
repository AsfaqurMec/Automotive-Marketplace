'use client';
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  FormLabel,
  Select,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { createSparePart } from '@/lib/api/sparePart';
import useAuth from '@/lib/hooks/useAuth';
const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  partNumber: yup.string().required('Part Number is required'),
  price: yup.number().typeError('Must be a number').required('Price is required'),
  quantityInStock: yup.number().typeError('Must be a number').default(0),
  condition: yup.string().oneOf(['New', 'Used', 'Refurbished']),
  category: yup.string().required('Category is required'),
  images: yup.string(),
});

const SparePartModalForm: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
  const { user } = useAuth();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.size < 5 * 1024 * 1024,
    );
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((e.target as HTMLInputElement).files || []).filter((file: File) => file.size < 5 * 1024 * 1024);
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!user) throw new Error('User not authenticated');
      return createSparePart(data as unknown as Record<string, unknown>, user);
    },
    onSuccess: (data: { data?: { message?: string } }) => {
      toast.success(data?.data?.message || 'SparePart created successfully');
      onClose();
    },
    onError: () => {
      toast.error('Failed to create SparePart');
    },
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      partNumber: '',
      description: '',
      compatibleCars: '',
      price: '',
      quantityInStock: 0,
      condition: 'New',
      images: '',
      dealer: '',
      category: 'Other',
      isAvailable: true,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      for (const key in values) {
        if (key !== 'compatibleCars' && key !== 'images' && key !== 'imageFiles') {
          formData.append(key, String(values[key as keyof typeof values]));
        }
      }

      const compatibleCars = values.compatibleCars
        ? values.compatibleCars.split(',').map((car: string) => car.trim())
        : [];

      compatibleCars.forEach((car: string, index: number) => {
        formData.append(`compatibleCars[${index}]`, car);
      });

      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append('imageFiles', imageFiles[i]);
        }
      }
      mutation.mutate(formData);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Spare Part</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Part Number"
            name="partNumber"
            value={formik.values.partNumber}
            onChange={formik.handleChange}
            error={formik.touched.partNumber && Boolean(formik.errors.partNumber)}
            helperText={formik.touched.partNumber && formik.errors.partNumber}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Compatible Cars (comma separated)"
            name="compatibleCars"
            value={formik.values.compatibleCars}
            onChange={formik.handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Price"
            name="price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Quantity In Stock"
            name="quantityInStock"
            type="number"
            value={formik.values.quantityInStock}
            onChange={formik.handleChange}
          />

          <FormControl fullWidth margin="normal">
            <FormLabel>Condition</FormLabel>
            <Select
              name="condition"
              value={formik.values.condition}
              onChange={formik.handleChange}
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Used">Used</MenuItem>
              <MenuItem value="Refurbished">Refurbished</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Category</FormLabel>
            <Select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <MenuItem value="Engine">Engine</MenuItem>
              <MenuItem value="Transmission">Transmission</MenuItem>
              <MenuItem value="Brakes">Brakes</MenuItem>
              <MenuItem value="Suspension">Suspension</MenuItem>
              <MenuItem value="Electrical">Electrical</MenuItem>
              <MenuItem value="Body">Body</MenuItem>
              <MenuItem value="Interior">Interior</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ minWidth: '100%' }}>
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
                        Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SparePartModalForm;

