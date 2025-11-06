'use client';
import React from 'react';
import { Container, Typography, TextField, Box, Link, FormControl, FormLabel, IconButton, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import colors from '../styles';
import CustomButton from '../ui/CustomButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { resetPassword } from '@/lib/api/auth';
const validationSchema = Yup.object({
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

const NewPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const gray1 = colors.gray1;
  const textBlack = colors.textBlack;
  const foreground = colors.foreground;

  const formLabelStyles = {
    fontFamily: 'Rubik',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };
  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      formik.resetForm();
      toast.success('Password reset successful!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Something is wrong');
    },
  });

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: (values) => {
      if (!token) {
        toast.error('Missing or invalid token.');
        return;
      }

      mutation.mutate({ token, newPassword: values.password });
    },
  });
  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 4,
        maxWidth: '558px!important',
        backgroundColor: foreground,
        color: textBlack,
        p: 4,
        borderRadius: 1,
        my: 5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ArrowBackIcon fontSize="small" sx={{ color: gray1 }} />
        <Link
          href="/signin"
          sx={{
            ml: 1,
            color: gray1,
            cursor: 'pointer',
            textDecoration: 'none',
            fontFamily: 'Rubik',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
          }}
        >
                    Back
        </Link>
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontFamily: 'Rubik',
          fontSize: '44px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'normal',
          mb: 2,
        }}
      >
                Set New Password
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          mb: 2,
          color: gray1,
          fontFamily: 'Rubik',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: 'normal',
        }}
      >
                Must be at least 8 characters
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <FormControl fullWidth margin="normal">
          <FormLabel sx={formLabelStyles}>Password</FormLabel>
          <TextField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ border: '1px solid rgba(169, 169, 169, 0.60)', opacity: 0.6 }}
            placeholder={formik.values.password ? '' : 'Enter your password'}
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

        <FormControl fullWidth margin="normal">
          <FormLabel sx={formLabelStyles}>Confirm Password</FormLabel>
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)
            }
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            sx={{ border: '1px solid rgba(169, 169, 169, 0.60)', opacity: 0.6 }}
            placeholder={formik.values.confirmPassword ? '' : 'Confirm your password'}
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

        <CustomButton
          etcStyle={{}}
          onClick={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
                  Reset Password
        </CustomButton>
      </form>
    </Container>
  );
};

export default NewPasswordPage;

