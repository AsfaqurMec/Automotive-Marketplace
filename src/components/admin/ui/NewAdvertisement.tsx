import {
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  Link as MuiLink,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import NewCampaignCard from './NewCampaignCard'; // Ensure this is adapted for new structures
import { styled } from '@mui/system';
import { useEffect, useState, useCallback } from 'react';
import StickyBox from 'react-sticky-box';
import * as yup from 'yup';
import moment from 'moment';
import { useFormik, FormikProps } from 'formik'; // Using manual array management, FieldArray not directly used for headlines/desc
import { useMutation } from '@tanstack/react-query'; // Example import
import { toast } from 'react-toastify';
import CustomLoaderForComponent from '@/components/ui/CustomLoaderForComponent';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import { createAds } from '@/lib/api/campaign';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import useAuth from '@/lib/hooks/useAuth';
import { Campaign, CampaignFormData, DescriptionItem, DisplayAdCreative, HeadlineItem, SearchAdCreative } from '@/types';
import { ApiResponse } from '@/types/utils';
const DescriptionTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.breakpoints.down('md') ? 16 : 20,
  fontWeight: theme.breakpoints.down('lg') ? 400 : 600,
  marginY: (props: { marginY: string }) => props.marginY,
}));
const DescriptionText = styled(Typography)({});
const UploadButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  textTransform: 'none',
  marginTop: '5px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
const CustomTab = ({ label, value, formik }: { label: string, value: string, formik: FormikProps<any> }) => {
  const theme = useTheme();
  const handleClick = () => {
    const newValue = formik.values.networks.includes(value)
      ? formik.values.networks.filter((item: string) => item !== value)
      : [...formik.values.networks, value];
    formik.setFieldValue('networks', newValue);
  };
  const isActive = formik.values.networks.includes(value);
  return (
    <Button
      variant={isActive ? 'contained' : 'outlined'}
      onClick={handleClick}
      sx={{
        marginTop: 1,
        textTransform: 'capitalize',
        borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
        bgcolor: isActive ? theme.palette.primary.main : 'transparent',
        color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
        '&:hover': {
          bgcolor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
          borderColor: isActive ? theme.palette.primary.dark : theme.palette.divider,
        },
      }}
    >
      {label}
    </Button>
  );
};

const defaultSearchAdCreative = {
  finalUrl: '',
  headlines: [{ text: '' }, { text: '' }, { text: '' }],
  descriptions: [{ text: '' }, { text: '' }],
  path1: '',
  path2: '',
  image: null,
  imgUrl: '',
};

const defaultDisplayAdCreative = {
  finalUrl: '', // Standardized name
  image: null,
  imgUrl: '',
  headline: '',
  descriptionText: '',
};

