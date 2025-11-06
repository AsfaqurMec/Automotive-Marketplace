'use client';
import React, { useState, useEffect, useRef } from 'react';
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
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { updateSparePart } from '@/lib/api/sparePart';
import useAuth from '@/lib/hooks/useAuth';

interface SparePartData {
  _id?: string;
  name?: string;
  partNumber?: string;
  description?: string;
  compatibleCars?: string[];
  price?: number | string;
  quantityInStock?: number;
  condition?: string;
  images?: string[];
  category?: string;
  isAvailable?: boolean;
}

interface SparePartUpdateData {
  id: string;
  data: Record<string, unknown>;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  partNumber: yup.string().required('Part Number is required'),
  price: yup.number().typeError('Must be a number').required('Price is required'),
  quantityInStock: yup.number().typeError('Must be a number').default(0),
  condition: yup.string().oneOf(['New', 'Used', 'Refurbished']),
  category: yup.string().required('Category is required'),
});

const EditSparePartModal: React.FC<{ open: boolean, onClose: () => void, initialData: SparePartData }> = ({ open, onClose, initialData }) => {
  const { user } = useAuth();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(initialData?.images || []);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (initialData) {
      setPreviewUrls([]);
      setImageFiles([]);
      setExistingImageUrls(initialData.images || []);

      formik.setValues({
        name: initialData.name || '',
        partNumber: initialData.partNumber || '',
        description: initialData.description || '',
        compatibleCars: initialData.compatibleCars?.join(',') || '',
        price: initialData.price || '',
        quantityInStock: initialData.quantityInStock || 0,
        condition: initialData.condition || 'New',
        images: initialData.images || '',
        category: initialData.category || 'Other',
        isAvailable: initialData.isAvailable ?? true,
      });
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((e.target as HTMLInputElement).files || []).filter((f: File) => f.size < 5 * 1024 * 1024);
    setImageFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleClickUpload = () => fileInputRef.current?.click();

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

  const mutation = useMutation({
    mutationFn: (data: { data: FormData; id: string }) => updateSparePart(data as unknown as SparePartUpdateData, user!),
    onSuccess: () => {
      toast.success('Spare part updated successfully');
      queryClient.invalidateQueries({ queryKey: ['get-sparePartsData'] });

      onClose();
    },
    onError: () => {
      toast.error('Update failed');
    },
  });

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || '',
      partNumber: initialData?.partNumber || '',
      description: initialData?.description || '',
      compatibleCars: initialData?.compatibleCars?.join(',') || '',
      price: initialData?.price || '',
      quantityInStock: initialData?.quantityInStock || 0,
      condition: initialData?.condition || 'New',
      images: initialData?.images || '',
      category: initialData?.category || 'Other',
      isAvailable: Boolean(initialData?.isAvailable ?? true),
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      for (const key in values) {
        if (!['compatibleCars', 'images'].includes(key)) {
          formData.append(key, String(values[key as keyof typeof values]));
        }
      }

      const cars = values.compatibleCars
        ? values.compatibleCars.split(',').map((car: string) => car.trim())
        : [];

      cars.forEach((car: string, index: number) => {
        formData.append(`compatibleCars[${index}]`, car);
      });

      existingImageUrls.forEach((url, index) => {
        formData.append(`existingImageUrls[${index}]`, url);
      });

      imageFiles.forEach((file) => {
        formData.append('imageFiles', file);
      });

      mutation.mutate({ data: formData, id: initialData?._id || '' });
    },
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Spare Part</DialogTitle>
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
            helperText={formik.touched.name && formik.errors.name as string}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Part Number"
            name="partNumber"
            value={formik.values.partNumber}
            onChange={formik.handleChange}
            error={formik.touched.partNumber && Boolean(formik.errors.partNumber)}
            helperText={formik.touched.partNumber && formik.errors.partNumber as string}
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
            helperText={formik.touched.price && formik.errors.price as string}
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
              {[
                ...existingImageUrls.map((url, idx) => ({
                  url,
                  type: 'existing',
                  index: idx,
                })),
                ...previewUrls.map((url, idx) => ({
                  url,
                  type: 'new',
                  index: idx,
                })),
              ].map((img, i) => (
                <Box key={i} sx={{ position: 'relative', width: 100, height: 100 }}>
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
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                      zIndex: 2,
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <img
                    src={img.type == 'existing' ? `/${img.url}` : img.url}
                    alt={`Preview ${i}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </Box>
              ))}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
                        Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditSparePartModal;

