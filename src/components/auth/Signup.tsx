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
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
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

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  type: string;
}

interface SignupResponse {
  message?: string;
  user?: {
    _id: string;
    email: string;
    fullName: string;
  };
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

const SignupPage = ({ type }: { type: string }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const { setUser } = useAuth();

  const gray1 = colors.gray1;
  const textBlack = colors.textBlack;
  const foreground = colors.foreground;
  const formLabelStyles = {
    fontFamily: 'Rubik',
    fontSize: { xs: '16px', md: '20px' },
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };
  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (data: SignupResponse) => {
      formik.resetForm();
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

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values: Omit<SignupData, 'type'>) => mutate({ ...values, type }),
  });

  return (
    <>
      {/* {isPending&&<CustomLoaderForComponent/>} */}
      <Container
        maxWidth="xs"
        sx={{
          mt: 4,
          backgroundColor: foreground,
          color: textBlack,
          p: { xs: 2, md: 4 },
          borderRadius: 1,
          maxWidth: '558px!important',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Rubik',
            fontSize: { xs: '24px', md: '44px' },
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            mb: 2,
          }}
          fontWeight={600}
        >
          {t('createNewAccount')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            color: gray1,
            fontFamily: 'Rubik',
            fontSize: { xs: '14px', md: '24px' },
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
          }}
        >
          {t('Please Enter Your Details')}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box display="flex" gap={2} mb={2} sx={{ width: '100%' }}>
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
                sx={{ border: '1px solid rgba(169, 169, 169, 0.60)', opacity: 0.6 }}
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
                sx={{ border: '1px solid rgba(169, 169, 169, 0.60)', opacity: 0.6 }}
                placeholder={formik.values.lastName ? '' : t('lastNamePlaceholder')}
              />
            </FormControl>
          </Box>

          <FormControl fullWidth margin="normal">
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
              sx={{
                border: '1px solid rgba(169, 169, 169, 0.60)',
                opacity: 0.6,
                fontSize: '1rem!important',
              }}
              placeholder={formik.values.email ? '' : t('emailPlaceholder')}
            />
          </FormControl>

          {/* Password */}
          <FormControl fullWidth margin="normal">
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
              sx={{ border: '1px solid rgba(169, 169, 169, 0.60)', opacity: 0.6 }}
              placeholder={formik.values.password ? '' : t('passwordPlaceholder')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {/* Confirm Password */}
          <FormControl fullWidth margin="normal">
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
              sx={{ border: '1px solid rgba(169, 169, 169, 0.60)', opacity: 0.6 }}
              placeholder={
                formik.values.confirmPassword ? '' : t('confirmPasswordPlaceholder')
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {/* <CustomButton onClick={() => formik.submitForm()}>{t('signup')}</CustomButton> */}

          <CustomButton etcStyle={{}} onClick={() => formik.submitForm()}>
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

          <Error message={errorMessage} />
          <SuccessMessage message={successMessage || ''} />
          <Divider sx={{ my: 2 }}>{t('or')}</Divider>

          {/* <ContinueWithGoogleButton /> */}

          <Typography align="center" sx={{ color: textBlack }}>
            {t('haveAccount')}{' '}
            <NextLink href="/signin" style={{ color: '#C8A457', textDecoration: 'none' }}>
              {t('login')}
            </NextLink>
          </Typography>
        </form>
      </Container>
    </>
  );
};

export default SignupPage;