const NewAdvertisement: React.FC = () => {
  const theme = useTheme();
  const cardBgColor = theme.palette.background.paper;
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { user } = useAuth();

  const [isSubmittingForm, setIsSubmittingForm] = useState(false); // Renamed to avoid conflict with TanStack's isLoading

  const [isTokenMissing, setIsTokenMissing] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get('google_ads_accessToken');
    if (!accessToken) {
      setIsTokenMissing(true);
      toast.error('Access token missing. Please connect your Google Ads account.');
    } else {
      setIsTokenMissing(false);
    }
  }, []);

  // --- Yup Validation Schemas ---
  const imageValidationSchema = yup
    .mixed()
    .nullable() // Allows the field to be null (no file selected)
    .test('is-image-file-type', 'Invalid image file type (PNG, JPG, JPEG only).', (value) => {
      if (!value || !(value instanceof File)) return true; // Valid if null/undefined or not a File object
      if (value instanceof File && value.name) {
        // Only validate type if it's a File object with a name
        return ['image/png', 'image/jpg', 'image/jpeg'].includes(value.type);
      }
      return true; // Pass if not a File object being validated for type (e.g. placeholder)
    });

  const headlineSchema = yup.object({
    text: yup.string().required('Headline text is required.').max(30, 'Headline max 30 chars.'),
  });
  const descriptionSchema = yup.object({
    text: yup
      .string()
      .required('Description text is required.')
      .max(90, 'Description max 90 chars.'),
  });

  const searchAdContentSchema = yup.object({
    finalUrl: yup.string().url('Invalid final URL.').required('Final URL is required.'),
    headlines: yup
      .array()
      .of(headlineSchema)
      .min(2, 'Min 2 headlines.')
      .max(5, 'Max 5 headlines.'),
    descriptions: yup
      .array()
      .of(descriptionSchema)
      .min(1, 'Min 1 description.')
      .max(4, 'Max 4 descriptions.'),
    path1: yup.string().optional().nullable().max(15, 'Path 1 max 15 chars.'),
    path2: yup.string().optional().nullable().max(15, 'Path 2 max 15 chars.'),
    image: imageValidationSchema, // Image is optional for Search Ads
    imgUrl: yup.string().url('Invalid existing image URL.').optional().nullable(),
  });

  const displayAdContentSchema = yup.object({
    finalUrl: yup
      .string()
      .url('Invalid final URL for Display Ad.')
      .required('Final URL is required for Display Ad.'),
    image: imageValidationSchema
      .test(
        'is-present-for-display',
        'An image file is required for Display Ad.',
        (value) => value instanceof File && value.name !== '',
      ) // Check if it's a File object
      .required('Image is required for Display Ad.'), // Make the field itself required
    imgUrl: yup
      .string()
      .url('Invalid existing image URL for Display Ad.')
      .optional()
      .nullable(),
    headline: yup
      .string()
      .required('Headline is required for Display Ad.')
      .max(30, 'Display Ad headline max 30 chars.'),
    descriptionText: yup
      .string()
      .required('Description text is required for Display Ad.')
      .max(90, 'Display Ad description max 90 chars.'),
  });

  const campaignSchema = yup.object({
    title: yup.string().min(3, 'Min 3 chars.').required('Campaign name required.'),
    description: yup.string().min(10, 'Min 10 chars.').required('Description required.'),
    campaignObjective: yup.string().min(3, 'Min 3 chars.').required('Objective required.'),
    networks: yup
      .array()
      .of(yup.string().oneOf(['Search Network', 'Display Network']))
      .min(1, 'Select at least one network.')
      .required('Network required.'),
    adType: yup.string().oneOf(['Search', 'Display']).required('Ad type required.'),
    dailyBudget: yup.number().positive('Must be positive.').required('Budget required.'),
    biddingStrategy: yup.string().required('Bidding strategy required.'),
    targetLocations: yup.string().required('Target locations required.'),
    isABTesting: yup.bool().required(),

    searchAdA: yup.object().when('adType', {
      is: 'Search',
      then: () => searchAdContentSchema.required('Primary Search Ad creative required.'),
      otherwise: () => yup.object().nullable(),
    }),

    searchAdB: yup.object().when(['adType', 'isABTesting'], {
      is: (adType: string, isABTestingValue: boolean) => adType === 'Search' && isABTestingValue,
      then: () => searchAdContentSchema.required('A/B Test Search Ad creative required.'),
      otherwise: () => yup.object().nullable(),
    }),

    displayAdA: yup.object().when('adType', {
      is: 'Display',
      then: () => displayAdContentSchema.required('Primary Display Ad creative required.'),
      otherwise: () => yup.object().nullable(),
    }),

    displayAdB: yup.object().when(['adType', 'isABTesting'], {
      is: (adType: string, isABTestingValue: boolean) => adType === 'Display' && isABTestingValue,
      then: () => displayAdContentSchema.required('A/B Test Display Ad creative required.'),
      otherwise: () => yup.object().nullable(),
    }),

    startDate: yup
      .string()
      .test(
        'valid-start-date',
        'Start date cannot be in the past.',
        (val) =>
          moment(val).isValid() && !moment(val).isBefore(moment().format('YYYY-MM-DD')),
      )
      .required('Start date required.'),

    endDate: yup
      .string()
      .test('valid-end-date', 'Invalid end date.', (val) => moment(val).isValid())
      .test(
        '3-days-after-&-upto-30-days',
        'End date: min 3 days after start, max 30 days.',
        (val, ctx) => {
          const diffDays = moment(val).diff(moment(ctx.parent.startDate), 'days');
          return diffDays >= 3 && diffDays <= 30;
        },
      )
      .required('End date required.'),

    total: yup
      .number()
      .positive('Total must be positive.')
      .required('Total budget calculation required.'),
  }); // --- End Yup Schemas ---
    // Use the useMutation hook
  const {
    mutate,
    isPending,
  } = useMutation({
    mutationFn: (data: FormData) => {
      if (!user) throw new Error('User not authenticated');
      return createAds(data as Partial<CampaignFormData>, user);
    },
    onSuccess: (data: ApiResponse<Campaign>) => {
      // data is the successful response from createCampaignApiCall
      toast.success(data.message || 'Campaign created successfully!');

      formik.resetForm();
      setIsSubmittingForm(false);
    },
    onError: (error) => {
      // error is the Error object thrown from createCampaignApiCall
      toast.error(error.message || 'Failed to create campaign. Please try again.');

      setIsSubmittingForm(false);
    },
  });
  const validateImageFile = (
    file: File,
    {
      expectedAspectRatio, // e.g., 1.91 (for 1.91:1)
      aspectRatioTolerance = 0.02, // Allow small tolerance
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      imageTypeName = 'Image',
    }: {
            expectedAspectRatio?: number,
            aspectRatioTolerance?: number,
            minWidth?: number,
            minHeight?: number,
            maxWidth?: number,
            maxHeight?: number,
            imageTypeName: string,
        },
  ) => {
    return new Promise<void>((resolve, reject) => {
      if (!file) {
        resolve();
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          const actualAspectRatio = width / height;

          if (minWidth && width < minWidth) {
            reject(
              `${imageTypeName} width must be at least ${minWidth}px. Yours is ${width}px.`,
            );
            return;
          }
          if (minHeight && height < minHeight) {
            reject(
              `${imageTypeName} height must be at least ${minHeight}px. Yours is ${height}px.`,
            );
            return;
          }
          if (maxWidth && width > maxWidth) {
            reject(
              `${imageTypeName} width must not exceed ${maxWidth}px. Yours is ${width}px.`,
            );
            return;
          }
          if (maxHeight && height > maxHeight) {
            reject(
              `${imageTypeName} height must not exceed ${maxHeight}px. Yours is ${height}px.`,
            );
            return;
          }
          if (
            expectedAspectRatio &&
            aspectRatioTolerance &&
                        Math.abs(actualAspectRatio - expectedAspectRatio) > aspectRatioTolerance
          ) {
            reject(
              `${imageTypeName} aspect ratio is incorrect. Expected approx ${expectedAspectRatio.toFixed(2)}:1, got ${actualAspectRatio.toFixed(2)}:1.`,
            );
            return;
          }
          resolve(); // Validation passed
        };
        img.onerror = () => {
          reject(
            `Could not load the selected ${imageTypeName.toLowerCase()} file for validation.`,
          );
        };
        if (e.target?.result) {
          img.src = e.target.result.toString();
        } else {
          reject(`Could not read the selected ${imageTypeName.toLowerCase()} file.`);
        }
      };
      reader.onerror = () => {
        reject(`Error reading ${imageTypeName.toLowerCase()} file.`);
      };
      reader.readAsDataURL(file);
    });
  };
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, fieldPath: string, validationConfig: {
    expectedAspectRatio?: number;
    aspectRatioTolerance?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    imageTypeName: string;
  }) => {
    const file = event.currentTarget.files?.[0];
    const imageFieldPath = `${fieldPath}.image`; // e.g., 'displayAdA.image'
    const imgUrlFieldPath = `${fieldPath}.imgUrl`; // e.g., 'displayAdA.imgUrl'

    if (!file) {
      formik.setFieldValue(imageFieldPath, null);
      formik.setFieldValue(
        imgUrlFieldPath,
        formik.initialValues[fieldPath.split('.')[0] as keyof typeof formik.initialValues][fieldPath.split('.')[1] as keyof typeof formik.initialValues]?.imgUrl || '',
      ); // Reset preview
      formik.setFieldError(imageFieldPath, undefined); // Clear previous errors
      return;
    }

    try {
      await validateImageFile(file, validationConfig);
      formik.setFieldValue(imageFieldPath, file); // Set the File object
      // createPreviewEffect will handle setting the imgUrl for preview
      formik.setFieldError(imageFieldPath, undefined); // Clear previous errors on success
    } catch (errorMessage) {
      toast.error(
        typeof errorMessage === 'string' ? errorMessage : 'Image validation failed.',
      );
      formik.setFieldValue(imageFieldPath, null); // Do not set invalid file
      formik.setFieldValue(
        imgUrlFieldPath,
        formik.initialValues[fieldPath.split('.')[0] as keyof typeof formik.initialValues][fieldPath.split('.')[1] as keyof typeof formik.initialValues]?.imgUrl || '',
      ); // Reset preview
      formik.setFieldError(
        imageFieldPath,
        typeof errorMessage === 'string' ? errorMessage : 'Invalid image.',
      );
      event.currentTarget.value = ''; // Clear the file input
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      campaignObjective: '',
      networks: ['Display Network'],
      adType: 'Display',
      dailyBudget: 50,
      biddingStrategy: 'MaximizeClicks',
      targetLocations: '',
      isABTesting: false, // Will be sent as 'isABTestingString'
      searchAdA: JSON.parse(JSON.stringify(defaultSearchAdCreative)), // Will be stringified
      searchAdB: JSON.parse(JSON.stringify(defaultSearchAdCreative)), // Will be stringified
      displayAdA: JSON.parse(JSON.stringify(defaultDisplayAdCreative)), // Will be stringified, image file handled separately
      displayAdB: JSON.parse(JSON.stringify(defaultDisplayAdCreative)), // Will be stringified, image file handled separately
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(7, 'days').format('YYYY-MM-DD'),
      total: 0, // Will be sent as 'totalBudgetString'
    },
    validationSchema: campaignSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      // Append general campaign details
      formData.append('title', values.title);
      formData.append('description', values.description); // Backend maps this to campaignLevelDescription
      formData.append('campaignObjective', values.campaignObjective);
      formData.append('adType', values.adType);
      formData.append('dailyBudget', String(values.dailyBudget)); // Send as string
      formData.append('biddingStrategy', values.biddingStrategy);
      formData.append('targetLocations', values.targetLocations);
      formData.append('isABTestingString', String(values.isABTesting)); // Send boolean as string 'true'/'false'
      formData.append('startDate', values.startDate);
      formData.append('endDate', values.endDate);
      formData.append('totalBudgetString', String(values.total)); // Send as string
      formData.append('networksString', JSON.stringify(values.networks)); // Send array as JSON string

      // Helper function to process and append ad creative data (metadata + file)
      const processAndAppendCreative = (creativeData: Record<string, unknown>, metadataKey: string, imageFileKey: string) => {
        if (creativeData) {
          const metadata = { ...creativeData };
          const imageFileObject = metadata.image; // This is the File object from Formik state or null

          // Remove the 'image' field (which holds the File object) before stringifying the metadata.
          // The 'imgUrl' (string) will remain in 'metadata' if it exists.
          delete metadata.image;

          formData.append(metadataKey, JSON.stringify(metadata));

          // Append the actual image file if it exists
          if (imageFileObject instanceof File) {
            formData.append(imageFileKey, imageFileObject, imageFileObject.name);
          }
        }
      };

      // Process and append ad creatives based on adType
      if (values.adType === 'Search') {
        processAndAppendCreative(values.searchAdA, 'searchAdAString', 'searchAdAImageFile');
        if (values.isABTesting) {
          processAndAppendCreative(
            values.searchAdB,
            'searchAdBString',
            'searchAdBImageFile',
          );
        }
      } else if (values.adType === 'Display') {
        processAndAppendCreative(
          values.displayAdA,
          'displayAdAString',
          'displayAdAImageFile',
        );
        if (values.isABTesting) {
          processAndAppendCreative(
            values.displayAdB,
            'displayAdBString',
            'displayAdBImageFile',
          );
        }
      }

      setIsSubmittingForm(true);

      mutate(formData);
    },
  });

  // --- Helper Functions for Manual Array Management ---
  const handleAddItemToFormikArray = (arrayPath: string, newItem: Record<string, unknown>) => {
    const currentArray = formik.getFieldMeta(arrayPath).value || []; // Get current array from formik values
    formik.setFieldValue(arrayPath, [...currentArray, newItem]);
  };

  const handleRemoveItemFromFormikArray = (arrayPath: string, indexToRemove: number) => {
    const currentArray = formik.getFieldMeta(arrayPath).value || [];
    formik.setFieldValue(
      arrayPath,
      currentArray.filter((_: unknown, index: number) => index !== indexToRemove),
    );
  };
    // --- End Helper Functions ---

  // --- useEffects ---

  const calculateTotal = useCallback(() => {
    const { dailyBudget, startDate, endDate } = formik.values;
    if (
      dailyBudget > 0 &&
            startDate &&
            endDate &&
            moment(endDate).isSameOrAfter(moment(startDate))
    ) {
      const days = moment(endDate).diff(moment(startDate), 'days') + 1;
      formik.setFieldValue('total', dailyBudget * days);
    } else {
      formik.setFieldValue('total', 0);
    }
  }, [formik.values.dailyBudget, formik.values.startDate, formik.values.endDate, formik.setFieldValue, formik]);

  useEffect(() => {
    calculateTotal();
  }, [
    formik.values.startDate,
    formik.values.endDate,
    formik.values.dailyBudget,
    calculateTotal,
  ]);

  const handleAdTypeChange = (event: React.MouseEvent<HTMLElement>, newAdType: string) => {
    if (newAdType !== null && formik.values.adType !== newAdType) {
      // check if value changed
      formik.setFieldValue('adType', newAdType);
      if (newAdType === 'Search' && !formik.values.networks.includes('Search Network')) {
        formik.setFieldValue('networks', ['Search Network']);
      } else if (
        newAdType === 'Display' &&
                !formik.values.networks.includes('Display Network')
      ) {
        formik.setFieldValue('networks', ['Display Network']);
      }
      // Reset the non-active ad type's data to default when switching
      if (newAdType === 'Search') {
        formik.setFieldValue(
          'displayAdA',
          JSON.parse(JSON.stringify(defaultDisplayAdCreative)),
        );
        formik.setFieldValue(
          'displayAdB',
          JSON.parse(JSON.stringify(defaultDisplayAdCreative)),
        );
      } else if (newAdType === 'Display') {
        formik.setFieldValue(
          'searchAdA',
          JSON.parse(JSON.stringify(defaultSearchAdCreative)),
        );
        formik.setFieldValue(
          'searchAdB',
          JSON.parse(JSON.stringify(defaultSearchAdCreative)),
        );
      }
    }
  };

  if (isTokenMissing) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Create New Campaign</h1>
        <p style={{ color: 'red', fontSize: '1.1em', lineHeight: '1.6' }}>
                    An access token is required to create a new campaign.
          <br />
                    Please ensure your account (e.g., Google Ads) is connected in the settings.
          <br />
                    You can check your connection status on the{' '}
          <NextLink href="/admin/ads" passHref legacyBehavior>
            <a
              style={{
                color: 'blue',
                textDecoration: 'underline',
                fontWeight: 'bold',
              }}
            >
                            Ads Sync page
            </a>
          </NextLink>
                    .
        </p>
      </div>
    );
  }

  if (isPending && !isTokenMissing) {
    return <CustomLoaderForComponent />;
  }

  return (
    <>
      {isSubmittingForm && <CustomLoaderForComponent />}
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ pb: 5 }}>
          {' '}
          {/* Header Box */}
          <Box
            sx={{
              display: isLargeScreen ? 'flex' : 'block',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: isLargeScreen ? 0 : 2 }}>
              <NextLink href="/dashboard" passHref legacyBehavior>
                <MuiLink sx={{ textDecoration: 'none' }} color="inherit">
                  <Typography
                    variant="h6"
                    sx={{ color: '#777777', fontWeight: '700' }}
                  >
                                        Dashboard
                  </Typography>
                </MuiLink>
              </NextLink>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.primary.main, fontWeight: '700' }}
              >
                                New Campaign
              </Typography>
            </Breadcrumbs>
          </Box>
          <Typography component="span">Create your Google Ads campaign.</Typography>
        </Box>

        <Grid
          container
          display="flex"
          justifyContent="space-between"
          spacing={isLargeScreen ? 3 : 2}
        >
          <Grid item xs={12} lg={8}>
            {' '}
            {/* Left Column: Form Sections */}
            <Grid container direction="column" spacing={3}>
              {/* Campaign Details Card */}
              <Grid item>
                <Card sx={{ backgroundColor: cardBgColor, p: 3 }}>
                  <DescriptionTitle variant="h5" marginY={1}>
                                        Campaign Details
                  </DescriptionTitle>
                  <DescriptionText>
                                        Name your campaign and set its objective.
                  </DescriptionText>
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Campaign Name"
                    placeholder="e.g., Summer Sale Q3"
                    sx={{ mt: 3 }}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Campaign Description"
                    multiline
                    rows={3}
                    sx={{ my: 2 }}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description &&
                                            Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                  <TextField
                    fullWidth
                    id="campaignObjective"
                    name="campaignObjective"
                    label="Campaign Objective"
                    placeholder="e.g., Website Traffic, Leads"
                    sx={{ my: 2 }}
                    value={formik.values.campaignObjective}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.campaignObjective &&
                                            Boolean(formik.errors.campaignObjective)
                    }
                    helperText={
                      formik.touched.campaignObjective &&
                                            formik.errors.campaignObjective
                    }
                  />
                </Card>
              </Grid>

              {/* Type, Networks & Targeting Card */}
              <Grid item>
                <Card sx={{ backgroundColor: cardBgColor, p: 3 }}>
                  <DescriptionTitle variant="h5" marginY={1}>
                                        Type, Networks & Targeting
                  </DescriptionTitle>
                  <DescriptionText>
                                        Choose ad type, where your ads will appear, and who you want
                                        to reach.
                  </DescriptionText>
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 3, fontWeight: 'medium' }}
                  >
                                        Select Ad Type:
                  </Typography>
                  <ToggleButtonGroup
                    value={formik.values.adType}
                    exclusive
                    onChange={handleAdTypeChange}
                    aria-label="ad type"
                    sx={{
                      mt: 1,
                      mb:
                                                formik.touched.adType && formik.errors.adType
                                                  ? 0
                                                  : 2,
                    }}
                  >
                    <ToggleButton value="Display" aria-label="display ad">
                                            Display Ad
                    </ToggleButton>
                    <ToggleButton value="Search" aria-label="search ad">
                                            Search Ad
                    </ToggleButton>
                  </ToggleButtonGroup>
                  {formik.touched.adType && formik.errors.adType && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ display: 'block', mb: 1 }}
                    >
                      {formik.errors.adType}
                    </Typography>
                  )}
                  <Typography
                    variant="subtitle1"
                    sx={{ mt: 2, fontWeight: 'medium' }}
                  >
                                        Select Networks:
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      justifyContent: 'start',
                      gap: 1,
                      mt: 0,
                    }}
                  >
                    <CustomTab
                      label="Search Network"
                      value="Search Network"
                      formik={formik}
                    />
                    <CustomTab
                      label="Display Network"
                      value="Display Network"
                      formik={formik}
                    />
                  </Box>
                  {formik.touched.networks && formik.errors.networks && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {formik.errors.networks}
                    </Typography>
                  )}
                  <TextField
                    fullWidth
                    id="targetLocations"
                    name="targetLocations"
                    label="Target Locations"
                    placeholder="e.g., New York, London, Canada"
                    sx={{ mt: 3 }}
                    value={formik.values.targetLocations}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.targetLocations &&
                                            Boolean(formik.errors.targetLocations)
                    }
                    helperText={
                      (formik.touched.targetLocations &&
                                                formik.errors.targetLocations) ||
                                            'Enter locations separated by commas.'
                    }
                  />
                </Card>
              </Grid>

              {/* Budget & Bidding Card */}
              <Grid item>
                <Card sx={{ backgroundColor: cardBgColor, p: 3 }}>
                  <DescriptionTitle variant="h5" marginY={1}>
                                        Budget & Bidding
                  </DescriptionTitle>
                  <TextField
                    fullWidth
                    id="dailyBudget"
                    name="dailyBudget"
                    label="Daily Budget"
                    type="number"
                    placeholder="e.g., 50"
                    sx={{ mt: 2, mb: 2 }}
                    value={formik.values.dailyBudget}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.dailyBudget &&
                                            Boolean(formik.errors.dailyBudget)
                    }
                    helperText={
                      formik.touched.dailyBudget && formik.errors.dailyBudget
                    }
                  />
                  <TextField
                    fullWidth
                    id="biddingStrategy"
                    name="biddingStrategy"
                    label="Bidding Strategy"
                    placeholder="e.g., MaximizeClicks, ManualCPC"
                    sx={{ mb: 2 }}
                    value={formik.values.biddingStrategy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.biddingStrategy &&
                                            Boolean(formik.errors.biddingStrategy)
                    }
                    helperText={
                      formik.touched.biddingStrategy &&
                                            formik.errors.biddingStrategy
                    }
                  />
                </Card>
              </Grid>

              {/* Ad Setup Card */}
              <Grid item>
                <Card sx={{ backgroundColor: cardBgColor, p: 3 }}>
                  <DescriptionTitle variant="h5" marginY={1}>
                                        Ad Setup ({formik.values.adType} Ad)
                  </DescriptionTitle>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={2}
                    borderBottom={`1px solid ${theme.palette.divider}`}
                    pb={2}
                    mb={3}
                  >
                    <Box>
                      <DescriptionTitle variant="h6" marginY={0}>
                                                A/B Testing
                      </DescriptionTitle>
                      <DescriptionText>
                                                Test two ad creatives to see which performs better.
                      </DescriptionText>
                    </Box>
                    <Switch
                      checked={formik.values.isABTesting}
                      name="isABTesting"
                      onChange={formik.handleChange}
                    />
                  </Box>

                  {/* === DISPLAY AD FIELDS === */}
                  {formik.values.adType === 'Display' && (
                    <>
                      {/* Display Ad A */}
                      <Box mb={formik.values.isABTesting ? 4 : 0}>
                        <DescriptionTitle variant="h6" marginY={1}>
                          {formik.values.isABTesting
                            ? 'Display Ad Creative A'
                            : 'Display Ad Creative'}
                        </DescriptionTitle>
                        <TextField
                          fullWidth
                          name="displayAdA.finalUrl"
                          label="Final URL"
                          value={formik.values.displayAdA.finalUrl}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={Boolean(
                            formik.touched.displayAdA &&
                                                        (formik.touched.displayAdA as unknown as DisplayAdCreative).finalUrl &&
                                                        Boolean(
                                                          formik.errors.displayAdA &&
                                                            (formik.errors.displayAdA as unknown as DisplayAdCreative).finalUrl,
                                                        ),
                          )}
                          helperText={
                            formik.touched.displayAdA &&
                                                        (formik.touched.displayAdA as unknown as DisplayAdCreative).finalUrl &&
                                                        (formik.errors.displayAdA as unknown as DisplayAdCreative).finalUrl
                          }
                          sx={{ mt: 1, mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          name="displayAdA.headline"
                          label="Headline"
                          value={formik.values.displayAdA.headline}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={Boolean(
                            formik.touched.displayAdA &&
                                                        (formik.touched.displayAdA as unknown as DisplayAdCreative).headline &&
                                                        Boolean(
                                                          formik.errors.displayAdA &&
                                                            (formik.errors.displayAdA as unknown as DisplayAdCreative).headline,
                                                        ),
                          )}
                          helperText={
                            formik.touched.displayAdA &&
                                                        (formik.touched.displayAdA as unknown as DisplayAdCreative).headline &&
                                                        (formik.errors.displayAdA as unknown as DisplayAdCreative).headline
                          }
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          name="displayAdA.descriptionText"
                          label="Description Text"
                          value={formik.values.displayAdA.descriptionText}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={Boolean(
                            formik.touched.displayAdA &&
                                                            (formik.touched.displayAdA as unknown as DisplayAdCreative).descriptionText &&
                                                        Boolean(
                                                          formik.errors.displayAdA &&
                                                            (formik.errors.displayAdA as unknown as DisplayAdCreative).descriptionText,
                                                        ),
                          )}
                          helperText={
                            formik.touched.displayAdA &&
                                                            (formik.touched.displayAdA as unknown as DisplayAdCreative).descriptionText &&
                                                        (formik.errors.displayAdA as unknown as DisplayAdCreative).descriptionText
                          }
                          sx={{ mb: 2 }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ mt: 1, fontWeight: 'medium' }}
                        >
                                                    Image
                        </Typography>

                        <UploadButton
                          as="label"
                          sx={{
                            mb:
                                                            formik.touched.displayAdA &&
                                                            (formik.touched.displayAdA as unknown as DisplayAdCreative).image &&
                                                            formik.errors.displayAdA &&
                                                            (formik.errors.displayAdA as unknown as DisplayAdCreative).image
                                                              ? 0.5
                                                              : 2,
                          }}
                        >
                          {formik.values.displayAdA.image instanceof File
                            ? 'Change Marketing Image'
                            : 'Upload Marketing Image'}
                          <input
                            type="file"
                            hidden
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(event, 'displayAdA', {
                                expectedAspectRatio: 1.91 / 1,
                                minWidth: 600,
                                minHeight: 314,
                                imageTypeName: 'Marketing Image',
                              })
                            }
                          />
                        </UploadButton>
                        {typeof formik.touched.displayAdA === 'object' &&
                                                    formik.touched.displayAdA !== null &&
                                                    (formik.touched.displayAdA as unknown as DisplayAdCreative).image &&
                                                    typeof formik.errors.displayAdA === 'object' &&
                                                    formik.errors.displayAdA !== null &&
                                                    (formik.errors.displayAdA as unknown as DisplayAdCreative).image && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {String(
                              (formik.errors.displayAdA as unknown as DisplayAdCreative).image,
                            )}
                          </Typography>
                        )}
                      </Box>
                      {/* Display Ad B */}
                      {formik.values.isABTesting && (
                        <Box
                          borderTop={`1px solid ${theme.palette.divider}`}
                          pt={3}
                        >
                          <DescriptionTitle variant="h6" marginY={1}>
                                                        Display Ad Creative B
                          </DescriptionTitle>
                          <TextField
                            fullWidth
                            name="displayAdB.finalUrl"
                            label="Final URL (Ad B)"
                            value={formik.values.displayAdB.finalUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(
                              formik.touched.displayAdB &&
                                                            (formik.touched.displayAdB as unknown as DisplayAdCreative).finalUrl &&
                                                            Boolean(
                                                              formik.errors.displayAdB &&
                                                                (formik.errors.displayAdB as unknown as DisplayAdCreative).finalUrl,
                                                            ),
                            )}
                            helperText={
                              formik.touched.displayAdB &&
                                                            (formik.touched.displayAdB as unknown as DisplayAdCreative).finalUrl &&
                                                            (formik.errors.displayAdB as unknown as DisplayAdCreative).finalUrl
                            }
                            sx={{ mt: 1, mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            name="displayAdB.headline"
                            label="Headline (Ad B)"
                            value={formik.values.displayAdB.headline}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(
                              formik.touched.displayAdB &&
                                                            (formik.touched.displayAdB as unknown as DisplayAdCreative).headline &&
                                                            Boolean(
                                                              formik.errors.displayAdB &&
                                                                (formik.errors.displayAdB as unknown as DisplayAdCreative).headline,
                                                            ),
                            )}
                            helperText={
                              formik.touched.displayAdB &&
                                                            (formik.touched.displayAdB as unknown as DisplayAdCreative).headline &&
                                                            (formik.errors.displayAdB as unknown as DisplayAdCreative).headline
                            }
                            sx={{ mb: 2 }}
                          />
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            name="displayAdB.descriptionText"
                            label="Description (Ad B)"
                            value={
                              formik.values.displayAdB.descriptionText
                            }
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(
                              formik.touched.displayAdB &&
                                                            (formik.touched.displayAdB as unknown as DisplayAdCreative).descriptionText &&
                                                            Boolean(
                                                              formik.errors.displayAdB &&
                                                                    (formik.errors.displayAdB as unknown as DisplayAdCreative).descriptionText,
                                                            ),
                            )}
                            helperText={
                              formik.touched.displayAdB &&
                                                            (formik.touched.displayAdB as unknown as DisplayAdCreative).descriptionText &&
                                                            (formik.errors.displayAdB as unknown as DisplayAdCreative).descriptionText
                            }
                            sx={{ mb: 2 }}
                          />
                          <Typography
                            variant="subtitle2"
                            sx={{ mt: 1, fontWeight: 'medium' }}
                          >
                                                        Image (Ad B)
                          </Typography>
                          {/* {formik.values.displayAdB.imgUrl && <Box component="img" src={formik.values.displayAdB.imgUrl} alt="Preview Display Ad B" sx={{ maxWidth: '100%', height: 'auto', mt: 1, mb: 1, border: `1px solid ${theme.palette.divider}` }} />} */}
                          {/* <UploadButton component="label" sx={{ mb: formik.touched.displayAdB?.image && formik.errors.displayAdB?.image ? 0.5 : 2 }}>
                            {formik.values.displayAdB.image instanceof File ? "Change Ad B Image" : "Upload Ad B Image"}
                            <input type="file" hidden accept="image/png,image/jpeg,image/jpg" onChange={(event: React.MouseEvent<HTMLElement>) => { const file = event.currentTarget.files[0]; formik.setFieldValue('displayAdB.image', file || null); }} />
                          </UploadButton> */}
                          <UploadButton
                            as="label"
                            sx={{
                              mb:
                                                                formik.touched.displayAdA &&
                                                                (formik.touched.displayAdA as unknown as DisplayAdCreative).image &&
                                                                formik.errors.displayAdA &&
                                                                (formik.errors.displayAdA as unknown as DisplayAdCreative).image
                                                                  ? 0.5
                                                                  : 2,
                            }}
                          >
                            {formik.values.displayAdB.image instanceof
                                                        File
                              ? 'Change Marketing Image'
                              : 'Upload Marketing Image'}
                            <input
                              type="file"
                              hidden
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                handleImageChange(
                                  event,
                                  'displayAdB',
                                  {
                                    expectedAspectRatio:
                                                                            1.91 / 1,
                                    minWidth: 600,
                                    minHeight: 314,
                                    imageTypeName:
                                                                            'Marketing Image',
                                  },
                                )
                              }
                            />
                          </UploadButton>
                          {formik.touched.displayAdB &&
                                                        (formik.touched.displayAdB as unknown as DisplayAdCreative).image &&
                                                        formik.errors.displayAdB &&
                                                        (formik.errors.displayAdB as unknown as DisplayAdCreative).image && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              {String(
                                (formik.errors.displayAdB as unknown as DisplayAdCreative).image,
                              )}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </>
                  )}

                  {/* === SEARCH AD FIELDS (Using manual array management) === */}
                  {formik.values.adType === 'Search' && (
                    <>
                      <Box mb={formik.values.isABTesting ? 4 : 0}>
                        <DescriptionTitle variant="h6" marginY={1}>
                          {formik.values.isABTesting
                            ? 'Search Ad Creative A'
                            : 'Search Ad Creative'}
                        </DescriptionTitle>
                        <TextField
                          fullWidth
                          name="searchAdA.finalUrl"
                          label="Final URL"
                          value={formik.values.searchAdA.finalUrl}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={Boolean(
                            formik.touched.searchAdA &&
                                                        (formik.touched.searchAdA as unknown as SearchAdCreative).finalUrl &&
                                                        Boolean(
                                                          formik.errors.searchAdA &&
                                                            (formik.errors.searchAdA as unknown as SearchAdCreative).finalUrl,
                                                        ),
                          )}
                          helperText={
                            formik.touched.searchAdA &&
                                                        (formik.touched.searchAdA as unknown as SearchAdCreative).finalUrl &&
                                                        (formik.errors.searchAdA as unknown as SearchAdCreative).finalUrl
                          }
                          sx={{ mt: 1, mb: 2 }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ mt: 1, fontWeight: 'medium' }}
                        >
                                                    Image (Optional)
                        </Typography>
                        {/* {formik.values.searchAdA.imgUrl && <Box component="img" src={formik.values.searchAdA.imgUrl} alt="Preview Search Ad A" sx={{ maxWidth: '100%', height: 'auto', mt: 1, mb: 1, border: `1px solid ${theme.palette.divider}` }} />} */}
                        <UploadButton
                          as="label"
                          sx={{
                            mb:
                                                            formik.touched.searchAdA &&
                                                            (formik.touched.searchAdA as unknown as SearchAdCreative).image &&
                                                            formik.errors.searchAdA &&
                                                            (formik.errors.searchAdA as unknown as SearchAdCreative).image
                                                              ? 0.5
                                                              : 2,
                          }}
                        >
                          {formik.values.searchAdA.image instanceof File
                            ? 'Change Ad A Image'
                            : 'Upload Ad A Image'}
                          <input
                            type="file"
                            hidden
                            accept="image/png,image/jpeg,image/jpg"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                              handleImageChange(event, 'searchAdA', {
                                // Define appropriate validation for search ad images if specific rules apply
                                // For now, just basic type check is implicitly handled by Yup's imageValidationSchema
                                // You might add recommended aspect ratios/dimensions here if Google provides them for search image assets
                                imageTypeName: 'Search Ad Image',
                              })
                            }
                          />
                        </UploadButton>
                        {formik.touched.searchAdA &&
                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).image &&
                                                    formik.errors.searchAdA &&
                                                    (formik.errors.searchAdA as unknown as SearchAdCreative).image && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {String(
                              (formik.errors.searchAdA as unknown as SearchAdCreative).image,
                            )}
                          </Typography>
                        )}

                        <Typography
                          variant="subtitle2"
                          sx={{ mt: 1, fontWeight: 'medium' }}
                        >
                                                    Headlines (Min 2, Max 5)
                        </Typography>
                        {formik.values.searchAdA.headlines.map(
                          (headline: HeadlineItem, index: number) => (
                            <Box
                              key={`searchAdA-headline-${index}`}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <TextField
                                fullWidth
                                name={`searchAdA.headlines[${index}].text`}
                                label={`Headline ${index + 1}`}
                                value={headline.text}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(
                                  formik.touched.searchAdA
                                                                        &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).headlines &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).headlines[index] &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).headlines[index].text &&
                                                                    Boolean(
                                                                      formik.errors.searchAdA
                                                                        &&
                                                                        (formik.errors.searchAdA as unknown as SearchAdCreative).headlines &&
                                                                        (formik.errors.searchAdA as unknown as SearchAdCreative).headlines[index] &&
                                                                        (formik.errors.searchAdA as unknown as SearchAdCreative).headlines[index].text,
                                                                    ),
                                )}
                                helperText={
                                  formik.touched.searchAdA
                                                                        &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).headlines &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).headlines[index] &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).headlines[index].text &&
                                                                    (formik.errors.searchAdA as unknown as SearchAdCreative).headlines[index].text
                                }
                              />
                              {formik.values.searchAdA.headlines
                                .length > 2 && (
                                <IconButton
                                  onClick={() =>
                                    handleRemoveItemFromFormikArray(
                                      'searchAdA.headlines',
                                      index,
                                    )
                                  }
                                  size="small"
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              )}
                            </Box>
                          ),
                        )}
                        {formik.values.searchAdA.headlines.length < 5 && (
                          <Button
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() =>
                              handleAddItemToFormikArray(
                                'searchAdA.headlines',
                                { text: '' },
                              )
                            }
                            sx={{ mt: 0.5, textTransform: 'none' }}
                          >
                                                        Add Ad A Headline
                          </Button>
                        )}
                        {formik.errors.searchAdA &&
                                                    (formik.errors.searchAdA as unknown as SearchAdCreative).headlines &&
                                                    typeof (formik.errors.searchAdA as unknown as SearchAdCreative).headlines ===
                                                        'string' && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {String(
                              (formik.errors.searchAdA as unknown as SearchAdCreative).headlines,
                            )}
                          </Typography>
                        )}

                        <Typography
                          variant="subtitle2"
                          sx={{ mt: 2, fontWeight: 'medium' }}
                        >
                                                    Descriptions (Min 1, Max 4)
                        </Typography>
                        {formik.values.searchAdA.descriptions.map(
                          (description: DescriptionItem, index: number) => (
                            <Box
                              key={`searchAdA-description-${index}`}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                name={`searchAdA.descriptions[${index}].text`}
                                label={`Description ${index + 1}`}
                                value={description.text}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(
                                  formik.touched.searchAdA
                                                                        &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).descriptions &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).descriptions[index] &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).descriptions[index].text &&
                                                                    Boolean(
                                                                      formik.errors.searchAdA
                                                                        &&
                                                                        (formik.errors.searchAdA as unknown as SearchAdCreative).descriptions &&
                                                                        (formik.errors.searchAdA as unknown as SearchAdCreative).descriptions[index] &&
                                                                        (formik.errors.searchAdA as unknown as SearchAdCreative).descriptions[index].text,
                                                                    ),
                                )}
                                helperText={
                                  formik.touched.searchAdA
                                                                        &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).descriptions &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).descriptions[index] &&
                                                                    (formik.touched.searchAdA as unknown as SearchAdCreative).descriptions[index].text &&
                                                                    (formik.errors.searchAdA as unknown as SearchAdCreative).descriptions[index].text
                                }
                              />
                              {formik.values.searchAdA.descriptions
                                .length > 1 && (
                                <IconButton
                                  onClick={() =>
                                    handleRemoveItemFromFormikArray(
                                      'searchAdA.descriptions',
                                      index,
                                    )
                                  }
                                  size="small"
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              )}
                            </Box>
                          ),
                        )}
                        {formik.values.searchAdA.descriptions.length <
                                                    4 && (
                          <Button
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() =>
                              handleAddItemToFormikArray(
                                'searchAdA.descriptions',
                                { text: '' },
                              )
                            }
                            sx={{ mt: 0.5, textTransform: 'none' }}
                          >
                                                        Add Ad A Description
                          </Button>
                        )}
                        {formik.errors.searchAdA &&
                                                    (formik.errors.searchAdA as unknown as SearchAdCreative).descriptions &&
                                                    typeof (formik.errors.searchAdA as unknown as SearchAdCreative).descriptions ===
                                                        'string' && (
                          <Typography
                            color="error"
                            variant="caption"
                            sx={{ display: 'block', mt: 0.5 }}
                          >
                            {String(
                              (formik.errors.searchAdA as unknown as SearchAdCreative).descriptions,
                            )}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <TextField
                            fullWidth
                            name="searchAdA.path1"
                            label="Display Path 1 (Optional)"
                            value={formik.values.searchAdA.path1}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(
                              formik.touched.searchAdA &&
                                                            (formik.touched.searchAdA as unknown as SearchAdCreative).path1 &&
                                                            Boolean(
                                                              formik.errors.searchAdA &&
                                                                (formik.errors.searchAdA as unknown as SearchAdCreative).path1,
                                                            ),
                            )}
                            helperText={
                              formik.touched.searchAdA &&
                                                            (formik.touched.searchAdA as unknown as SearchAdCreative).path1 &&
                                                            (formik.errors.searchAdA as unknown as SearchAdCreative).path1
                            }
                            sx={{ flex: 1 }}
                            placeholder="path1"
                          />
                          <TextField
                            fullWidth
                            name="searchAdA.path2"
                            label="Display Path 2 (Optional)"
                            value={formik.values.searchAdA.path2}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(
                              formik.touched.searchAdA &&
                                                            (formik.touched.searchAdA as unknown as SearchAdCreative).path2 &&
                                                            Boolean(
                                                              formik.errors.searchAdA &&
                                                                (formik.errors.searchAdA as unknown as SearchAdCreative).path2,
                                                            ),
                            )}
                            helperText={
                              formik.touched.searchAdA &&
                                                            (formik.touched.searchAdA as unknown as SearchAdCreative).path2 &&
                                                            (formik.errors.searchAdA as unknown as SearchAdCreative).path2
                            }
                            sx={{ flex: 1 }}
                            placeholder="path2"
                          />
                        </Box>
                      </Box>

                      {formik.values.isABTesting && (
                        <Box
                          borderTop={`1px solid ${theme.palette.divider}`}
                          pt={3}
                          mt={3}
                        >
                          <DescriptionTitle variant="h6" marginY={1}>
                                                        Search Ad Creative B (A/B Test)
                          </DescriptionTitle>
                          <TextField
                            fullWidth
                            name="searchAdB.finalUrl"
                            label="Final URL (Ad B)"
                            value={formik.values.searchAdB.finalUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(
                              formik.touched.searchAdB &&
                                                            (formik.touched.searchAdB as unknown as SearchAdCreative).finalUrl &&
                                                            Boolean(
                                                              formik.errors.searchAdB &&
                                                                (formik.errors.searchAdB as unknown as SearchAdCreative).finalUrl,
                                                            ),
                            )}
                            helperText={
                              formik.touched.searchAdB &&
                                                            (formik.touched.searchAdB as unknown as SearchAdCreative).finalUrl &&
                                                            (formik.errors.searchAdB as unknown as SearchAdCreative).finalUrl
                            }
                            sx={{ mt: 1, mb: 2 }}
                            placeholder="https://www.example.com/variation"
                          />
                          <Typography
                            variant="subtitle2"
                            sx={{ mt: 1, fontWeight: 'medium' }}
                          >
                                                        Image (Optional - Ad B)
                          </Typography>
                          {/* {formik.values.searchAdB.imgUrl && <Box component="img" src={formik.values.searchAdB.imgUrl} alt="Preview Search Ad B" sx={{ maxWidth: '100%', height: 'auto', mt: 1, mb: 1, border: `1px solid ${theme.palette.divider}` }} />} */}
                          <UploadButton
                            as="label"
                            sx={{
                              mb:
                                                                formik.touched.searchAdB &&
                                                                (formik.touched.searchAdB as unknown as SearchAdCreative).image &&
                                                                formik.errors.searchAdB &&
                                                                (formik.errors.searchAdB as unknown as SearchAdCreative).image
                                                                  ? 0.5
                                                                  : 2,
                            }}
                          >
                            {formik.values.searchAdB.image instanceof
                                                        File
                              ? 'Change Ad B Image'
                              : 'Upload Ad B Image'}
                            <input
                              type="file"
                              hidden
                              accept="image/png,image/jpeg,image/jpg"
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                const file =
                                                                    event.currentTarget.files?.[0];
                                formik.setFieldValue(
                                  'searchAdB.image',
                                  file || null,
                                );
                              }}
                            />
                          </UploadButton>
                          {formik.touched.searchAdB &&
                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).image &&
                                                        formik.errors.searchAdB &&
                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).image && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              {String(
                                (formik.errors.searchAdB as unknown as SearchAdCreative).image,
                              )}
                            </Typography>
                          )}

                          <Typography
                            variant="subtitle2"
                            sx={{ mt: 1, fontWeight: 'medium' }}
                          >
                                                        Headlines (Ad B)
                          </Typography>
                          {formik.values.searchAdB.headlines.map(
                            (headline: HeadlineItem, index: number) => (
                              <Box
                                key={`searchAdB-headline-${index}`}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 1,
                                }}
                              >
                                <TextField
                                  fullWidth
                                  name={`searchAdB.headlines[${index}].text`}
                                  label={`Headline ${index + 1}`}
                                  value={headline.text}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={Boolean(
                                    formik.touched.searchAdB
                                                                            &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).headlines &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).headlines[index] &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).headlines[index].text &&
                                                                        Boolean(
                                                                          formik.errors.searchAdB
                                                                                &&
                                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).headlines &&
                                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).headlines[index] &&
                                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).headlines[index].text,
                                                                        ),
                                  )}
                                  helperText={
                                    formik.touched.searchAdB
                                                                            &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).headlines &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).headlines[index] &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).headlines[index].text &&
                                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).headlines[index].text
                                  }
                                />
                                {formik.values.searchAdB.headlines
                                  .length > 2 && (
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveItemFromFormikArray(
                                        'searchAdB.headlines',
                                        index,
                                      )
                                    }
                                    size="small"
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                )}
                              </Box>
                            ),
                          )}
                          {formik.values.searchAdB.headlines.length <
                                                        5 && (
                            <Button
                              startIcon={<AddCircleOutlineIcon />}
                              onClick={() =>
                                handleAddItemToFormikArray(
                                  'searchAdB.headlines',
                                  { text: '' },
                                )
                              }
                              sx={{ mt: 0.5, textTransform: 'none' }}
                            >
                                                            Add Ad B Headline
                            </Button>
                          )}
                          {formik.errors.searchAdB &&
                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).headlines &&
                                                        typeof (formik.errors.searchAdB as unknown as SearchAdCreative).headlines ===
                                                            'string' && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              {String(
                                (formik.errors.searchAdB as unknown as SearchAdCreative).headlines,
                              )}
                            </Typography>
                          )}

                          <Typography
                            variant="subtitle2"
                            sx={{ mt: 2, fontWeight: 'medium' }}
                          >
                                                        Descriptions (Ad B)
                          </Typography>
                          {formik.values.searchAdB.descriptions.map(
                            (description: DescriptionItem, index: number) => (
                              <Box
                                key={`searchAdB-description-${index}`}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 1,
                                }}
                              >
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  name={`searchAdB.descriptions[${index}].text`}
                                  label={`Description ${index + 1}`}
                                  value={description.text}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  error={Boolean(
                                    formik.touched.searchAdB
                                                                            &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).descriptions &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).descriptions[index] &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).descriptions[index].text &&
                                                                        Boolean(
                                                                          formik.errors.searchAdB
                                                                                &&
                                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).descriptions &&
                                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).descriptions[index] &&
                                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).descriptions[index].text,
                                                                        ),
                                  )}
                                  helperText={
                                    formik.touched.searchAdB
                                                                            &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).descriptions &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).descriptions[index] &&
                                                                        (formik.touched.searchAdB as unknown as SearchAdCreative).descriptions[index].text &&
                                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).descriptions[index].text
                                  }
                                />
                                {formik.values.searchAdB
                                  .descriptions.length > 1 && (
                                  <IconButton
                                    onClick={() =>
                                      handleRemoveItemFromFormikArray(
                                        'searchAdB.descriptions',
                                        index,
                                      )
                                    }
                                    size="small"
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                )}
                              </Box>
                            ),
                          )}
                          {formik.values.searchAdB.descriptions.length <
                                                        4 && (
                            <Button
                              startIcon={<AddCircleOutlineIcon />}
                              onClick={() =>
                                handleAddItemToFormikArray(
                                  'searchAdB.descriptions',
                                  { text: '' },
                                )
                              }
                              sx={{ mt: 0.5, textTransform: 'none' }}
                            >
                                                            Add Ad B Description
                            </Button>
                          )}
                          {formik.errors.searchAdB &&
                                                        (formik.errors.searchAdB as unknown as SearchAdCreative).descriptions &&
                                                        typeof (formik.errors.searchAdB as unknown as SearchAdCreative).descriptions ===
                                                            'string' && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ display: 'block', mt: 0.5 }}
                            >
                              {String(
                                (formik.errors.searchAdB as unknown as SearchAdCreative).descriptions,
                              )}
                            </Typography>
                          )}

                          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <TextField
                              fullWidth
                              name="searchAdB.path1"
                              label="Display Path 1 (Ad B)"
                              value={formik.values.searchAdB.path1}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={Boolean(
                                formik.touched.searchAdB &&
                                                                (formik.touched.searchAdB as unknown as SearchAdCreative).path1 &&
                                                                Boolean(
                                                                  formik.errors.searchAdB &&
                                                                    (formik.errors.searchAdB as unknown as SearchAdCreative).path1,
                                                                ),
                              )}
                              helperText={
                                formik.touched.searchAdB &&
                                                                (formik.touched.searchAdB as unknown as SearchAdCreative).path1 &&
                                                                (formik.errors.searchAdB as unknown as SearchAdCreative).path1
                              }
                              sx={{ flex: 1 }}
                              placeholder="path1"
                            />
                            <TextField
                              fullWidth
                              name="searchAdB.path2"
                              label="Display Path 2 (Ad B)"
                              value={formik.values.searchAdB.path2}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={Boolean(
                                formik.touched.searchAdB &&
                                                                (formik.touched.searchAdB as unknown as SearchAdCreative).path2 &&
                                                                Boolean(
                                                                  formik.errors.searchAdB &&
                                                                    (formik.errors.searchAdB as unknown as SearchAdCreative).path2,
                                                                ),
                              )}
                              helperText={
                                formik.touched.searchAdB &&
                                                                (formik.touched.searchAdB as unknown as SearchAdCreative).path2 &&
                                                                (formik.errors.searchAdB as unknown as SearchAdCreative).path2
                              }
                              sx={{ flex: 1 }}
                              placeholder="path2"
                            />
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                </Card>
              </Grid>

              {/* Schedule Card */}
              <Grid item>
                <Card sx={{ backgroundColor: cardBgColor, p: 3 }}>
                  <DescriptionTitle variant="h5" marginY={1}>
                                        Schedule
                  </DescriptionTitle>
                  <DescriptionText>
                                        Set your campaign start and end dates.
                  </DescriptionText>
                  <Box
                    display="flex"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    gap={isLargeScreen ? 3 : 2}
                    mt={2}
                    flexDirection={isLargeScreen ? 'row' : 'column'}
                  >
                    <Box width="100%">
                      <DescriptionTitle variant="h6" marginY={1}>
                                                Start Date
                      </DescriptionTitle>
                      <TextField
                        fullWidth
                        id="startDate"
                        name="startDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.startDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newStartDate = moment(
                            e.target.value,
                          ).format('YYYY-MM-DD');
                          formik.setFieldValue('startDate', newStartDate);
                          if (
                            moment(formik.values.endDate).isBefore(
                              moment(newStartDate).add(3, 'days'),
                            )
                          ) {
                            formik.setFieldValue(
                              'endDate',
                              moment(newStartDate)
                                .add(3, 'days')
                                .format('YYYY-MM-DD'),
                            );
                          }
                        }}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.startDate &&
                                                    Boolean(formik.errors.startDate)
                        }
                        helperText={
                          formik.touched.startDate &&
                                                    formik.errors.startDate
                        }
                      />
                    </Box>
                    <Box width="100%">
                      <DescriptionTitle variant="h6" marginY={1}>
                                                End Date
                      </DescriptionTitle>
                      <TextField
                        fullWidth
                        id="endDate"
                        name="endDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.endDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newEndDate = moment(
                            e.target.value,
                          ).format('YYYY-MM-DD');
                          if (
                            moment(newEndDate).isBefore(
                              moment(formik.values.startDate).add(
                                2,
                                'days',
                              ),
                            )
                          ) {
                            toast.warn(
                              'End date must be at least 3 days after the start date.',
                            );
                            formik.setFieldValue(
                              'endDate',
                              moment(formik.values.startDate)
                                .add(3, 'days')
                                .format('YYYY-MM-DD'),
                            );
                            return;
                          }
                          formik.setFieldValue('endDate', newEndDate);
                        }}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.endDate &&
                                                    Boolean(formik.errors.endDate)
                        }
                        helperText={
                          formik.touched.endDate && formik.errors.endDate
                        }
                      />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Side Sticky Card (NewCampaignCard) */}
          <Grid item xs={12} lg={4}>
            <StickyBox offsetTop={isLargeScreen ? 80 : 20} offsetBottom={20}>
              <NewCampaignCard
                title={formik.values.title || 'New Campaign Preview'}
                adType={formik.values.adType}
                isSubmittingForm={isSubmittingForm}
                creatives={(() => {
                  const processedCreatives = [];
                  const {
                    adType,
                    isABTesting,
                    displayAdA,
                    displayAdB,
                    searchAdA,
                    searchAdB,
                  } = formik.values;

                  // Helper to check if a creative is valid for preview and map it
                  const processAndMapCreative = (
                    creativeData: DisplayAdCreative | SearchAdCreative,
                    adIdentifierName: string,
                  ) => {
                    if (!creativeData) return null;

                    let isValidForPreview = false;
                    let mappedCreative = null;

                    if (adType === 'Display') {
                      isValidForPreview = Boolean(
                        creativeData.finalUrl &&
                                                (creativeData.image || creativeData.imgUrl) && // Checks for File object or imgUrl string
                                                (creativeData as DisplayAdCreative).headline);
                      if (isValidForPreview) {
                        mappedCreative = {
                          type: 'Display',
                          finalUrl: creativeData.finalUrl,
                          imgUrl: creativeData.imgUrl, // Populated by createPreviewEffect
                          headline: (creativeData as DisplayAdCreative).headline,
                          descriptionText: (creativeData as DisplayAdCreative).descriptionText,
                          name:
                                                        (creativeData.image instanceof File
                                                          ? creativeData.image.name
                                                          : (creativeData as DisplayAdCreative).headline) ||
                                                        adIdentifierName,
                        };
                      }
                    } else if (adType === 'Search') {
                      isValidForPreview = Boolean(
                        creativeData.finalUrl &&
                                                (creativeData as SearchAdCreative).headlines?.some(
                                                  (h: HeadlineItem) =>
                                                    h &&
                                                        typeof h.text === 'string' &&
                                                        h.text.trim() !== '',
                                                ) &&
                                                (creativeData as SearchAdCreative).descriptions?.some(
                                                  (d: DescriptionItem) =>
                                                    d &&
                                                        typeof d.text === 'string' &&
                                                        d.text.trim() !== '',
                                                ));
                      if (isValidForPreview) {
                        mappedCreative = {
                          type: 'Search',
                          finalUrl: creativeData.finalUrl,
                          headlines:
                                                        (creativeData as SearchAdCreative).headlines?.map((h: HeadlineItem) => ({
                                                          text: h?.text || '',
                                                        })) || [],
                          descriptions:
                                                        (creativeData as SearchAdCreative).descriptions?.map((d: DescriptionItem) => ({
                                                          text: d?.text || '',
                                                        })) || [],
                          path1: (creativeData as SearchAdCreative).path1,
                          path2: (creativeData as SearchAdCreative).path2,
                          imgUrl: creativeData.imgUrl, // Populated by createPreviewEffect (if search ads have images)
                          name:
                                                        (creativeData as SearchAdCreative).headlines?.[0]?.text ||
                                                        adIdentifierName,
                        };
                      }
                    }
                    return mappedCreative; // Will be null if not valid
                  };

                  // Process Ad A
                  const adAData = adType === 'Display' ? displayAdA : searchAdA;
                  const mappedAdA = processAndMapCreative(
                    adAData,
                    `${adType} Ad${isABTesting ? ' A' : ''}`,
                  );
                  if (mappedAdA) {
                    processedCreatives.push(mappedAdA);
                  }

                  // Process Ad B if A/B testing is enabled
                  if (isABTesting) {
                    const adBData =
                                            adType === 'Display' ? displayAdB : searchAdB;
                    const mappedAdB = processAndMapCreative(
                      adBData,
                      `${adType} Ad B`,
                    );
                    if (mappedAdB) {
                      processedCreatives.push(mappedAdB);
                    }
                  }

                  return processedCreatives;
                })()}
                networks={formik.values.networks}
                endDate={formik.values.endDate}
                startDate={formik.values.startDate}
                total={formik.values.total}
                dailyBudget={formik.values.dailyBudget}
                isBilling={false}
                onContinue={() => formik.handleSubmit()}
                isCreating={isSubmittingForm}
              />
            </StickyBox>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default NewAdvertisement;

