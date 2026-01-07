
import {
  Grid,
  useTheme,
  Card,
  Typography,
  CircularProgress,
  Modal,
  Button, // Added for potential close button on modal or other uses
} from '@mui/material';
import Box from '@mui/material/Box';
import moment from 'moment';
import { useState } from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import CustomButton from '@/components/ui/CustomButton';
import LaunchIcon from '@mui/icons-material/Launch'; // For link icon

interface Creative {
  image?: string;
  imgUrl?: string;
  type?: string;
  name?: string;
  headline?: string;
  descriptionText?: string;
  finalUrl?: string;
  creativeId?: string;
  status?: string;
  approvalStatus?: string;
  headlines?: Array<{ text: string }>;
  descriptions?: Array<{ text: string }>;
  path1?: string;
  path2?: string;
}

interface NewCampaignCardProps {
  title?: string;
  dailyBudget?: number;
  adType?: string;
  networks?: string[];
  creatives?: Creative[];
  startDate?: string;
  endDate?: string;
  total?: number;
  err?: string | { message?: string };
  additionalComponent?: React.ReactNode;
  isCreating?: boolean;
  isSubmittingForm?: boolean;
  isBilling?: boolean;
  onContinue: () => void;
}

const NewCampaignCard = (props: NewCampaignCardProps) => {
  const theme = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);

  const handleClickOpenModal = (imgUrl: string) => {
    if (imgUrl) {
      setSelectedImageForModal(imgUrl);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImageForModal(null);
  };

  const displayNetworks =
        props.networks && Array.isArray(props.networks) ? props.networks.join(', ') : 'N/A';

  const creativeCount = props.creatives ? props.creatives.length : 0;
  let adSummaryText = 'No ad creatives defined yet.';
  if (creativeCount === 1) {
    adSummaryText = `1 ${props.adType || ''} Ad defined.`;
  } else if (creativeCount > 1) {
    adSummaryText = `${creativeCount} ${props.adType || ''} Ads defined (A/B Test: Ad A & Ad B).`;
  }

  return (
    <Card
      sx={{
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        mt: { xs: 2, md: 5, lg: 0 }, // Consistent margin top
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        fontSize={{ xs: 18, lg: 22 }}
        fontWeight={{ xs: 500, md: 600 }}
        padding={2}
        color={theme.palette.primary.contrastText}
        textAlign="center"
        bgcolor={theme.palette.primary.main}
      >
                Campaign Summary & Preview
      </Typography>

      <Box p={{ xs: 2, md: 3 }}>
        <Typography
          variant="h6"
          component="h3"
          fontSize={{ md: 18, lg: 19 }}
          fontWeight={500}
          mt={1}
          mb={0.5}
        >
                    Campaign Name
        </Typography>
        <Typography
          variant="body1"
          fontSize={16}
          color={theme.palette.text.secondary}
          sx={{ wordBreak: 'break-word' }}
        >
          {props.title || 'Not specified'}
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          fontSize={{ md: 18, lg: 19 }}
          fontWeight={500}
          mt={2}
          mb={0.5}
        >
                    Daily Budget
        </Typography>
        <Typography variant="body1" fontSize={16} color={theme.palette.text.secondary}>
          {props.dailyBudget ? `${props.dailyBudget.toFixed(2)} USD` : 'Not set'}
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          fontSize={{ md: 18, lg: 19 }}
          fontWeight={500}
          mt={2}
          mb={0.5}
        >
                    Networks
        </Typography>
        <Typography
          variant="body1"
          fontSize={16}
          color={theme.palette.text.secondary}
          sx={{ textTransform: 'capitalize' }}
        >
          {displayNetworks}
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          fontSize={{ md: 18, lg: 19 }}
          fontWeight={500}
          mt={2}
          mb={0.5}
        >
                    Ad Creatives
        </Typography>
        <Typography
          variant="body1"
          fontSize={16}
          color={theme.palette.text.secondary}
          sx={{ wordBreak: 'break-word', mb: 2 }}
        >
          {adSummaryText}
        </Typography>

        {/* Creatives Preview Section */}
        <Grid container spacing={2} justifyContent="center">
          {props.creatives?.map((creative: Creative, index: number) => (
            <Grid
              item
              xs={12}
              sm={(props.creatives?.length || 0) > 1 ? 6 : 12}
              key={`creative-preview-${index}`}
            >
              <Card variant="outlined" sx={{ p: 1.5, height: '100%' }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                  textAlign="center"
                >
                                    Preview Ad{' '}
                  {(props.creatives?.length || 0) > 1 ? (index === 0 ? 'A' : 'B') : ''} (
                  {creative.type})
                </Typography>

                {/* Display Ad Preview */}
                {creative.type === 'Display' && creative.imgUrl && (
                  <Box
                    onClick={() => handleClickOpenModal(creative.imgUrl!)}
                    sx={{
                      cursor: 'pointer',
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      overflow: 'hidden',
                      mb: 1,
                      aspectRatio: '16/9', // Maintain aspect ratio
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette.grey[200],
                    }}
                  >
                    <img
                      src={creative.imgUrl}
                      alt={creative.name || `Display Ad ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </Box>
                )}
                {creative.type === 'Display' && (
                  <>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      noWrap
                      title={creative.headline}
                    >
                                            Headline: {creative.headline}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                      title={creative.descriptionText}
                    >
                                            Desc: {creative.descriptionText}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                      noWrap
                      title={creative.finalUrl}
                    >
                                            URL: {creative.finalUrl}
                    </Typography>
                  </>
                )}

                {/* Search Ad Preview */}
                {creative.type === 'Search' && (
                  <Box>
                    {creative.imgUrl && ( // Optional image for Search Ad
                      <Box
                        onClick={() =>
                          handleClickOpenModal(creative.imgUrl!)
                        }
                        sx={{
                          cursor: 'pointer',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                          overflow: 'hidden',
                          mb: 1,
                          height: '100px', // Smaller fixed height for search ad images
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette.grey[200],
                        }}
                      >
                        <img
                          src={creative.imgUrl}
                          alt={`Search Ad Image ${index + 1}`}
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    )}
                    {creative.headlines?.slice(0, 2).map((h: { text: string }, hIdx: number) => (
                      <Typography
                        key={hIdx}
                        variant="body2"
                        color={theme.palette.primary.main}
                        fontWeight="medium"
                        noWrap
                        title={h.text}
                      >
                        {h.text || `Headline ${hIdx + 1}`}
                      </Typography>
                    ))}
                    {creative.descriptions?.slice(0, 1).map((d: { text: string }, dIdx: number) => (
                      <Typography
                        key={dIdx}
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mt: 0.5,
                        }}
                        title={d.text}
                      >
                        {d.text || `Description ${dIdx + 1}`}
                      </Typography>
                    ))}
                    <Typography
                      variant="caption"
                      color="green"
                      display="block"
                      noWrap
                      title={creative.finalUrl}
                      sx={{ mt: 0.5 }}
                    >
                      {creative.finalUrl?.replace(/^https?:\/\//, '')}
                      {creative.path1 && `/${creative.path1}`}
                      {creative.path2 && `/${creative.path2}`}
                      <LaunchIcon
                        sx={{
                          fontSize: '0.8rem',
                          verticalAlign: 'middle',
                          ml: 0.5,
                        }}
                      />
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h6"
          component="h3"
          fontSize={{ md: 18, lg: 19 }}
          fontWeight={500}
          mt={3}
          mb={0.5}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>Schedule</span>
        </Typography>
        <Typography variant="body1" fontSize={16} color={theme.palette.text.secondary}>
          {moment(props.startDate).isValid()
            ? moment(props.startDate).format('DD MMM, YYYY')
            : 'Invalid Date'}
                    &nbsp;-&nbsp;
          {moment(props.endDate).isValid()
            ? moment(props.endDate).format('DD MMM, YYYY')
            : 'Invalid Date'}
        </Typography>
      </Box>

      <Grid
        py={2}
        px={{ xs: 2, md: 3 }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderTop={`1px solid ${theme.palette.divider}`}
        borderBottom={`1px solid ${theme.palette.divider}`}
        mt={2}
      >
        <Typography
          variant="h6"
          component="span"
          fontSize={{ md: 18, lg: 19 }}
          fontWeight={600}
          color={theme.palette.text.primary}
        >
                    Total Est. Cost:
        </Typography>
        <Typography
          variant="h6"
          component="span"
          fontSize={{ md: 18, lg: 19 }}
          fontWeight={600}
          color={theme.palette.text.primary}
        >
          {(props.total || 0).toFixed(2)}
                    &nbsp;USD
        </Typography>
      </Grid>

      <Typography
        variant="body2"
        color={theme.palette.text.secondary}
        p={{ xs: 2, md: 3 }}
        textAlign="center"
      >
                Please review your campaign details before proceeding.
      </Typography>

      {/* Image Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="image-preview-modal-title"
        aria-describedby="image-preview-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 1,
            outline: 0,
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            textAlign: 'center', // Center the image
          }}
        >
          <img
            src={selectedImageForModal || ''}
            alt="Enlarged Preview"
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '85vh',
              margin: 'auto',
            }}
            loading="lazy"
          />
          <Button onClick={handleCloseModal} sx={{ mt: 1 }}>
                        Close
          </Button>
        </Box>
      </Modal>

      {/* Error Display */}
      {props.err && (
        <Box
          display="flex"
          alignItems="center"
          sx={{
            p: 2,
            color: theme.palette.error.main,
            backgroundColor: theme.palette.error.light,
            justifyContent: 'center',
            gap: 1,
            mx: 2,
            mb: 1,
            borderRadius: 1,
          }}
        >
          <ErrorOutlineIcon />
          <Typography variant="body2" color="error.dark">
            {typeof props.err === 'string'
              ? props.err
              : props.err.message
                ? props.err.message
                : 'An unexpected error occurred.'}
          </Typography>
        </Box>
      )}

      {props.additionalComponent && (
        <Box p={{ xs: 2, md: 3 }} pt={0}>
          {props.additionalComponent}
        </Box>
      )}

      <Box px={{ xs: 2, md: 3 }} pb={{ xs: 2, md: 3 }} mt={1}>
        <CustomButton
          fullWidth
          etcStyle={{
            backgroundColor: theme.palette.error.light,
          }}
          disabled={props.isCreating || props.isSubmittingForm}
          onClick={() => props.onContinue()}
        >
          {props.isCreating ? (
            <CircularProgress size={24} sx={{ color: theme.palette.common.white }} />
          ) : props.isBilling ? (
            'Pay and Launch Campaign'
          ) : (
            'Create Campaign & Proceed'
          )}
        </CustomButton>
      </Box>
    </Card>
  );
};

export default NewCampaignCard;

