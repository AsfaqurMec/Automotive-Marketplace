import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  Box,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FaPlus } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
// Removed unused import
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Campaign } from '@/types';

const HeaderContent = ({ campaigns, currentCampaignId, setCurrentCampaignId, hasAccessToken }: { campaigns: Campaign[], currentCampaignId: string, setCurrentCampaignId: (id: string) => void, hasAccessToken: boolean }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const route = useRouter();
  const darkMode = theme.palette.mode === 'dark';
  const reverseTextColor = darkMode ? '#fff' : '#000';
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  return (
    <>
      <Box
        sx={{
          px: isLargeScreen ? 5 : 1, // Adjusted padding for smaller screens
          py: 3,
          display: 'flex', // Always flex to keep title and button on the same line
          flexDirection: isLargeScreen ? 'row' : 'column', // Stack on small screens
          justifyContent: 'space-between',
          alignItems: isLargeScreen ? 'center' : 'flex-start', // Align items
        }}
      >
        <Box mb={!isLargeScreen ? 2 : 0}>
          <Typography
            variant="h5"
            // mb={!isLargeScreen && 2} // Removed as parent Box handles spacing
            color={reverseTextColor}
            fontWeight={700}
          >
            {t('campaigns')}
          </Typography>
          {campaigns.length > 0 && ( // Show subtitle only if there are campaigns
            <Typography variant="body1" color={reverseTextColor}>
              {t('campaignsInfo')}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: isLargeScreen ? 'row' : 'column',
            alignItems: isLargeScreen ? 'center' : 'flex-start',
            gap: isLargeScreen ? 2 : 3,
            width: isLargeScreen ? 'auto' : '100%',
          }}
        >
          <Button
            variant="contained"
            startIcon={<FaPlus style={{ marginLeft: 5, marginRight: 5 }} />}
            onClick={() => {
              if (!hasAccessToken) {
                // You can choose the type of toast (error, warning, info) and customize the message
                toast.warn('Please connect your account or sync first to proceed.');
                return;
                // Or, for example:
                // toast.error('Access token not found. Please ensure your account is synced.');
              }
              route.push('/admin/new-campaign');
            }}
            sx={{
              //  height: '56px', // Match select height if desired
              width:
                                campaigns.length > 0 && !isLargeScreen
                                  ? 'auto'
                                  : isLargeScreen
                                    ? 'auto'
                                    : '100%',
              mt: campaigns.length === 0 && !isLargeScreen ? 2 : 0, // Add margin top if no campaigns on small screen
            }}
          >
                        New Campaign
          </Button>
          {campaigns.length > 0 && (
            <FormControl
              sx={{
                width: isLargeScreen
                  ? 200
                  : 'calc(100% - 150px)' /* Adjust width */,
              }}
            >
              <InputLabel id="campaign-select-label">Select Campaign</InputLabel>
              <Select
                labelId="campaign-select-label"
                id="campaign-select"
                value={currentCampaignId}
                onChange={(e: SelectChangeEvent<string>) => setCurrentCampaignId(e.target.value)}
                label="Select Campaign"
              >
                <MenuItem value="" disabled>
                                    Select Campaign
                </MenuItem>
                {campaigns.map((c) => (
                  <MenuItem
                    key={c._id}
                    value={c._id}
                    style={{ color: reverseTextColor }} // Consider theming for consistency
                  >
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </Box>

      {campaigns.length === 0 && (
        <Box sx={{ px: isLargeScreen ? 5 : 2, pt: 0, pb: 3 }}>
          {' '}
          {/* Adjusted padding */}
          <Typography
            variant="body1" // Changed from h5 for a less prominent message
            // mb={!isLargeScreen && 2} // Already handled by Box spacing
            color={reverseTextColor}
            // fontWeight={700} // Normal weight for a softer message
          >
                        You do not have any past campaigns yet. Get started by creating one!
          </Typography>
        </Box>
      )}
    </>
  );
};

export default HeaderContent;

