'use client';
import { Card, Grid, Typography, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme, Theme, alpha } from '@mui/material/styles'; // Added alpha for transparency
import { useTranslation } from 'react-i18next';
import NextDealTab from '@/components/ui/NextDealTab';
import AdvertisementCard from '@/components/ui/AdvertisementCard';
import HeaderContent from '@/components/ui/HeaderContent';
import StickyBox from 'react-sticky-box';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import GoogleAdsSync from '@/components/admin/ui/GoogleAdsSync';
import { getCampaigns } from '@/lib/api/campaign';
import { useQuery } from '@tanstack/react-query';
import useAuth from '@/lib/hooks/useAuth';
import CustomLoaderForComponent from '@/components/ui/CustomLoaderForComponent';
import Cookies from 'js-cookie';
import { Campaign, User } from '@/types';

// Define the response type for campaigns API
interface CampaignsResponse {
  campaigns: Campaign[];

}

// Define the mutate function type
type MutateFunction = (params: { campaignId: string; PayerID: string; token: string }) => void;

const Advertisement: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme() as Theme;
  const isDarkMode = theme.palette.mode === 'dark';
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const { user } = useAuth();
  const [campaignsData, setCampaigns] = useState<Campaign[]>([]);
  const [hasAccessToken, setHasAccessToken] = useState(!!Cookies.get('google_ads_accessToken'));

  const [currentCampaignId, setCurrentCampaignId] = useState<string>('');
  const [value, setValue] = useState<number>(0);

  const { data, isLoading: isCampaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => getCampaigns(user?._id as string, user as User),
  });

  useEffect(() => {
    if (data) {
      setCampaigns((data?.data as unknown as CampaignsResponse)?.campaigns as Campaign[]);
    }
  }, [data]);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const statusMap = {
    0: 'all-campaigns',
    1: 'current-campaigns',
    2: 'past-campaigns',
    3: 'future-campaigns',
  };
  let mutate: MutateFunction | undefined;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const PayerID = urlParams.get('PayerID');
    const campaignId = urlParams.get('campaignId');

    if (token && PayerID && campaignId) {
      mutate?.({ campaignId, PayerID, token });
    }
  }, [mutate]);

  const status = statusMap[value as keyof typeof statusMap];
  const campaigns = useMemo(
    () =>
      (campaignsData || []).filter((camp: Campaign) => {
        const today = moment().format('YYYY-MM-DD');
        if (status === 'current-campaigns') {
          return (
            !moment(camp.endDate).isBefore(today) &&
            moment(camp.startDate).isSameOrBefore(today)
          );
        } else if (status === 'past-campaigns') {
          return moment(camp.endDate).isBefore(today);
        } else if (status === 'future-campaigns') {
          return moment(camp.startDate).isAfter(today);
        } else {
          return true;
        }
      }),
    [status, campaignsData],
  );

  useEffect(() => {
    if (campaigns.length) {
      setCurrentCampaignId((campaigns[0] as Campaign)._id);
    } else {
      setCurrentCampaignId('');
    }
  }, [campaigns]);

  const campaign: Campaign | undefined = campaigns.find((c: Campaign) => c._id === currentCampaignId);
  let invoiceLink = '';
  if (campaign?.payment) {
    if (campaign.payment.invoiceLink) {
      invoiceLink = campaign.payment.invoiceLink;
    } else if (campaign.payment.status !== 'succeeded') {
      invoiceLink = `/dashboard/advertisement/campaigns/${campaign?._id}/pay`;
    }
  } else if (campaign) {
    invoiceLink = `/dashboard/advertisement/campaigns/${campaign?._id}/pay`;
  }

  const totalImpressions =
        campaign?.impressions?.[campaign.impressions.length - 1]?.totalImpressions || 0;
  const totalClicks = campaign?.impressions?.[campaign.impressions.length - 1]?.totalClicks || 0;

  const allCampaignsCount = campaignsData?.length || 0;
  const currentCampaignsCount =
        campaignsData?.filter(
          (camp: Campaign) =>
            moment(camp.endDate).isSameOrAfter(moment().format('YYYY-MM-DD')) &&
                moment(camp.startDate).isSameOrBefore(moment().format('YYYY-MM-DD')),
        ).length || 0;

  const pastCampaignsCount =
        campaignsData?.filter((camp: Campaign) =>
          moment(camp.endDate).isBefore(moment().format('YYYY-MM-DD')),
        ).length || 0;

  const futureCampaignsCount =
        campaignsData?.filter((camp: Campaign) =>
          moment(camp.startDate).isAfter(moment().format('YYYY-MM-DD')),
        ).length || 0;

  const badgeStyleString = `
      color: ${theme.palette.primary.main}; 
      background-color: ${alpha(theme.palette.primary.main, isDarkMode ? 0.25 : 0.15)}; 
      border-radius: 50%; 
      padding: 2px 8px;
      margin-left: 8px;
      font-size: 0.8em; // Smaller font for badge
    `;

  const tabs = [
    `${t('allCampaigns')} <span style="${badgeStyleString}">${allCampaignsCount}</span>`,
    `${t('currentCampaigns')} <span style="${badgeStyleString}">${currentCampaignsCount}</span>`,
    `${t('pastCampaigns')} <span style="${badgeStyleString}">${pastCampaignsCount}</span>`,
    `${t('futureCampaigns')} <span style="${badgeStyleString}">${futureCampaignsCount}</span>`,
  ];

  const renderStatCards = (keySuffix: string) => (
    <Grid container spacing={4} key={`stats-${keySuffix}`}>
      <Grid item sm={12} xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 6,
            boxShadow: 3,
            py: 5,
            bgcolor: theme.palette.background.paper,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            fontSize={{ xs: 16, lg: 18 }}
            sx={{
              color: theme.palette.text.primary,
              fontWeight: '700',
              mb: !isLargeScreen ? 2 : 0,
            }}
          >
            {t('totalImpressions')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ color: theme.palette.text.secondary }}
          >
            {totalImpressions}
          </Typography>
        </Card>
      </Grid>
  
      <Grid item sm={12} xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 6,
            boxShadow: 3,
            py: 5,
            bgcolor: theme.palette.background.paper,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            fontSize={{ xs: 16, lg: 18 }}
            sx={{
              color: theme.palette.text.primary,
              fontWeight: '700',
              mb: !isLargeScreen ? 2 : 0,
            }}
          >
            {t('totalClicks')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ color: theme.palette.text.secondary }}
          >
            {totalClicks}
          </Typography>
        </Card>
      </Grid>
  
      <Grid item sm={12} xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 6,
            boxShadow: 3,
            py: 5,
            bgcolor: theme.palette.background.paper,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            fontSize={{ xs: 16, lg: 18 }}
            sx={{
              color: theme.palette.text.primary,
              fontWeight: '700',
              mb: !isLargeScreen ? 2 : 0,
            }}
          >
            {t('costPerClick')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ color: theme.palette.text.secondary }}
          >
            {totalClicks > 0
              ? `${((campaign?.payment?.price || 0) / totalClicks).toFixed(2)} USD`
              : '0.00 USD'}
          </Typography>
        </Card>
      </Grid>
  
      <Grid item sm={12} xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 6,
            boxShadow: 3,
            py: 5,
            bgcolor: theme.palette.background.paper,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            fontSize={{ xs: 16, lg: 18 }}
            sx={{
              color: theme.palette.text.primary,
              fontWeight: '700',
              mb: !isLargeScreen ? 2 : 0,
            }}
          >
            {t('clickThroughRate')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ color: theme.palette.text.secondary }}
          >
            {totalImpressions
              ? ((totalClicks / totalImpressions) * 100).toFixed(2)
              : '0.00'}{' '}
            %
          </Typography>
        </Card>
      </Grid>
  
      <Grid item sm={12} xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 6,
            boxShadow: 3,
            py: 5,
            bgcolor: theme.palette.background.paper,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            fontSize={{ xs: 16, lg: 18 }}
            sx={{
              color: theme.palette.text.primary,
              fontWeight: '700',
              mb: !isLargeScreen ? 2 : 0,
            }}
          >
            {t('costPerDay')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ color: theme.palette.text.secondary }}
          >
            {`$${
              campaign?.payment?.price && campaign.startDate && campaign.endDate
                ? (() => {
                    const days = Math.max(
                      1,
                      moment(campaign.endDate).diff(
                        moment(campaign.startDate),
                        'days'
                      ) + 1
                    );
                    return (campaign.payment.price / days).toFixed(2);
                  })()
                : '0.00'
            }`}
          </Typography>
        </Card>
      </Grid>
  
      <Grid item sm={12} xs={12} md={6}>
        <Card
          sx={{
            borderRadius: 6,
            boxShadow: 3,
            py: 5,
            bgcolor: theme.palette.background.paper,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            fontSize={{ xs: 16, lg: 18 }}
            sx={{
              color: theme.palette.text.primary,
              fontWeight: '700',
              mb: !isLargeScreen ? 2 : 0,
            }}
          >
            {t('totalCampaignCost')}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ color: theme.palette.text.secondary }}
          >
            {(campaign?.payment?.price || 0).toFixed(2)}&nbsp;USD
          </Typography>
        </Card>
      </Grid>
    </Grid>
  );
  


  const contents = [
    renderStatCards('all'),
    renderStatCards('current'),
    renderStatCards('past'),
    renderStatCards('future'),
  ];

  return (
    <>
      {isCampaignsLoading && <CustomLoaderForComponent />}
      <HeaderContent
        campaigns={campaigns}
        currentCampaignId={currentCampaignId}
        setCurrentCampaignId={setCurrentCampaignId}
        hasAccessToken={hasAccessToken}
      />
      <GoogleAdsSync setHasAccessToken={setHasAccessToken} />

      <Box sx={{ px: isLargeScreen ? 5 : 0, py: 2 }}>
        {' '}
        {/* Adjusted padding */}
        <Grid container spacing={isLargeScreen ? 4 : 2}>
          {' '}
          {/* Adjusted spacing */}
          <Grid item sm={12} xs={12} md={12} lg={8}>
            <Card
              sx={{
                borderRadius: 2, // Standardized border radius
                boxShadow: 3,
                pb: 3,
                pt: 2,
                px: isLargeScreen ? 3 : 2, // Adjusted padding
                background: theme.palette.background.paper, // Theme color
              }}
            >
              <NextDealTab
                tabs={tabs.map((tabLabelHtml) => {
                  // Extract just the text content without HTML for the tabs prop
                  const textContent = tabLabelHtml.replace(/<[^>]*>/g, '');
                  return textContent;
                })}
                contents={contents}
                handleChange={handleChange}
                value={value}
              />
            </Card>
          </Grid>
          <Grid item sm={12} xs={12} md={12} lg={4}>
            <StickyBox offsetTop={isLargeScreen ? 100 : 70} offsetBottom={20}>
              {' '}
              {/* Adjusted offsetTop */}
              <AdvertisementCard campaign={campaign as Campaign} invoiceLink={invoiceLink} />
            </StickyBox>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Advertisement;

