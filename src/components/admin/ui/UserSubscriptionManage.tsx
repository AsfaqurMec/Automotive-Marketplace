'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Divider,
  Stack,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  CreditCard as CreditCardIcon,
  Event as EventIcon,
  AddCard as AddCardIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CheckoutForm from '@/components/ui/CheckoutForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addSubscription, getSubscriptions } from '@/lib/api/subscription';
import useAuth from '@/lib/hooks/useAuth';
import { Subscription } from '@/types';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}

interface CurrentPlan {
  _id: string;
  planName: string;
  price: number;
  paymentMethodId?: string;
}

const initialUserCards = [
  { id: 'card_1', brand: 'Visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: 'card_2', brand: 'Mastercard', last4: '8210', expiry: '08/25', isDefault: false },
];

// --- Reusable TabPanel ---
function TabPanel({ children, value, index }: { children: React.ReactNode, value: number, index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

// --- Plan Modal UI and Plans Grid ---
function SubscriptionPlansViewer({
  plans,
  onSelectPlan,
  selectedPlan,
  openModal,
  handleCloseModal,
  handlePay,
}: {
    plans: Subscription[];
    onSelectPlan: (planId: string) => void;
    selectedPlan: Subscription | null;
    openModal: boolean;
    handleCloseModal: () => void;
    handlePay: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h3" gutterBottom align="center" fontWeight={700}>
        {t('chooseYourPlan')}
      </Typography>
      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 6 }}>
        {t('simpleTransparentPricing')}
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {plans.map((plan) => (
          <Grid item key={plan._id} xs={12} sm={6} md={4}>
            <Card
              elevation={plan.planName === 'Standard' ? 8 : 2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                border: plan.planName === 'Standard' ? '2px solid' : '1px solid',
                borderColor:
                                    plan.planName === 'Standard' ? 'primary.main' : 'grey.300',
                transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 12,
                },
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {plan.planName === 'Standard' && (
                <Chip
                  label={t('mostPopular')}
                  color="primary"
                  sx={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontWeight: 'bold',
                  }}
                />
              )}
              <CardHeader
                title={t(plan.planName)}
                subheader={t(plan.description)}
                titleTypographyProps={{
                  align: 'center',
                  variant: 'h5',
                  fontWeight: 'bold',
                }}
                subheaderTypographyProps={{
                  align: 'center',
                  color: 'text.secondary',
                }}
                sx={{ bgcolor: 'grey.50', pt: 4, borderRadius: 5 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h2" fontWeight="bold">
                                        ${plan.price}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                                        /{t('mo')}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <List>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${plan.features.carPostLimit} Car Posts`}
                    />
                  </ListItem>

                  {/* Lead Access */}
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      {plan.features.leadAccess ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" sx={{ opacity: 0.6 }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Lead Access"
                      sx={{
                        textDecoration: plan.features.leadAccess
                          ? 'none'
                          : 'line-through',
                        color: plan.features.leadAccess
                          ? 'text.primary'
                          : 'text.secondary',
                      }}
                    />
                  </ListItem>

                  {/* Featured Listings */}
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      {plan.features.featuredListing ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CancelIcon color="error" sx={{ opacity: 0.6 }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary="Featured Listings"
                      sx={{
                        textDecoration: plan.features.featuredListing
                          ? 'none'
                          : 'line-through',
                        color: plan.features.featuredListing
                          ? 'text.primary'
                          : 'text.secondary',
                      }}
                    />
                  </ListItem>

                  {/* Support Level */}
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${plan.features.supportLevel || 'Standard'} Support`}
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant={
                    plan.planName === 'Standard' ? 'contained' : 'outlined'
                  }
                  onClick={() => onSelectPlan(plan._id)}
                >
                  {t('choosePlan')}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle align="center" fontWeight="bold">
          {t('planDetails')}
        </DialogTitle>
        <DialogContent dividers>
          {selectedPlan && (
            <>
              <Typography variant="h5" align="center" gutterBottom>
                {t(selectedPlan.planName)}
              </Typography>
              <Typography variant="h6" align="center" color="text.secondary">
                {t(selectedPlan.description)}
              </Typography>
              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                                    ${selectedPlan.price} / {t('mo')}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${selectedPlan.features.carPostLimit} Car Posts`}
                  />
                </ListItem>

                {/* Lead Access */}
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    {selectedPlan.features.leadAccess ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" sx={{ opacity: 0.6 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Lead Access"
                    sx={{
                      textDecoration: selectedPlan.features.leadAccess
                        ? 'none'
                        : 'line-through',
                      color: selectedPlan.features.leadAccess
                        ? 'text.primary'
                        : 'text.secondary',
                    }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    {selectedPlan.features.featuredListing ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" sx={{ opacity: 0.6 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Featured Listings"
                    sx={{
                      textDecoration: selectedPlan.features.featuredListing
                        ? 'none'
                        : 'line-through',
                      color: selectedPlan.features.featuredListing
                        ? 'text.primary'
                        : 'text.secondary',
                    }}
                  />
                </ListItem>

                {/* Support Level */}
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`${selectedPlan.features.supportLevel || 'Standard'} Support`}
                  />
                </ListItem>
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="outlined">
            {t('cancel')}
          </Button>
          <Button onClick={handlePay} variant="contained">
            {t('pay')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// -- Keep rest of your components unchanged (UserSubscriptionDetails, UserPaymentDetails, etc.)

function UserSubscriptionDetails({ currentPlan, paymentMethods, renew }: { currentPlan: CurrentPlan | null, paymentMethods: PaymentMethod[], renew: string }) {
  const { t } = useTranslation();

  const renewDate = new Date(renew).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!currentPlan) {
    return (
      <Paper sx={{ textAlign: 'center', p: 4, maxWidth: 600, mx: 'auto', borderRadius: 4 }}>
        <InfoIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
        <Typography variant="h6">{t('notSubscribed')}</Typography>
      </Paper>
    );
  }

  const activeCard = paymentMethods.find((card) => card.id === currentPlan.paymentMethodId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom align="center" fontWeight={600}>
        {t('mySubscription')}
      </Typography>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 700, mx: 'auto', borderRadius: 4 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="overline" color="text.secondary">
              {t('currentPlan')}
            </Typography>
            <Chip
              icon={<WorkspacePremiumIcon />}
              label={t(currentPlan.planName)}
              color="success"
              sx={{ fontSize: '1.1rem', p: 2.5, borderRadius: 2, fontWeight: 'bold' }}
            />
            <Typography variant="h4" fontWeight="bold">
                            ${currentPlan.price}
              <Typography component="span" color="text.secondary">
                                /{t('mo')}
              </Typography>
            </Typography>
          </Stack>
          <Stack spacing={2} justifyContent="center" flexGrow={1}>
            <Typography variant="overline" color="text.secondary">
              {t('billingInfo')}
            </Typography>
            {activeCard && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CreditCardIcon color="action" />
                <Typography>
                  {activeCard.brand} {t('endingIn')} {activeCard.last4}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <EventIcon color="action" />
              <Typography>
                {t('renewal')}: <strong>{renewDate}</strong>
              </Typography>
            </Box>
          </Stack>
        </Stack>
        {/* <Divider sx={{ my: 3 }} /> */}
        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
          <Button variant="outlined" color="secondary">{t('cancelSubscription')}</Button>
          <Button variant="contained" color="primary">{t('manageBilling')}</Button>
        </Stack> */}
      </Paper>
    </Box>
  );
}

function CardActionsMenu({ card, onSetDefault, onRemove }: { card: PaymentMethod, onSetDefault: (cardId: string) => void, onRemove: (cardId: string) => void }) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleAction = (action: () => void) => {
    action();
    handleClose();
  };

  return (
    <>
      <IconButton aria-label="card-actions" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => handleAction(() => onSetDefault(card.id))}
          disabled={card.isDefault}
        >
          {t('setAsDefault')}
        </MenuItem>
        <MenuItem
          onClick={() => handleAction(() => onRemove(card.id))}
          sx={{ color: 'error.main' }}
        >
          {t('remove')}
        </MenuItem>
      </Menu>
    </>
  );
}

function UserPaymentDetails() {
  const { t } = useTranslation();
  const [cards, setCards] = useState(initialUserCards);
  const [openAddCard, setOpenAddCard] = useState(false);

  const handleSetDefault = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((card) => ({ ...card, isDefault: card.id === cardId })),
    );
  };

  const handleRemoveCard = (cardId: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Stack
        direction={{ xs: 'column', sm: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={600}>
          {t('paymentMethods')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCardIcon />}
          onClick={() => setOpenAddCard(true)}
        >
          {t('addNewCard')}
        </Button>
        <CheckoutForm></CheckoutForm>
      </Stack>
      <Stack spacing={2}>
        {cards.length > 0 ? (
          cards.map((card) => (
            <Paper
              key={card.id}
              elevation={2}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CreditCardIcon sx={{ fontSize: 40 }} color="primary" />
                <Box>
                  <Typography variant="h6">
                    {card.brand} &bull; &bull; &bull; &bull; {card.last4}
                  </Typography>
                  <Typography color="text.secondary">
                    {t('expires')} {card.expiry}
                  </Typography>
                </Box>
                {card.isDefault && (
                  <Chip
                    label={t('default')}
                    color="success"
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </Box>
              <CardActionsMenu
                card={card}
                onSetDefault={handleSetDefault}
                onRemove={handleRemoveCard}
              />
            </Paper>
          ))
        ) : (
          <Paper
            sx={{
              textAlign: 'center',
              p: 4,
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}
          >
            <AddCardIcon color="action" sx={{ fontSize: 50, mb: 2 }} />
            <Typography variant="h6">{t('noPaymentMethodsFound')}</Typography>
            <Typography color="text.secondary">{t('addCardToGetStarted')}</Typography>
          </Paper>
        )}
      </Stack>
      <Dialog open={openAddCard} onClose={() => setOpenAddCard(false)}>
        <DialogTitle fontWeight="bold">{t('addANewCard')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('cardNumber')}
            type="text"
            fullWidth
            variant="outlined"
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label={t('expiryDate')}
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label={t('cvc')}
              type="text"
              fullWidth
              variant="outlined"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: '0 24px 16px' }}>
          <Button onClick={() => setOpenAddCard(false)}>{t('cancel')}</Button>
          <Button onClick={() => setOpenAddCard(false)} variant="contained">
            {t('addCard')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// --- Main Page ---
const UserSubscriptionManage: React.FC = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Subscription | null>(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => {
      if (!user) throw new Error('User not authenticated');
      return getSubscriptions(user);
    },
  });

  const userCurrentPlan = data?.data?.find((sub: Subscription) => sub._id === user?.subscriptionId);

  const handleTabChange = (e: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  const handleSelectPlan = (planId: string) => {
    const plan = data?.data.find((p: Subscription) => p._id === planId);
    if (plan) {
      setSelectedPlan(plan);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPlan(null);
  };

  const handlePay = async () => {
    if (!selectedPlan) return;
    const userId = user?._id as string;

    const price = selectedPlan?.price as number;
    const planName = encodeURIComponent(selectedPlan?.planName as string); // optional

    await addSubscription({ userId });
    queryClient.invalidateQueries({ queryKey: ['subscription'] });

    const redirectUrl = `https://secure.2checkout.com/checkout/purchase?sid=255627191290&mode=2CO&li_0_type=product&li_0_name=${planName}&li_0_price=${price}`;

    window.location.href = redirectUrl;
    handleCloseModal();
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={1}>
        <Container maxWidth="lg">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant={isSmallScreen ? 'scrollable' : 'standard'}
            centered={!isSmallScreen}
            scrollButtons={isSmallScreen ? 'auto' : false}
          >
            <Tab label={t('availablePlans')} />
            <Tab label={t('mySubscriptionTab')} />
            <Tab label={t('paymentDetails')} />
          </Tabs>
        </Container>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <TabPanel value={tabValue} index={0}>
          <SubscriptionPlansViewer
            plans={data?.data || []}
            onSelectPlan={handleSelectPlan}
            openModal={openModal}
            selectedPlan={selectedPlan}
            handleCloseModal={handleCloseModal}
            handlePay={handlePay}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <UserSubscriptionDetails
            currentPlan={userCurrentPlan || null}
            renew={user?.renewDate || ''}
            paymentMethods={initialUserCards}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <UserPaymentDetails />
        </TabPanel>
      </Container>
    </Box>
  );
};

export default UserSubscriptionManage;
