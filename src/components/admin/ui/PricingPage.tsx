import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { FaCheck } from 'react-icons/fa';

const plans = [
  {
    title: 'Free Plan',
    price: '$11',
    period: '/month',
    features: [
      '20,000 Visitors',
      'Create Unlimited Widgets',
      'CMS Integration',
      'All Widget Types',
    ],
    highlighted: false,
    featured: false,
  },
  {
    title: 'Highlighted Plan',
    price: '$36',
    period: '/month',
    features: [
      '50,000 Visitors',
      'Create Unlimited Widgets',
      'CMS Integration',
      'All Widget Types',
      'Integrations',
    ],
    highlighted: true,
    featured: false,
  },
  {
    title: 'Sponsored Plan',
    price: '$11',
    period: '/month',
    features: [
      '20,000 Visitors',
      'Create Unlimited Widgets',
      'CMS Integration',
      'All Widget Types',
      'Integrations',
      'Dedicated Manager',
    ],
    highlighted: false,
    featured: true,
  },
];

export default function PricingPageComponent() {
  return (
    <Box sx={{ px: 4, py: 6, backgroundColor: '#fafafa' }}>
      <Typography variant="h6" align="right" sx={{ mb: 4 }}>
                Plan
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Paper
              elevation={plan.featured ? 8 : 2}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: plan.featured ? '#c79f4c' : '#fff',
                color: plan.featured ? '#fff' : '#000',
                height: '100%',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {plan.title}
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {plan.price}
                <Typography component="span" variant="body1" ml={1}>
                  {plan.period}
                </Typography>
              </Typography>

              <List dense>
                {plan.features.map((feature, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <FaCheck
                        color={plan.featured ? 'white' : '#c79f4c'}
                        size={14}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      primaryTypographyProps={{
                        sx: { color: plan.featured ? 'white' : 'inherit' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              <Box mt={3}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: plan.featured ? '#fff' : '#c79f4c',
                    color: plan.featured ? '#c79f4c' : '#fff',
                    '&:hover': {
                      backgroundColor: plan.featured ? '#f5f5f5' : '#b88f3a',
                    },
                    borderRadius: 1,
                    textTransform: 'none',
                  }}
                >
                                    Create a free account
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

