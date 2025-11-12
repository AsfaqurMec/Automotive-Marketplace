'use client';
import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import colors from '../styles';
import CustomButton from '../ui/CustomButton';
import SignupPage from './Signup';
import customerImage from '@/assets/CustomerImage.jpg';
import DealerImage from '@/assets/DealerImage.jpg';
import { useTranslation } from 'react-i18next';
import NextLink from 'next/link';

interface Option {
  id: string;
  label: string;
  signUpTitle: string;
  image: string;
}

const options: Option[] = [
  // {
  //   id: 'dealer',
  //   label: 'customer',
  //   signUpTitle: 'createNewAccount',
  //   image: customerImage?.src,
  // },
  {
    id: 'dealer',
    label: 'dealer',
    signUpTitle: 'dealerNewAccount',
    image: DealerImage?.src,
  },
  // {
  //   id: 'dealer',
  //   label: 'agency',
  //   signUpTitle: 'agentNewAccount',
  //   image: DealerImage?.src,
  // },
];

const PurposeSelection: React.FC = () => {
  const [selected, setSelected] = useState<Option | null>(null);
  const [renderSignUpForm, setRenderSignUpForm] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      {selected === null || !renderSignUpForm ? (
        <Box
          sx={{
            maxWidth: '650px',
            margin: 'auto',
            textAlign: 'start',
            padding: '20px',
            BackgroundColor: colors.foreground,
            color: colors.textBlack,
            mt: '20%',
            width: '100%',
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={1}
            sx={{
              fontFamily: 'Rubik',
              fontSize: { xs: '24px', md: '44px' },
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: 'normal',
              mb: 2,
            }}
          >
            {t('purposeTitle', 'What purpose you want to enter?')}
          </Typography>
          <Typography
            color="textSecondary"
            mb={2}
            sx={{
              mb: 2,
              color: colors.gray1,
              fontFamily: 'Rubik',
              fontSize: { xs: '16px', md: '24px' },
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal',
            }}
          >
            {t('pleaseSelectOne', 'Please select one')}
          </Typography>

          <Grid container gap={3} justifyContent="center">
            {options.map((option: Option) => {
              const isSelected = selected?.id === option.id;
              return (
                <Grid
                  item
                  xs={5}
                  md={4}
                  key={option.id}
                  onClick={() => setSelected(option)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease',
                    filter:
                                            !isSelected && selected !== null
                                              ? 'grayscale(50%) opacity(0.6)'
                                              : 'none',
                    borderRadius: '8px',
                    boxShadow: isSelected
                      ? '0 4px 20px rgba(200, 164, 87, 0.5)'
                      : 'none',
                  }}
                >
                  <Box
                    component="img"
                    src={option.image}
                    alt={option.label}
                    sx={{
                      width: '100%',
                      height: '138px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#fff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.7)',
                    }}
                  >
                    {t(option.label)}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>

          <CustomButton etcStyle={{}} onClick={() => setRenderSignUpForm(true)}>
            {t('next', 'Next')}
          </CustomButton>

          <Box sx={{ textAlign: 'center' }}>
            <Typography
              mt={2}
              sx={{
                fontFamily: 'Rubik',
                fontSize: { xs: '16px', md: '20px' },
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: 'normal',
                color: colors.textBlack,
                mb: 2,
              }}
            >
              {t('haveAccount')}{' '}
              <NextLink
                href="/signin"
                style={{ color: colors.primary, textDecoration: 'none' }}
              >
                {t('login')}
              </NextLink>
            </Typography>
          </Box>
        </Box>
      ) : (
        <SignupPage type={selected?.id || ''} />
      )}
    </>
  );
};

export default PurposeSelection;

