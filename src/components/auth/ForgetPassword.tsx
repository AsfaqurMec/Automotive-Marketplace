'use client';
import React from 'react';
import { Typography, TextField, Box, Link, FormControl, FormLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import colors from '../styles';
import CustomButton from '../ui/CustomButton';
import { toast } from 'react-toastify';
import Error from '../ui/Error';
import { forgetPassword } from '@/lib/api/auth';
import { useMutation } from '@tanstack/react-query';
import CustomLoaderForComponent from '../ui/CustomLoaderForComponent';
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPasswordPage: React.FC = () => {
  const gray1 = colors.gray1;
  const textBlack = colors.textBlack;
  const foreground = colors.foreground;
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const formLabelStyles = {
    fontFamily: 'Rubik',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };
  const { mutate, isPending } = useMutation({
    mutationFn: (email: { email: string }) => forgetPassword(email),
    onSuccess: (data: { message?: string }) => {
      formik.resetForm();
      setErrorMessage(null);
      toast.success(data?.message || 'Email Sended Successfully');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message = error?.response?.data?.message || 'Something went wrong';
      setErrorMessage(message);
    },
  });
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <>
      {isPending && <CustomLoaderForComponent />}
      <Box
        sx={{
          mt: 4,
          maxWidth: '558px!important',
          backgroundColor: foreground,
          color: textBlack,
          p: 4,
          borderRadius: 1,
          m: 'auto',
          display: 'flex',
          flexDirection: 'column',
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

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            mt: '20%',
          }}
        >
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
                        Forgot Password
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
                        No worries, weâ€™ll send you reset instruction
          </Typography>

          <form>
            <FormLabel>Email</FormLabel>
            <FormControl sx={formLabelStyles} fullWidth>
              <TextField
                fullWidth
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={{
                  border: '1px solid rgba(169, 169, 169, 0.60)',
                  opacity: 0.6,
                  mb: 1,
                }}
              />
            </FormControl>

            <CustomButton etcStyle={{}} onClick={() => formik.handleSubmit()}>Send</CustomButton>
          </form>
          <Error message={errorMessage} />
        </Box>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;

