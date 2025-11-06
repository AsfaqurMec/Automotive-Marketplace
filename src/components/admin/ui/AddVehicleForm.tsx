import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  FormLabel,
  IconButton,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { vehicaleApi } from '@/lib/api/vehicale';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { estimateCarPrice } from '@/lib/utils/carPriceEstimator';
import { FaShekelSign } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { CarDetails, User } from '@/types';
import useAuth from '@/lib/hooks/useAuth';
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

const featuresList = [
  'Sunroof',
  'Leather Seats',
  'Bluetooth',
  'Backup Camera',
  'Navigation System',
  'Alloy Wheels',
  'Remote Start',
  'Heated Seats',
  'Keyless Entry',
  'Blind Spot Monitor',
  'Adaptive Cruise Control',
  'Lane Departure Warning',
  'Parking Sensors',
  'Apple CarPlay',
  'Android Auto',
  'Power Seats',
  'Touchscreen Display',
  'Automatic Emergency Braking',
  'Turbocharged Engine',
  'Fog Lights',
  'Rear Cross Traffic Alert',
  'Voice Recognition',
  'Wireless Charging',
  'Dual-zone Climate Control',
  'Memory Seats',
  'Premium Sound System',
  'LED Headlights',
  'Roof Rails',
  'Towing Package',
];

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').min(0),
  brand: Yup.string().required('Brand is required'),
  model: Yup.string().required('Model is required'),
  year: Yup.number().required('Year is required').min(1900).max(new Date().getFullYear()),
  mileage: Yup.number().required('Mileage is required').min(0),
  fuelType: Yup.string().required('Fuel Type is required'),
  transmission: Yup.string().required('Transmission is required'),
  features: Yup.array().of(Yup.string()),
  location: Yup.object().shape({
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    coordinates: Yup.object({
      lat: Yup.number().nullable(),
      lng: Yup.number().nullable(),
    }).nullable(),
  }),
  contactInfo: Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
  }),
});

