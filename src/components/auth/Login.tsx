import React from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  FormControl,
  FormLabel,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import colors from '../styles';
import CustomButton from '../ui/CustomButton';
import ContinueWithGoogleButton from '../ui/ContinueWithGoogleButton';
import { getLogin } from '@/lib/api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Error from '../ui/Error';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useAuth from '@/lib/hooks/useAuth';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { User } from '@/types';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  data?: {
    _id: string;
    email: string;
    fullName: string;
    role?: {
      roleId: string;
    };
  };
  token?: string; // Add token field
}

const LoginPage: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { login: loginUser, userStatus } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const gray1 = colors.gray1;
  const textBlack = colors.textBlack;
  const primary = colors.primary;
  const formLabelStyles = {
    fontFamily: 'Rubik',
    fontSize: { xs: '16px', md: '20px' },
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };
  const { t } = useTranslation();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginData) => getLogin(data),

    onSuccess: async (data: LoginResponse) => {
      userStatus();
      formik.resetForm();
      setErrorMessage(null);
      toast.success(data?.message || 'Login Successfully');
      if (sessionStorage.getItem('fromLogin') === 'true') {
        sessionStorage.setItem('fromLogin', 'true');
      }
      else {
        sessionStorage.setItem('fromLogin', 'false');
      }
      sessionStorage.setItem('user-status', 'true');
      if (data?.data) {
        loginUser(data.data as User, data?.token as string | undefined);
      }

      // Refetch the auth status manually
      await queryClient.invalidateQueries({ queryKey: ['authStatus'] });

      router.push('/admin/dashboard');
    },

    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message || 'Something went wrong';
     // setErrorMessage(message);
       toast.error("Invalid email or password");
    },
  });
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Required'),
    }),
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          width: '100%',
          color: textBlack,
          p: 3,
          borderRadius: 1,
          height: '100%',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Rubik',
            fontSize: { xs: '32px', md: '44px' },
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            mb: 2,
          }}
        >
          {t('welcome')}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            color: gray1,
            fontFamily: 'Rubik',
            fontSize: { xs: '16px', md: '24px' },
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
          }}
        >
          {t('pleaseEnterYourDetails', 'Please enter your details')}
        </Typography>
        <form onSubmit={formik.handleSubmit} style={{ width: '100%', marginTop: '20px' }}>
          <FormControl sx={{ width: '100%' }}>
            <FormLabel sx={formLabelStyles} htmlFor="email">
              {t('email')}
            </FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder={t('yourEmail', 'your@email.com')}
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              sx={{
                border: '1px solid rgba(169, 169, 169, 0.60)',
                opacity: 0.6,
                mb: 1,
                fontSize: 30,
              }}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </FormControl>

          <FormControl sx={{ width: '100%' }}>
            <FormLabel sx={formLabelStyles} htmlFor="password">
              {t('password')}
            </FormLabel>
            <TextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              sx={{
                border: '1px solid rgba(169, 169, 169, 0.60)',
                opacity: 0.6,
                mb: 1,
              }}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              placeholder={
                formik.values.password ? '' : t('passwordPlaceholder', '••••••••')
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

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { md: 'center', xs: 'flex-start' },
              justifyContent: 'space-between',
              fontSize: { xs: '14px', md: '24px' },
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="remember"
                  color="primary"
                  onChange={formik.handleChange}
                />
              }
              label={t('rememberPassword', 'Remember Password')}
            />
            <Link
              href={'forgetpassword'}
              sx={{ textAlign: 'end', fontSize: { xs: '14px', md: '20px' } }}
            >
              {t('forgotPassword', 'Forgot Password?')}
            </Link>
          </Box>

          {/* <CustomButton onClick={() => formik.submitForm()}> {t('login')}</CustomButton> */}

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
              t('login')
            )}
          </CustomButton>

          <Typography sx={{...formLabelStyles, mt: 2 }}>
            {t('dontHaveAccount', 'Don\'t have an account?')}
          </Typography>
          <Button
            onClick={() => router.replace('/signup')}
            type="button"
            sx={{
              color: primary,
              fontFamily: 'Rubik',
              fontSize: {
                xs: '16px', // smaller font for phones
                md: '20px', // default font size for medium and larger
              },
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal',
              cursor: 'pointer',
              border: '1px solid var(--Primary, #C8A457)',
              maxWidth: {
                xs: '100%', // full width on small screens
                md: '250px', // fixed width on medium and up
              },
              height: {
                xs: '40px', // full width on small screens
                md: '56px', // fixed width on medium and up
              },
              borderRadius: '8px',
              padding: {
                xs: '10px',
                md: '15px',
              },
            }}
          >
            {t('createAccount', 'Create Account')}
          </Button>
        </form>
        <Error message={errorMessage} mt={2} />

        {/* <ContinueWithGoogleButton /> */}
      </Box>
    </>
  );
};

export default LoginPage;

