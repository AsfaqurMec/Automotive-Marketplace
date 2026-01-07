'use client';
import React from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Divider,
  IconButton,
  InputAdornment,
  FormControl,
  FormLabel,
  CircularProgress,
  Button,
  FormHelperText,
  Grid,
} from '@mui/material';
import { useFormik, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff, CloudUpload, CheckCircle } from '@mui/icons-material';
import colors from '../styles';
import CustomButton from '../ui/CustomButton';
import ContinueWithGoogleButton from '../ui/ContinueWithGoogleButton';
import { useMutation } from '@tanstack/react-query';
import { signup } from '@/lib/api/auth';
import Error from '../ui/Error';
import SuccessMessage from '../ui/SuccessMessage';
import useAuth from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import NextLink from 'next/link';

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bankAccountInfo: string;
  tradeLicense: File | null;
  tinCertificate: File | null;
  vatRegistration: File | null;
  companyProof: File | null;
  ownershipProof: File | null;
  ownerIdDocument: File | null;
  ownerPhoto: File | null;
  bankStatement: File | null;
  brtaRegistration: File | null;
  importLicense: File | null;
  authorizationLetter: File | null;
}

type FileFieldName =
  | 'tradeLicense'
  | 'tinCertificate'
  | 'vatRegistration'
  | 'companyProof'
  | 'ownershipProof'
  | 'ownerIdDocument'
  | 'ownerPhoto'
  | 'bankStatement'
  | 'brtaRegistration'
  | 'importLicense'
  | 'authorizationLetter';

interface SignupResponse {
  message?: string;
  user?: {
    _id: string;
    email: string;
    fullName: string;
  };
}

const requiredFileSchema = Yup.mixed<File>()
  .nullable()
  .test('fileRequired', 'Required', (value) => value instanceof File);

const optionalFileSchema = Yup.mixed<File>().nullable();

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
  bankAccountInfo: Yup.string().required('Required'),
  tradeLicense: requiredFileSchema,
  tinCertificate: requiredFileSchema,
  vatRegistration: optionalFileSchema,
  companyProof: requiredFileSchema,
  ownershipProof: requiredFileSchema,
  ownerIdDocument: requiredFileSchema,
  ownerPhoto: requiredFileSchema,
  bankStatement: requiredFileSchema,
  brtaRegistration: optionalFileSchema,
  importLicense: optionalFileSchema,
  authorizationLetter: optionalFileSchema,
});