const AddVehicleForm: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);

  const [isLoadings, setIsLoadings] = useState(false);
  const [suggestionData, setSuggestionData] = useState<{
    minPrice: number;
    maxPrice: number;
    reasoning: string;
  } | null>(null);
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const router = useRouter();
  const { mutateAsync: createVehicale, isPending } = useMutation({
    mutationFn: (data: Record<string, unknown>) => vehicaleApi.createVehicale(data as any, user as unknown as User),
    onSuccess: () => {
      router.push('/admin/inventory');
      toast.success('Vehicle created successfully!');

      formik.resetForm();
      setImageFiles([]);
      setPreviewUrls([]);
    },

    onError: () => {
      toast.error('Error creating vehicle');
    },
  });

  const handleSuggestPrice = async () => {
    const { brand, model, year, mileage, condition, location } = formik.values;
    const requiredFields = {
      Brand: brand,
      Model: model,
      Year: year,
      Mileage: mileage,
      Condition: condition,
      City: location.city,
      State: location.state,
      Country: location.country,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.warn(
        `Please fill in the following fields to get a suggestion: ${missingFields.join(', ')}`,
      );
      return;
    }
    setIsLoadings(true);
    setIsSuggestOpen(true);

    const carDetails: CarDetails = {
      _id: 'temp',
      make: requiredFields.Brand,
      model: requiredFields.Model,
      year: parseInt(requiredFields.Year) || 0,
      mileage: parseInt(requiredFields.Mileage) || 0,
      condition: requiredFields.Condition as string,
      // location: `${requiredFields.City}, ${requiredFields.State}, ${requiredFields.Country}`,
      brand: requiredFields.Brand,
      fuelType: 'Unknown',
      transmission: 'Unknown',
      price: 0,
      description: 'Car description',
      status: 'available',
    };
    const data = await estimateCarPrice(carDetails);

    setSuggestionData(data);

    setIsLoadings(false);
  };

  const handleApplyPrice = () => {
    if (suggestionData) {
      const priceToApply = (suggestionData.minPrice + suggestionData.maxPrice) / 2;
      formik.setFieldValue('price', priceToApply);
    }
    handleCloseSuggest();
  };

  const handleCloseSuggest = () => {
    setIsSuggestOpen(false);
    setSuggestionData(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const allFiles = Array.from(e.dataTransfer.files);

    // Separate files by size
    const validFiles = allFiles.filter((file) => file.size < MAX_SIZE);
    const largeFiles = allFiles.filter((file) => file.size >= MAX_SIZE);

    if (largeFiles.length > 0) {
      toast.error('Some files exceed the 5 MB size limit and were not added.');
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const allFiles = Array.from(e.target.files as FileList);

    const validFiles = allFiles.filter((file) => file.size < MAX_SIZE);
    const largeFiles = allFiles.filter((file) => file.size >= MAX_SIZE);

    if (largeFiles.length > 0) {
      toast.error('Some files exceed the 5 MB size limit and were not added.');
    }

    setImageFiles((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      negotiable: false,
      brand: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: '',
      vinNumber: '',

      transmission: '',
      features: [],
      condition: '',
      location: {
        country: '',
        state: '',
        city: '',
        coordinates: {
          latitude: '',
          longitude: '',
        },
      },
      contactInfo: {
        name: '',
        phone: '',
        email: '',
      },
      media: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      // Check if form is valid
      if (Object.keys(formik.errors).length > 0) {
        toast.error('Please fix form errors before submitting');
        return;
      }

      const formData = new FormData();

      // Basic string/number fields
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price.toString());
      formData.append('negotiable', values.negotiable.toString());
      formData.append('brand', values.brand);
      formData.append('model', values.model);
      formData.append('year', values.year.toString());
      formData.append('mileage', values.mileage.toString());
      formData.append('fuelType', values.fuelType);
      formData.append('vinNumber', values.vinNumber);
      formData.append('transmission', values.transmission);
      formData.append('condition', values.condition);

      // Features array
      if (Array.isArray(values.features)) {
        values.features.forEach((feature) => {
          formData.append('features[]', feature);
        });
      }

      // Contact info (flattened)
      if (values.contactInfo) {
        formData.append('contactInfo[name]', values.contactInfo.name);
        formData.append('contactInfo[phone]', values.contactInfo.phone);
        formData.append('contactInfo[email]', values.contactInfo.email);
      }

      // Location (flattened)
      if (values.location) {
        formData.append('location[country]', values.location.country);
        formData.append('location[state]', values.location.state);
        formData.append('location[city]', values.location.city);
        if (values.location.coordinates) {
          formData.append(
            'location[coordinates][latitude]',
            values.location.coordinates.latitude.toString(),
          );
          formData.append(
            'location[coordinates][longitude]',
            values.location.coordinates.longitude.toString(),
          );
        }
      }

      // Images (media)
      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append('media', imageFiles[i]);
        }
      }

      // Submit the form data to your API
      //createVehicale(formData as any);
      createVehicale(formData as unknown as Record<string, unknown>);
    },
  });

  function getTransmissionType(transmission: string) {
    if (!transmission) return null;

    const manualKeywords = ['manual', 'mt', 'stick shift', 'standard'];
    const autoKeywords = [
      'automatic',
      'auto',
      'cvt',
      'continuously variable transmission',
      'cvt',
    ];

    const lowerTrans = transmission.toLowerCase();

    for (const keyword of manualKeywords) {
      if (lowerTrans.includes(keyword)) {
        return 'Manual';
      }
    }

    for (const keyword of autoKeywords) {
      if (lowerTrans.includes(keyword)) {
        return 'Automatic';
      }
    }

    return 'unknown';
  }
  const handleVinFetch = async () => {
    const vin = formik.values.vinNumber;
    if (!vin) {
      alert('Please enter a VIN.');
      return;
    }

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`,
      );
      const result = await response.json();

      const results = result.Results;

      const getValue = (variable: string) =>
        results.find((item: { Variable: string; Value: string }) => item.Variable === variable)?.Value || '';
      setSelectedBrand(getValue('Make'));

      formik.setFieldValue('brand', getValue('Make'));
      formik.setFieldValue('model', getValue('Model'));
      formik.setFieldValue('year', getValue('Model Year'));
      formik.setFieldValue('fuelType', getValue('Fuel Type - Primary'));
      formik.setFieldValue(
        'transmission',
        getTransmissionType(getValue('Transmission Style')) ||
                    getTransmissionType(getValue('Transmission Speeds')),
      );
    } catch {
      toast.error('Failed to fetch VIN data.');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          formik.setFieldValue('location.coordinates.latitude', latitude);
          formik.setFieldValue('location.coordinates.longitude', longitude);
        },
        () => {
          toast.error('Geolocation error');
        },
      );
    } else {
      toast.error('Geolocation not supported by this browser.');
    }
  }, [formik]);

  const handleBrandChange = (event: SelectChangeEvent<string>) => {
    const brand = event.target.value;
    setSelectedBrand(brand);
    formik.setFieldValue('brand', brand);
    formik.setFieldValue('model', ''); // Reset model
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: '100%', mx: 'auto' }}>
      {/* {isLoading&&<CustomLoaderForComponent/>} */}
      <Typography variant="h4" gutterBottom>
        {t('postCarListing')}
      </Typography>

      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('title')}
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && t(formik.errors.title as string)}
            />
          </Grid>
          <Grid container spacing={2} alignItems="center" sx={{ mt: 2, px: 2 }}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label={t('vinNumber')}
                name="vinNumber"
                value={formik.values.vinNumber}
                onChange={formik.handleChange}
                error={formik.touched.vinNumber && Boolean(formik.errors.vinNumber)}
                helperText={formik.touched.vinNumber && t(formik.errors.vinNumber as string)}
                sx={{ maxWidth: '100%' }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleVinFetch}
                sx={{
                  height: '56px',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('fetchVinData')}
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={t('description')}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && t(formik.errors.description as string)}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label={t('price')}
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && t(formik.errors.price as string)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaShekelSign />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={7} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSuggestPrice}
              startIcon={<AutoAwesomeIcon />}
              sx={{ height: '56px' }}
            >
              {t('suggest')}
            </Button>
          </Grid>
          <Grid item xs={7} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  name="negotiable"
                  checked={formik.values.negotiable}
                  onChange={formik.handleChange}
                />
              }
              label={t('negotiable')}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>{t('brand')}</InputLabel>
              <Select
                name="brand"
                value={formik.values.brand}
                onChange={handleBrandChange}
                error={formik.touched.brand && Boolean(formik.errors.brand)}
              >
                {Object.keys(brands).map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>{t('model')}</InputLabel>
              <Select
                name="model"
                value={formik.values.model}
                onChange={formik.handleChange}
                error={formik.touched.model && Boolean(formik.errors.model)}
              >
                {brands[selectedBrand as keyof typeof brands]?.map((model: string) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>{t('condition')}</InputLabel>
              <Select
                name="condition"
                value={formik.values.condition}
                onChange={formik.handleChange}
                error={formik.touched.condition && Boolean(formik.errors.condition)}
              >
                <MenuItem value="New">{t('new')}</MenuItem>
                <MenuItem value="Used">{t('used')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label={t('year')}
              type="number"
              name="year"
              value={formik.values.year}
              onChange={formik.handleChange}
              error={formik.touched.year && Boolean(formik.errors.year)}
              helperText={formik.touched.year && t(formik.errors.year as string)}
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              fullWidth
              label={t('mileageKm')}
              type="number"
              name="mileage"
              value={formik.values.mileage}
              onChange={formik.handleChange}
              error={formik.touched.mileage && Boolean(formik.errors.mileage)}
              helperText={formik.touched.mileage && t(formik.errors.mileage as string)}
            />
          </Grid>
          <Grid item xs={8} sm={4}>
            <FormControl
              fullWidth
              error={formik.touched.fuelType && Boolean(formik.errors.fuelType)}
            >
              <InputLabel>{t('fuelType')}</InputLabel>
              <Select
                name="fuelType"
                value={formik.values.fuelType}
                onChange={formik.handleChange}
                label={t('fuelType')}
              >
                <MenuItem value="">
                  <em>{t('none')}</em>
                </MenuItem>
                <MenuItem value="Petrol">{t('petrol')}</MenuItem>
                <MenuItem value="Diesel">{t('diesel')}</MenuItem>
                <MenuItem value="Electric">{t('electric')}</MenuItem>
                <MenuItem value="Hybrid">{t('hybrid')}</MenuItem>
                <MenuItem value="Gasoline">{t('gasoline')}</MenuItem>
              </Select>
              {formik.touched.fuelType && formik.errors.fuelType && (
                <Typography variant="caption" color="error">
                  {t(formik.errors.fuelType)}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl
              fullWidth
              error={
                formik.touched.transmission && Boolean(formik.errors.transmission)
              }
            >
              <InputLabel>{t('transmission')}</InputLabel>
              <Select
                name="transmission"
                value={formik.values.transmission}
                onChange={formik.handleChange}
                label={t('transmission')}
              >
                <MenuItem value="">
                  <em>{t('none')}</em>
                </MenuItem>
                <MenuItem value="Manual">{t('manual')}</MenuItem>
                <MenuItem value="Automatic">{t('automatic')}</MenuItem>
              </Select>
              {formik.touched.transmission && formik.errors.transmission && (
                <Typography variant="caption" color="error">
                  {t(formik.errors.transmission)}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {t('features')}
            </Typography>
            {featuresList.map((feature) => (
              <FormControlLabel
                key={feature}
                control={
                  <Checkbox
                    checked={formik.values.features.includes(feature as never)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const checked = e.target.checked;
                      const updated = checked
                        ? [...formik.values.features, feature]
                        : formik.values.features.filter(
                          (f) => f !== feature,
                        );
                      formik.setFieldValue('features', updated);
                    }}
                  />
                }
                label={t(feature)}
              />
            ))}
          </Grid>

          {/* Location */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={t('country')}
              name="location.country"
              value={formik.values.location.country}
              onChange={formik.handleChange}
              error={
                formik.touched.location?.country &&
                                Boolean(formik.errors.location?.country)
              }
              helperText={
                formik.touched.location?.country &&
                                t(formik.errors.location?.country as string)
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={t('state')}
              name="location.state"
              value={formik.values.location.state}
              onChange={formik.handleChange}
              error={
                formik.touched.location?.state &&
                                Boolean(formik.errors.location?.state)
              }
              helperText={
                formik.touched.location?.state && t(formik.errors.location?.state as string)
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={t('city')}
              name="location.city"
              value={formik.values.location.city}
              onChange={formik.handleChange}
              error={
                formik.touched.location?.city &&
                                Boolean(formik.errors.location?.city)
              }
              helperText={
                formik.touched.location?.city && t(formik.errors.location?.city as string)
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={t('contactName')}
              name="contactInfo.name"
              value={formik.values.contactInfo.name}
              onChange={formik.handleChange}
              error={
                formik.touched.contactInfo?.name &&
                                Boolean(formik.errors.contactInfo?.name)
              }
              helperText={
                formik.touched.contactInfo?.name &&
                                t(formik.errors.contactInfo?.name as string)
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={t('phone')}
              name="contactInfo.phone"
              value={formik.values.contactInfo.phone}
              onChange={formik.handleChange}
              error={
                formik.touched.contactInfo?.phone &&
                                Boolean(formik.errors.contactInfo?.phone)
              }
              helperText={
                formik.touched.contactInfo?.phone &&
                                t(formik.errors.contactInfo?.phone as string)
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label={t('email')}
              name="contactInfo.email"
              value={formik.values.contactInfo.email}
              onChange={formik.handleChange}
              error={
                formik.touched.contactInfo?.email &&
                                Boolean(formik.errors.contactInfo?.email)
              }
              helperText={
                formik.touched.contactInfo?.email &&
                                t(formik.errors.contactInfo?.email as string)
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('latitude')}
              name="location.coordinates.latitude"
              value={formik.values.location.coordinates.latitude}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                formik.setFieldValue('location.coordinates.latitude', val);
              }}
              error={Boolean(
                formik.touched.location?.coordinates?.latitude &&
                                    formik.errors.location?.coordinates?.latitude,
              )}
              helperText={
                formik.touched.location?.coordinates?.latitude &&
                                t(formik.errors.location?.coordinates?.latitude as string)
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('longitude')}
              name="location.coordinates.longitude"
              value={formik.values.location.coordinates.longitude}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value;
                formik.setFieldValue('location.coordinates.longitude', val);
              }}
              error={Boolean(
                formik.touched.location?.coordinates?.longitude &&
                                    formik.errors.location?.coordinates?.longitude,
              )}
              helperText={
                formik.touched.location?.coordinates?.longitude &&
                                t(formik.errors.location?.coordinates?.longitude as string)
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl
              sx={{
                width: '100%',
              }}
            >
              <FormLabel>{t('addVehicleImages')}</FormLabel>
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
                {previewUrls?.length === 0 ? (
                  <Box textAlign="center">
                    <CloudUploadIcon fontSize="large" />
                    <Typography variant="body2" mt={1}>
                      {t('clickToUploadOrDragAndDrop')}
                    </Typography>
                    <Typography variant="caption">
                      {t('imageUploadHint')}
                    </Typography>
                  </Box>
                ) : (
                  previewUrls?.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 100,
                        height: 100,
                        display: 'flex',
                        flexDirection: { xs: 'cloumn', md: 'row' },
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
                        alt={t('previewImageAlt', { index: index + 1 })}
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
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          >
            <Button
              sx={{ minWidth: '40%' }}
              type="submit"
              variant="contained"
              color="primary"
            >
              {isPending ? 'Creating...' : t('addVehicle')}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Dialog open={isSuggestOpen} onClose={handleCloseSuggest} maxWidth="sm" fullWidth>
        <DialogTitle>{t('aiPriceSuggestion')}</DialogTitle>
        <DialogContent>
          {isLoadings ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            suggestionData && (
              <Box>
                <Typography variant="h6" color="text.secondary">
                  {t('suggestedPriceRange')}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', my: 1, color: 'primary.main' }}
                >
                  ₪{suggestionData.minPrice.toLocaleString()} - ₪{suggestionData.maxPrice.toLocaleString()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('reasoning')}
                </Typography>

                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {suggestionData.reasoning}
                </Typography>
              </Box>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuggest}>{t('deny')}</Button>
          <Button onClick={handleApplyPrice} variant="contained" disabled={isLoadings}>
            {t('applyAveragePrice')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddVehicleForm;

