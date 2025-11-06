import { Grid, useMediaQuery, useTheme, Card, Typography, Button, Modal, Box } from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import NextLink from 'next/link';
import { Campaign } from '@/types';
const CreativePreviewModal = ({ open, handleClose, imageUrl }: { open: boolean, handleClose: () => void, imageUrl: string }) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        outline: 0,
      }}
    >
      <img
        src={imageUrl}
        alt="Creative"
        style={{ width: '100%', height: 'auto' }}
        loading="lazy"
      />
    </Box>
  </Modal>
);

const AdvertisementCard = ({ campaign, invoiceLink }: { campaign: Campaign, invoiceLink: string }) => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMatchMd = useMediaQuery(theme.breakpoints.down('md'));
  const reverseTextColor = darkMode ? '#000' : '#fff';
  const reverseTextColor2 = darkMode ? '#fff' : '#000';
  const bgColor = darkMode ? '#0E1B25' : '#fff';
  const bgColor2 = darkMode ? '#183042' : theme.palette.primary.main;
  const bgBtnColor = darkMode ? '#1976d2' : theme.palette.primary.main; // blue tone

  const [open, setOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string>('');

  const handleCloseModal = () => {
    setOpen(false);
    setModalImage('');
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <>
      {campaign ? (
        <Card
          sx={{
            color: reverseTextColor,
            backgroundColor: bgColor,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant={'h5'}
            component="h5"
            fontSize={{ lg: 24 }}
            fontWeight={{ xs: 400, md: 500, lg: 600 }}
            padding={2}
            color={'#fff'}
            textAlign={'center'}
            bgcolor={bgColor2}
            borderRadius={isMatchMd ? 'none' : '5px'}
            margin={isMatchMd ? '0' : '15px'}
          >
                        Your Campaign
          </Typography>
          <Button
            disabled={campaign?.payment?.status === 'succeeded'}
            component={NextLink}
            href={invoiceLink}
            sx={{ m: 2, textTransform: 'capitalize' }}
            variant="outlined"
          >
            {campaign?.payment?.status !== 'succeeded'
              ? 'Pending Payment'
              : 'Payment Success'}
          </Button>

          <Typography
            variant={isMatchMd ? 'h5' : 'h4'}
            component="span"
            fontSize={{ md: 16, lg: 20 }}
            fontWeight={{ xs: 400, md: 400, lg: 600 }}
            color={reverseTextColor2}
            px={3}
            mt={2}
          >
                        Description
          </Typography>
          <Typography variant={'body1'} fontSize={16} color={reverseTextColor2} px={3}>
            {campaign?.title}
          </Typography>
          <Typography
            variant={isMatchMd ? 'h5' : 'h4'}
            component="span"
            fontSize={{ md: 16, lg: 20 }}
            fontWeight={{ xs: 400, md: 400, lg: 600 }}
            color={reverseTextColor2}
            px={3}
            mt={2}
          >
                        Display
          </Typography>
          <Typography variant={'body1'} fontSize={16} color={reverseTextColor2} px={3}>
            {campaign?.display?.map((d: string) => d.split('-').join(' ')).join(', ')}
          </Typography>
          <Typography
            variant={isMatchMd ? 'h5' : 'h4'}
            component="span"
            fontSize={{ md: 16, lg: 20 }}
            fontWeight={{ xs: 400, md: 400, lg: 600 }}
            color={reverseTextColor2}
            px={3}
            mt={2}
          >
                        Timing
          </Typography>
          <Typography variant={'body1'} fontSize={16} color={reverseTextColor2} px={3}>
            {moment(campaign?.startDate).format('DD.MM.YYYY')}
                        &nbsp;-&nbsp;
            {moment(campaign?.endDate).format('DD.MM.YYYY')}
          </Typography>
          <Grid py={2} display="flex" justifyContent="space-between" alignItems="center">
            {campaign?.creative?.filter((c) => c?.url && c?.image)
              .map((cr, index) => (
                <Button
                  variant="contained"
                  component={NextLink}
                  href={`${origin}/download?preview-creative=${encodeURIComponent(
                    JSON.stringify(cr),
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  size="small"
                  sx={{
                    textDecoration: 'none',
                    mx: 1,
                    my: 2,
                    bgcolor: bgBtnColor,
                  }}
                >
                  {index % 2 === 0 ? 'Preview' : 'Download'}
                </Button>
              ))}
          </Grid>

          <CreativePreviewModal
            open={open}
            handleClose={handleCloseModal}
            imageUrl={modalImage}
          />
        </Card>
      ) : null}
    </>
  );
};

export default AdvertisementCard;