const SignupPage = ({ type }: { type: string }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState<'documents' | 'details'>('documents');
  const [attemptedNext, setAttemptedNext] = React.useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const { setUser } = useAuth();

  const gray1 = colors.gray1;
  const textBlack = colors.textBlack;
  const foreground = colors.foreground;
  const primary = colors.primary;
  const background = colors.background;
  
  const formLabelStyles = {
    fontFamily: 'Rubik',
    fontSize: { xs: '15px', md: '16px' },
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 1.4,
    color: textBlack,
    mb: 1,
  };
  
  const uploadButtonStyles = {
    justifyContent: 'center',
    borderColor: 'rgba(169, 169, 169, 0.40)',
    color: textBlack,
    backgroundColor: foreground,
    px: 2,
    py: 1.75,
    borderRadius: '8px',
    border: '1.5px dashed rgba(169, 169, 169, 0.50)',
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '14px',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    '&:hover': {
      borderColor: primary,
      backgroundColor: colors.signColor4,
      borderStyle: 'solid',
      boxShadow: '0 2px 8px rgba(200, 164, 87, 0.15)',
    },
  };
  const optionalText = t('optional', 'Optional');
  const fileFieldConfig: Array<{
    name: FileFieldName;
    label: string;
    required: boolean;
    description?: string;
  }> = [
    {
      name: 'tradeLicense',
      label: t(
        'tradeLicenseDocument',
        'Trade License (City Corporation or Municipality)',
      ),
      required: true,
    },
    {
      name: 'tinCertificate',
      label: t('tinCertificate', 'TIN Certificate'),
      required: true,
    },
    {
      name: 'vatRegistration',
      label: t('vatRegistrationCertificate', 'VAT Registration Certificate'),
      required: false,
      description: t('ifApplicable', 'If applicable'),
    },
    {
      name: 'companyProof',
      label: t(
        'companyProof',
        'Company Name and Address Proof (utility bill, rent agreement, business card)',
      ),
      required: true,
    },
    {
      name: 'ownershipProof',
      label: t(
        'ownershipProof',
        'Business Ownership Proof (partnership deed, memorandum, or sole proprietorship declaration)',
      ),
      required: true,
    },
    {
      name: 'ownerIdDocument',
      label: t(
        'ownerIdDocument',
        'NID or Passport of owner / authorized person',
      ),
      required: true,
    },
    {
      name: 'ownerPhoto',
      label: t(
        'ownerPhoto',
        'Passport-sized Photo of owner / authorized representative',
      ),
      required: true,
    },
    {
      name: 'bankStatement',
      label: t(
        'bankStatement',
        'Bank Statement or Cheque Copy (for account verification)',
      ),
      required: true,
    },
    {
      name: 'brtaRegistration',
      label: t(
        'brtaRegistration',
        'BRTA Registration (for registered car importers/resellers)',
      ),
      required: false,
      description: t('ifRequired', 'Provide if available'),
    },
    {
      name: 'importLicense',
      label: t('importLicense', 'Import License (for vehicle importers)'),
      required: false,
      description: t('ifRequired', 'Provide if available'),
    },
    {
      name: 'authorizationLetter',
      label: t(
        'authorizationLetter',
        'Dealership Authorization Letter (if representing a brand)',
      ),
      required: false,
      description: t('ifRequired', 'Provide if available'),
    },
  ];
  const requiredDocumentNames = fileFieldConfig.filter((field) => field.required).map((field) => field.name);
  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (data: SignupResponse) => {
      formik.resetForm();
      setCurrentStep('documents');
      setAttemptedNext(false);
      setErrorMessage(null);
      setSuccessMessage(data?.message || null);
      if (data?.user) {
        setUser(data.user);
      }
      toast.success('Registration complete. Verification email sent.');
      router.push('/signin');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message || 'Something went wrong';
      setErrorMessage(message);
      setSuccessMessage(null);
      toast.error(message);
    },
  });

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      bankAccountInfo: '',
      tradeLicense: null,
      tinCertificate: null,
      vatRegistration: null,
      companyProof: null,
      ownershipProof: null,
      ownerIdDocument: null,
      ownerPhoto: null,
      bankStatement: null,
      brtaRegistration: null,
      importLicense: null,
      authorizationLetter: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      
      // Log all text fields
      console.log('=== SIGNUP FORM DATA BEING SENT ===');
      console.log('Text Fields:');
      console.log('  firstName:', values.firstName);
      console.log('  lastName:', values.lastName);
      console.log('  email:', values.email);
      console.log('  password:', values.password ? '***' : '');
      console.log('  confirmPassword:', values.confirmPassword ? '***' : '');
      console.log('  bankAccountInfo:', values.bankAccountInfo);
      console.log('  type:', type || 'dealer');
      console.log('  status: inactive');
      
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('confirmPassword', values.confirmPassword);
      formData.append('bankAccountInfo', values.bankAccountInfo);
      formData.append('type', type || 'dealer');
      formData.append('status', 'inactive');

      const fileFields: FileFieldName[] = [
        'tradeLicense',
        'tinCertificate',
        'vatRegistration',
        'companyProof',
        'ownershipProof',
        'ownerIdDocument',
        'ownerPhoto',
        'bankStatement',
        'brtaRegistration',
        'importLicense',
        'authorizationLetter',
      ];

      console.log('Files:');
      fileFields.forEach((field) => {
        const file = values[field];
        if (file) {
          console.log(`  ${field}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
          });
          formData.append(field, file);
        } else {
          console.log(`  ${field}: not provided`);
        }
      });
      
      // Log FormData entries (for debugging)
      console.log('FormData entries:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}:`, {
            type: 'File',
            name: value.name,
            size: value.size,
          });
        } else {
          console.log(`  ${key}:`, value);
        }
      }
      console.log('=== END OF FORM DATA ===');

      mutate(formData);
    },
  });
  const areRequiredDocsProvided = requiredDocumentNames.every((field) => Boolean(formik.values[field]));
  const isBankInfoProvided = Boolean(formik.values.bankAccountInfo?.trim());
  const isNextDisabled =
    attemptedNext && (!areRequiredDocsProvided || !isBankInfoProvided);
  const handleNextStep = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAttemptedNext(true);
    const errors: FormikErrors<SignupFormValues> = await formik.validateForm();
    const touchedDocuments = requiredDocumentNames.reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {} as Partial<FormikTouched<SignupFormValues>>,
    );
    formik.setTouched({
      ...formik.touched,
      ...touchedDocuments,
      bankAccountInfo: true,
    });
    const hasDocumentErrors = requiredDocumentNames.some((field) => errors[field]);
    const hasBankError = Boolean(errors.bankAccountInfo);
    const missingDocument = requiredDocumentNames.some((field) => !formik.values[field]);
    const missingBank = !Boolean(formik.values.bankAccountInfo?.trim());

    if (!hasDocumentErrors && !hasBankError && !missingDocument && !missingBank) {
      setCurrentStep('details');
      setAttemptedNext(false);
    }
  };

  return (
    <>
      {/* {isPending&&<CustomLoaderForComponent/>} */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          backgroundColor: foreground,
          py: { xs: 3, md: 5 },
          px: { xs: 2, md: 3 },
        }}
      >
        <Container
          maxWidth={currentStep === 'documents' ? 'lg' : 'xs'}
          sx={{
            backgroundColor: background,
            color: textBlack,
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
            width: '100%',
            maxWidth:
              currentStep === 'documents'
                ? '100%!important'
                : '558px!important',
            border: '1px solid rgba(169, 169, 169, 0.15)',
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Rubik',
                fontSize: { xs: '28px', md: '36px' },
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 1.2,
                color: textBlack,
                mb: 1.5,
              }}
            >
              {t('createNewAccount')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: gray1,
                fontFamily: 'Rubik',
                fontSize: { xs: '14px', md: '16px' },
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              {currentStep === 'documents'
                ? t(
                  'dealerVerificationStepSubtitle',
                  'Submit your dealer verification documents to proceed to account setup.',
                )
                : t('Please Enter Your Details')}
            </Typography>
          </Box>

        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          {currentStep === 'documents' ? (
            <Box>
              {/* Instructions */}
              <Box
                sx={{
                  mb: 4,
                  p: 2.5,
                  backgroundColor: colors.signColor4,
                  borderRadius: 2,
                  border: `1px solid ${colors.signColor2}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: textBlack,
                    fontFamily: 'Rubik',
                    fontSize: { xs: '13px', md: '14px' },
                    lineHeight: 1.6,
                    textAlign: 'center',
                  }}
                >
                  {t(
                    'dealerVerificationInstructions',
                    'Upload clear scans or photos of the required documents. Maximum file size 10MB; accepted formats: PDF, JPG, PNG.',
                  )}
                </Typography>
              </Box>

              {/* Bank Account Information */}
              <Box sx={{ mb: 4 }}>
                <FormControl fullWidth>
                  <FormLabel sx={formLabelStyles}>
                    {t('bankAccountInformation', 'Bank Account Information')}
                    <Typography
                      component="span"
                      sx={{
                        color: colors.accent,
                        fontSize: '13px',
                        ml: 0.5,
                      }}
                    >
                      *
                    </Typography>
                  </FormLabel>
                  <TextField
                    id="bankAccountInfo"
                    name="bankAccountInfo"
                    value={formik.values.bankAccountInfo}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.bankAccountInfo &&
                      Boolean(formik.errors.bankAccountInfo)
                    }
                    helperText={
                      formik.touched.bankAccountInfo && formik.errors.bankAccountInfo
                        ? t(formik.errors.bankAccountInfo as string)
                        : t(
                          'bankAccountInfoHelper',
                          'Provide account details for payments and refunds.',
                        )
                    }
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: background,
                        '& fieldset': {
                          borderColor: 'rgba(169, 169, 169, 0.40)',
                        },
                        '&:hover fieldset': {
                          borderColor: primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primary,
                          borderWidth: '1.5px',
                        },
                      },
                    }}
                    placeholder={
                      formik.values.bankAccountInfo
                        ? ''
                        : t(
                          'bankAccountInfoPlaceholder',
                          'Account name, number, bank & branch',
                        )
                    }
                  />
                </FormControl>
              </Box>

              {/* Document Upload Grid */}
              <Grid container spacing={{ xs: 2, md: 2.5 }}>

              {fileFieldConfig.map((field) => {
                const file = formik.values[field.name];
                const touched = formik.touched[field.name];
                const error = touched && formik.errors[field.name];
                return (
                  <Grid item xs={12} md={6} key={field.name}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${file ? primary : 'rgba(169, 169, 169, 0.20)'}`,
                        backgroundColor: file ? colors.signColor4 : background,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          borderColor: primary,
                          boxShadow: '0 2px 8px rgba(200, 164, 87, 0.1)',
                        },
                      }}
                    >
                      <FormControl fullWidth>
                        <FormLabel
                          sx={{
                            ...formLabelStyles,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 0.5,
                          }}
                        >
                          <Box component="span" sx={{ flex: 1 }}>
                            {field.label}
                          </Box>
                          {field.required ? (
                            <Typography
                              component="span"
                              sx={{
                                color: colors.accent,
                                fontSize: '13px',
                                fontWeight: 600,
                              }}
                            >
                              *
                            </Typography>
                          ) : (
                            <Typography
                              component="span"
                              sx={{
                                color: gray1,
                                fontSize: '12px',
                                fontStyle: 'italic',
                              }}
                            >
                              ({optionalText})
                            </Typography>
                          )}
                        </FormLabel>
                        <Button
                          variant="outlined"
                          component="label"
                          sx={uploadButtonStyles}
                          fullWidth
                        >
                          {file ? (
                            <>
                              <CheckCircle sx={{ fontSize: '18px', color: primary }} />
                              {t('replaceFile', 'Replace file')}
                            </>
                          ) : (
                            <>
                              <CloudUpload sx={{ fontSize: '18px' }} />
                              {t('uploadFile', 'Upload file')}
                            </>
                          )}
                          <input
                            type="file"
                            hidden
                            accept="application/pdf,image/*"
                            onChange={(event) => {
                              const selectedFile =
                                event.currentTarget.files &&
                                event.currentTarget.files.length > 0
                                  ? event.currentTarget.files[0]
                                  : null;
                              formik.setFieldValue(field.name, selectedFile);
                              formik.setFieldTouched(field.name, true, false);
                            }}
                            onBlur={() => formik.setFieldTouched(field.name, true, true)}
                          />
                        </Button>
                        <Box sx={{ mt: 1.5, minHeight: '20px' }}>
                          {file ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: foreground,
                              }}
                            >
                              <CheckCircle sx={{ fontSize: '16px', color: primary }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: textBlack,
                                  fontFamily: 'Rubik',
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  wordBreak: 'break-word',
                                  flex: 1,
                                }}
                              >
                                {file.name}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{
                                color: gray1,
                                fontFamily: 'Rubik',
                                fontSize: '12px',
                                fontStyle: 'italic',
                              }}
                            >
                              {t('noFileSelected', 'No file selected yet')}
                            </Typography>
                          )}
                        </Box>
                        {field.description && !file ? (
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mt: 1,
                              color: gray1,
                              fontFamily: 'Rubik',
                              fontSize: '11px',
                              fontStyle: 'italic',
                            }}
                          >
                            {field.description}
                          </Typography>
                        ) : null}
                        {error ? (
                          <FormHelperText
                            error
                            sx={{
                              fontFamily: 'Rubik',
                              fontSize: '12px',
                              mt: 0.5,
                              ml: 0,
                            }}
                          >
                            {typeof error === 'string'
                              ? t(error)
                              : t('fileRequired', 'This file is required')}
                          </FormHelperText>
                        ) : null}
                      </FormControl>
                    </Box>
                  </Grid>
                );
              })}

              </Grid>

              {/* Next Button */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CustomButton
                  etcStyle={{ marginTop: 0, maxWidth: '300px' }}
                  disabled={isNextDisabled}
                  onClick={handleNextStep}
                >
                  {t('next', 'Next')}
                </CustomButton>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                display="flex"
                gap={2}
                mb={3}
                sx={{
                  width: '100%',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <FormControl fullWidth>
                  <FormLabel sx={formLabelStyles}>{t('firstName')}</FormLabel>
                  <TextField
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                        ? t(formik.errors.firstName as string)
                        : ''
                    }
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: background,
                        '& fieldset': {
                          borderColor: 'rgba(169, 169, 169, 0.40)',
                        },
                        '&:hover fieldset': {
                          borderColor: primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primary,
                          borderWidth: '1.5px',
                        },
                      },
                    }}
                    placeholder={
                      formik.values.firstName ? '' : t('firstNamePlaceholder')
                    }
                  />
                </FormControl>

                <FormControl fullWidth>
                  <FormLabel sx={formLabelStyles}>{t('lastName')}</FormLabel>
                  <TextField
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                        ? t(formik.errors.lastName as string)
                        : ''
                    }
                    variant="outlined"
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        backgroundColor: background,
                        '& fieldset': {
                          borderColor: 'rgba(169, 169, 169, 0.40)',
                        },
                        '&:hover fieldset': {
                          borderColor: primary,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: primary,
                          borderWidth: '1.5px',
                        },
                      },
                    }}
                    placeholder={formik.values.lastName ? '' : t('lastNamePlaceholder')}
                  />
                </FormControl>
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={formLabelStyles}>{t('email')}</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    formik.touched.email && formik.errors.email
                      ? t(formik.errors.email as string)
                      : ''
                  }
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: background,
                      '& fieldset': {
                        borderColor: 'rgba(169, 169, 169, 0.60)',
                      },
                      '&:hover fieldset': {
                        borderColor: primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: primary,
                      },
                    },
                  }}
                  placeholder={formik.values.email ? '' : t('emailPlaceholder')}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={formLabelStyles}>{t('password')}</FormLabel>
                <TextField
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={
                    formik.touched.password && formik.errors.password
                      ? t(formik.errors.password as string)
                      : ''
                  }
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: background,
                      '& fieldset': {
                        borderColor: 'rgba(169, 169, 169, 0.60)',
                      },
                      '&:hover fieldset': {
                        borderColor: primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: primary,
                      },
                    },
                  }}
                  placeholder={formik.values.password ? '' : t('passwordPlaceholder')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{
                            color: gray1,
                            '&:hover': {
                              color: primary,
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={formLabelStyles}>{t('confirmPassword')}</FormLabel>
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? t(formik.errors.confirmPassword as string)
                      : ''
                  }
                  variant="outlined"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: background,
                      '& fieldset': {
                        borderColor: 'rgba(169, 169, 169, 0.60)',
                      },
                      '&:hover fieldset': {
                        borderColor: primary,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: primary,
                      },
                    },
                  }}
                  placeholder={
                    formik.values.confirmPassword ? '' : t('confirmPasswordPlaceholder')
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          sx={{
                            color: gray1,
                            '&:hover': {
                              color: primary,
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>

              <Box sx={{ mt: 4 }}>
                <CustomButton
                  etcStyle={{ marginTop: 0 }}
                  onClick={() => formik.submitForm()}
                >
                  {isPending ? (
                    <CircularProgress
                      size={30}
                      sx={{
                        color: '#ffff',
                        mr: 1,
                      }}
                    />
                  ) : (
                    t('signup')
                  )}
                </CustomButton>
              </Box>

              <Error message={errorMessage} />
              <SuccessMessage message={successMessage || ''} />
              
              <Divider sx={{ my: 3 }}>
                <Typography
                  sx={{
                    color: gray1,
                    fontFamily: 'Rubik',
                    fontSize: '14px',
                    px: 2,
                  }}
                >
                  {t('or')}
                </Typography>
              </Divider>

              {/* <ContinueWithGoogleButton /> */}

              <Typography
                align="center"
                sx={{
                  color: textBlack,
                  fontFamily: 'Rubik',
                  fontSize: { xs: '14px', md: '16px' },
                  mt: 2,
                }}
              >
                {t('haveAccount')}{' '}
                <NextLink
                  href="/signin"
                  style={{
                    color: primary,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  {t('login')}
                </NextLink>
              </Typography>
            </>
          )}
        </form>
      </Container>
      </Box>
    </>
  );
};

export default SignupPage;

