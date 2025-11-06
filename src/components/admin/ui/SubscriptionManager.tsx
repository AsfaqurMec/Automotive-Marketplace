'use client';
import React, { useState } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  Grid,
  Paper,
  InputAdornment,
  Toolbar,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MonetizationOn as MonetizationOnIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  ListAlt as ListAltIcon,
  CheckCircle as CheckCircleIcon,
  SupportAgent as SupportAgentIcon,
  AddCircle as AddCircleIcon,
  Note as NoteIcon,
  Visibility as VisibilityIcon,
  ToggleOn,
  ToggleOff,
  Done,
  Close,
  BusinessCenter,
  Style,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubscriptions, updateSubscription } from '@/lib/api/subscription';
import useAuth from '@/lib/hooks/useAuth';
import { toast } from 'react-toastify';
import { Subscription } from '@/types';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
  [key: string]: React.ReactNode | number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`subscription-tabpanel-${index}`}
      aria-labelledby={`subscription-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, sm: 3 } }}>{children}</Box>}
    </div>
  );
};

interface FeatureItemProps {
  icon: React.ReactElement<{ sx?: React.CSSProperties }, string | React.JSXElementConstructor<{ sx?: React.CSSProperties }>>;
  label: string;
  value: string | number;
}

const FeatureItem = ({ icon, label, value }: FeatureItemProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      py: 1.5,
      gap: 1,
      flexWrap: 'nowrap',
      overflow: 'hidden',
      width: '100%',
    }}
  >
    {/* Icon and Label */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
        flexShrink: 1,
      }}
    >
      {React.cloneElement(icon, { sx: { color: 'primary.main' } })}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: 'text.secondary',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>

    {/* Value */}
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: 0,
        maxWidth: '60%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Box>
    </Box>
  </Box>
);

interface FeatureSwitchProps {
  isEditing: boolean;
  icon: React.ReactElement<{ sx?: unknown }, string | React.JSXElementConstructor<{ sx?: unknown }>>;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FeatureSwitch = ({ isEditing, icon, label, checked, onChange }: FeatureSwitchProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      py: 1,
      px: 2,
      borderRadius: 2,
      background: isEditing ? '#f9fafb' : 'transparent',
      border: isEditing ? '1px solid #e0e0e0' : 'none',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {React.cloneElement(icon, { sx: { mr: 2, color: 'primary.main' } })}
      <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
        {label}
      </Typography>
    </Box>
    {isEditing ? (
      <Switch checked={checked} onChange={onChange} color="primary" />
    ) : checked ? (
      <Done color="success" />
    ) : (
      <Close color="error" />
    )}
  </Box>
);

const SubscriptionManager: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState<number>(0);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState<(Partial<Subscription> & Record<string, unknown>) | null>(null);

  const {
    data: plans,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getSubscriptions(user);
    },
  });

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscription> }) => {
      if (!user) throw new Error('User not authenticated');
      return updateSubscription(id, data, user);
    },
    onSuccess: () => {
      toast.success('Subscription Updated Successfully!');
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setEditingPlanId(null);
      setFormData(null);
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setEditingPlanId(null);
    setFormData(null);
  };

  const handleEdit = (plan: Subscription) => {
    if (user?.role?.roleId === 'admin') {
      setEditingPlanId(plan._id);
      setFormData(JSON.parse(JSON.stringify(plan)));
    } else {
      toast.error('Only admin can edit subscriptions!');
    }
  };

  const handleCancel = () => {
    setEditingPlanId(null);
    setFormData(null);
  };

  const handleSave = () => {
    if (formData && formData._id) {
      mutation.mutate({ id: formData._id, data: formData });
    }
  };

  const handleChange = (path: string, value: string | number | boolean) => {
    const keys = path.split('.');
    const updatedData = { ...formData };
    let current = updatedData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;
    setFormData(updatedData);
  };

  const textFieldStyles = (isEditing: boolean) => ({
    '& .MuiInputBase-root': {
      background: isEditing ? '#fff' : '#f9fafb',
      borderRadius: 2,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: isEditing ? '1px solid #d1d5db' : 'none',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: '#111827',
      color: '#111827',
      fontWeight: 600,
    },
  });

  if (isLoading) return <Typography>{t('loading')}</Typography>;
  if (isError) return <Typography color="error">{t('error-loading-subscriptions')}</Typography>;
  if (!plans) return null;

  const localizedPlans = plans?.data?.map((plan) => ({
    ...plan,
    planName: t(`${plan.planName.toLowerCase()}`),
    description: t(`${plan.planName.toLowerCase()}`),
    notes: t(`${plan.planName.toLowerCase()}`),
    features: {
      ...plan.features,
      supportLevel: t(`supportLevel_${plan.features.supportLevel?.toLowerCase?.()}`),
    },
  }));

  return (
    <Paper
      elevation={0}
      sx={{
        mx: { xs: 0, sm: 2 },
        my: { xs: 2, sm: 2 },
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0',
        background: '#fcfcfc',
      }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: '1px solid #e0e0e0' }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          {localizedPlans.map((plan) => (
            <Tab
              label={plan.planName}
              key={plan._id}
              id={`subscription-tab-${plan._id}`}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '1rem' }}
            />
          ))}
        </Tabs>
      </AppBar>

      {localizedPlans.map((plan, index) => {
        const isEditing = editingPlanId === plan._id;
        const currentData = isEditing ? formData : plan;

        return (
          <TabPanel value={tabValue} index={index} key={plan._id}>
            <Toolbar
              sx={{
                justifyContent: 'space-between',
                px: '0 !important',
                mb: 3,
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Typography
                variant="h4"
                color="primary"
                sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}
              >
                <Style sx={{ mr: 1.5, fontSize: '2.5rem' }} />
                {plan.planName} {t('plan')}
              </Typography>

              {isEditing ? (
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    startIcon={
                      mutation.isPending ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <SaveIcon />
                      )
                    }
                    sx={{
                      mr: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {mutation.isPending ? t('saving') : t('saveChanges')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                    disabled={mutation.isPending}
                  >
                    {t('cancel')}
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  startIcon={
                    <EditIcon style={{ marginLeft: 3, marginRight: 3 }} />
                  }
                  onClick={() => handleEdit(plan)}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  {t('editPlan')}
                </Button>
              )}
            </Toolbar>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 3, background: '#fff' }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t('coreDetails')}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label={t('planName')}
                        value={currentData?.planName}
                        fullWidth
                        disabled={!isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange('planName', e.target.value)
                        }
                        sx={textFieldStyles(isEditing)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessCenter />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label={t('priceUSD')}
                        type="number"
                        value={currentData?.price}
                        fullWidth
                        disabled={!isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(
                            'price',
                            parseFloat(e.target.value),
                          )
                        }
                        sx={textFieldStyles(isEditing)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MonetizationOnIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label={t('description')}
                        multiline
                        value={currentData?.description}
                        fullWidth
                        disabled={!isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange('description', e.target.value)
                        }
                        sx={textFieldStyles(isEditing)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <DescriptionIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Features Card */}
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    background: '#fff',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t('planFeatures')}
                  </Typography>
                  <FeatureItem
                    icon={<EventIcon />}
                    label={t('durationDays')}
                    value={currentData?.durationDays || 0}
                  />
                  {isEditing && (
                    <TextField
                      size="small"
                      type="number"
                      value={currentData?.durationDays}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          'durationDays',
                          parseInt(e.target.value, 10),
                        )
                      }
                      sx={{ mt: 1, width: '100%' }}
                    />
                  )}
                  <Divider sx={{ my: 1 }} />
                  <FeatureItem
                    icon={<ListAltIcon />}
                    label={t('carPostLimit')}
                    value={currentData?.features?.carPostLimit || 0}
                  />
                  {isEditing && (
                    <TextField
                      size="small"
                      type="number"
                      value={currentData?.features?.carPostLimit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          'features.carPostLimit',
                          parseInt(e.target.value, 10),
                        )
                      }
                      sx={{ mt: 1, width: '100%' }}
                    />
                  )}
                  <Divider sx={{ my: 1 }} />
                  <FeatureItem
                    icon={<SupportAgentIcon />}
                    label={t('supportLevel')}
                    value={currentData?.features?.supportLevel || ''}
                  />
                  {isEditing && (
                    <TextField
                      size="small"
                      value={currentData?.features?.supportLevel}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          'features.supportLevel',
                          e.target.value,
                        )
                      }
                      sx={{ mt: 1, width: '100%' }}
                    />
                  )}
                  <Divider sx={{ my: 1 }} />
                  <FeatureSwitch
                    isEditing={isEditing}
                    icon={<VisibilityIcon />}
                    label={t('leadAccess')}
                    checked={currentData?.features?.leadAccess ?? false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange('features.leadAccess', e.target.checked)
                    }
                  />
                  <Divider sx={{ my: 1 }} />
                  <FeatureSwitch
                    isEditing={isEditing}
                    icon={<CheckCircleIcon />}
                    label={t('featuredListing')}
                    checked={currentData?.features?.featuredListing ?? false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(
                        'features.featuredListing',
                        e.target.checked,
                      )
                    }
                  />
                </Paper>
              </Grid>

              {/* Ad Management Card */}
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 3,
                    background: '#fff',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t('adManagement')}
                  </Typography>
                  <FeatureItem
                    icon={<AddCircleIcon />}
                    label={t('totalAdLimit')}
                    value={currentData?.features?.ads?.totalCreateLimit || 0}
                  />
                  {isEditing && (
                    <TextField
                      size="small"
                      type="number"
                      value={currentData?.features?.ads?.totalCreateLimit}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          'features.ads.totalCreateLimit',
                          parseInt(e.target.value, 10),
                        )
                      }
                      sx={{ mt: 1, width: '100%' }}
                    />
                  )}
                  <Divider sx={{ my: 1 }} />
                  <FeatureItem
                    icon={<EventIcon />}
                    label={t('adDurationDays')}
                    value={currentData?.features?.ads?.createDurationDays || 0}
                  />
                  {isEditing && (
                    <TextField
                      size="small"
                      type="number"
                      value={currentData?.features?.ads?.createDurationDays}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(
                          'features.ads.createDurationDays',
                          parseInt(e.target.value, 10),
                        )
                      }
                      sx={{ mt: 1, width: '100%' }}
                    />
                  )}
                  <Divider sx={{ my: 1 }} />
                  <FeatureSwitch
                    isEditing={isEditing}
                    icon={<ToggleOn />}
                    label={t('canCreateAds')}
                    checked={currentData?.features?.ads?.canCreate ?? false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange('features.ads.canCreate', e.target.checked)
                    }
                  />
                  <Divider sx={{ my: 1 }} />
                  <FeatureSwitch
                    isEditing={isEditing}
                    icon={<ToggleOff />}
                    label={t('canDeleteAds')}
                    checked={currentData?.features?.ads?.canDelete ?? false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange('features.ads.canDelete', e.target.checked)
                    }
                  />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 3, background: '#fff' }}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {t('otherDetails')}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label={t('status')}
                        value={currentData?.status}
                        fullWidth
                        disabled={!isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange('status', e.target.value)
                        }
                        sx={textFieldStyles(isEditing)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {currentData?.status === 'active' ? (
                                <CheckCircleIcon color="success" />
                              ) : (
                                <CancelIcon color="error" />
                              )}
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label={t('internalNotes')}
                        value={currentData?.notes}
                        fullWidth
                        disabled={!isEditing}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange('notes', e.target.value)
                        }
                        sx={textFieldStyles(isEditing)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <NoteIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>
        );
      })}
    </Paper>
  );
};

export default SubscriptionManager;

