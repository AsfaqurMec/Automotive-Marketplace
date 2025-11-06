import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControlLabel,
  Checkbox,
  FormLabel,
  InputLabel,
  Select,
  FormControl,
  SelectChangeEvent,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

const brands = {
  TOYOTA: [
    'Corolla',
    'Camry',
    'RAV4',
    'Highlander',
    'Prius',
    'Avalon',
    'Tacoma',
    'Tundra',
    'Sequoia',
  ],
  HONDA: ['Civic', 'Accord', 'CR-V', 'Fit', 'Pilot', 'Odyssey', 'HR-V', 'Ridgeline'],
  FORD: ['Fiesta', 'Focus', 'Escape', 'Explorer', 'Fusion', 'Mustang', 'Edge', 'F-150', 'Bronco'],
  NISSAN: ['Altima', 'Sentra', 'Rogue', 'Murano', 'Maxima', 'Versa', 'Pathfinder', 'Frontier'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'i3', 'i8'],
  'MERCEDES-BENZ': [
    'A-Class',
    'B-Class',
    'C-Class',
    'E-Class',
    'S-Class',
    'CLA',
    'CLS',
    'GLA',
    'GLB',
    'GLC',
    'GLE',
    'GLS',
    'G-Class',
    'EQC',
    'EQS',
    'EQB',
    'AMG GT',
    'M-Class',
  ],
  AUDI: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'Q8', 'A5', 'A8'],
  CHEVROLET: [
    'Malibu',
    'Impala',
    'Cruze',
    'Equinox',
    'Traverse',
    'Tahoe',
    'Suburban',
    'Colorado',
    'Silverado',
  ],
  KIA: [
    'Rio',
    'Forte',
    'Optima',
    'Sportage',
    'Sorento',
    'Telluride',
    'Soul',
    'Seltos',
    'Stinger',
  ],
  HYUNDAI: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent', 'Kona', 'Palisade', 'Venue'],
  TESLA: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'],
  VOLKSWAGEN: ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'ID.4'],
  MAZDA: ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'MX-5 Miata'],
  SUBARU: ['Impreza', 'Legacy', 'Outback', 'Forester', 'Crosstrek', 'Ascent'],
  LEXUS: ['IS', 'ES', 'GS', 'RX', 'NX', 'LX', 'UX'],
  JEEP: ['Wrangler', 'Cherokee', 'Grand Cherokee', 'Compass', 'Renegade', 'Gladiator'],
  DODGE: ['Charger', 'Challenger', 'Durango', 'Journey', 'Grand Caravan'],
  GMC: ['Terrain', 'Acadia', 'Yukon', 'Sierra'],
  ACURA: ['ILX', 'TLX', 'RDX', 'MDX', 'NSX'],
  INFINITI: ['Q50', 'Q60', 'QX50', 'QX60', 'QX80'],
  LAND_ROVER: ['Range Rover', 'Discovery', 'Defender', 'Evoque'],
  PORSCHE: ['911', 'Panamera', 'Cayenne', 'Macan', 'Taycan'],
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: 320, sm: 600 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, md: 4 },
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface CarData {
  _id: string;
  title?: string;
  type?: string;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  description?: string;
  features?: string[];
  media?: Array<{ url: string }>;
  negotiable?: boolean;
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  contactPhone?: string;
  contactEmail?: string;
  newFeature?: string;
  [key: string]: unknown;
}

const UpdateCarModal = ({ open, handleClose, carData, handleUpdate }: { open: boolean, handleClose: () => void, carData: CarData, handleUpdate: (id: string, data: FormData) => void }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CarData>({} as CarData);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(carData?.media?.map((media: { url: string }) => media.url) || []);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (carData) {
      setFormData(carData);
      setSelectedBrand(carData.brand || '');
      setPreviewUrls([]);
      setImageFiles([]);
      setExistingImageUrls(carData.media?.map((media: { url: string }) => media.url) || []);
    }
  }, [carData]);

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name?.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: CarData) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev: CarData) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleBrandChange = (e: SelectChangeEvent<string>) => {
    const newBrand = e.target.value;
    setSelectedBrand(newBrand);
    setFormData((prev: CarData) => ({
      ...prev,
      brand: newBrand,
      model: '',
    }));
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        val.forEach((item) => {
          formDataToSend.append(`${key}[]`, item);
        });
      } else if (typeof val === 'object' && val !== null) {
        formDataToSend.append(key, JSON.stringify(val));
      } else {
        formDataToSend.append(key, String(val));
      }
    });
    existingImageUrls.forEach((url, index) => {
      formDataToSend.append(`existingImageUrls[${index}]`, url);
    });

    if (imageFiles && imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        formDataToSend.append('media', imageFiles[i]);
      }
    }
  //  console.log(formDataToSend);
    handleUpdate(carData?._id, formDataToSend);
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {t('updateCar')}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label={t('title')}
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label={t('type')}
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="rent">{t('rent')}</MenuItem>
              <MenuItem value="sell">{t('sell')}</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex' }}>
            <TextField
              label={t('price')}
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              sx={{ width: '80%', marginRight: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="negotiable"
                  checked={formData.negotiable || false}
                  onChange={handleChange}
                />
              }
              label={t('negotiable')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('country')}
              name="location.country"
              value={formData.location?.country || ''}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('state')}
              name="location.state"
              value={formData.location?.state || ''}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('city')}
              name="location.city"
              value={formData.location?.city || ''}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('brand')}</InputLabel>
              <Select
                name="brand"
                value={formData.brand || ''}
                onChange={handleBrandChange}
              >
                {Object.keys(brands).map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('model')}</InputLabel>
              <Select
                name="model"
                value={formData.model || ''}
                onChange={handleBrandChange}
              >
                {brands[selectedBrand as keyof typeof brands]?.map((model: string) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={t('year')}
              name="year"
              type="number"
              value={formData.year || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={t('mileageKm')}
              name="mileage"
              type="number"
              value={formData.mileage || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label={t('fuelType')}
              name="fuelType"
              value={formData.fuelType || ''}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">
                <em>{t('none')}</em>
              </MenuItem>
              <MenuItem value="Petrol">{t('petrol')}</MenuItem>
              <MenuItem value="Diesel">{t('diesel')}</MenuItem>
              <MenuItem value="Electric">{t('electric')}</MenuItem>
              <MenuItem value="Hybrid">{t('hybrid')}</MenuItem>
              <MenuItem value="Gasoline">{t('gasoline')}</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label={t('transmission')}
              name="transmission"
              value={formData.transmission || ''}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Manual">{t('manual')}</MenuItem>
              <MenuItem value="Automatic">{t('automatic')}</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label={t('condition')}
              name="condition"
              value={formData.condition || ''}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="New">{t('new')}</MenuItem>
              <MenuItem value="Used">{t('used')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" mb={1}>
              {t('features')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: 1,
                p: 1,
              }}
            >
              {formData.features?.map((feature: string, index: number) => (
                <Chip
                  key={index}
                  label={feature}
                  onDelete={() => {
                    setFormData((prev: CarData) => ({
                      ...prev,
                      features: (prev.features || []).filter((_: string, i: number) => i !== index),
                    }));
                  }}
                />
              ))}
              <TextField
                variant="standard"
                placeholder={t('addFeature')}
                value={formData.newFeature || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev: CarData) => ({ ...prev, newFeature: e.target.value }))
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter' && formData.newFeature?.trim()) {
                    e.preventDefault();
                    const newFeat = formData.newFeature.trim();
                    if (!formData.features?.includes(newFeat)) {
                      setFormData((prev: CarData) => ({
                        ...prev,
                        features: [...(prev.features || []), newFeat],
                        newFeature: '',
                      }));
                    }
                  }
                }}
                sx={{ minWidth: 150 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={t('phone')}
              name="contactPhone"
              value={formData.contactPhone || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={t('email')}
              name="contactEmail"
              value={formData.contactEmail || ''}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={t('description')}
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl>
              <FormLabel>{t('vehicleImages')}</FormLabel>
              <Typography variant="caption" color="text.secondary" sx={{ my: 1 }}>
                                ( {t('profileImageSize')} )
              </Typography>
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
                  flexDirection: { xs: 'column', md: 'row' },
                  flexWrap: 'wrap',
                  gap: 2,
                  p: 2,
                  cursor: 'pointer',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: { xs: '260px', md: '500px' },
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
                  <Box
                    key={i}
                    sx={{
                      position: 'relative',
                      width: { xs: 200, md: 150 },
                      height: 150,
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
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                        zIndex: 2,
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <img
                      src={img.type == 'existing' ? `${img.url}` : img.url}
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
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {t('update')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateCarModal;

