import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import DashboardCard from '@/components/admin/ui/DashboardCard';
import SalesChart from '@/components/admin/ui/SalesChart';
import VehicleBrandChart from '@/components/admin/ui/VehicleBrandChart';
import VehicleStatusChart from '@/components/admin/ui/VehicleStatusChart';
import colors from '@/components/styles';
import { useTranslation } from 'react-i18next';
import { getDashboardSummary } from '@/lib/api/dealer';
import { useQuery } from '@tanstack/react-query';
import useAuth from '@/lib/hooks/useAuth';

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { text } = colors;
  const { user } = useAuth();
  
  const style = {
    color: text,
    textAlign: { xs: 'center', md: 'end' },
    fontFamily: 'Rubik',
    fontSize: '28px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    letterSpacing: '-0.114px',
    my: 3,
  };

  const {
    data: summary,
    isLoading: summaryLoading,
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
    enabled: !!user,
  });

  const isAdmin = user?.role?.roleId === 'admin';
  const isDealer = user?.role?.roleId === 'dealer';

  // Mock data for charts until backend endpoints are implemented
  const mockSalesData = {
    chartData: [
      { month: 'Jan', current: 12, previous: 8 },
      { month: 'Feb', current: 15, previous: 10 },
      { month: 'Mar', current: 18, previous: 12 },
      { month: 'Apr', current: 22, previous: 15 },
      { month: 'May', current: 25, previous: 18 },
      { month: 'Jun', current: 28, previous: 20 },
      { month: 'Jul', current: 30, previous: 22 },
    ]
  };

  const mockBrandData = {
    brandData: [
      { brand: 'Toyota', vehicles: 45 },
      { brand: 'Honda', vehicles: 32 },
      { brand: 'Hyundai', vehicles: 28 },
      { brand: 'Audi', vehicles: 15 },
      { brand: 'BMW', vehicles: 22 },
      { brand: 'Nissan', vehicles: 18 },
      { brand: 'Mercedes', vehicles: 12 },
      { brand: 'Ford', vehicles: 25 },
    ]
  };

  const mockStatusData = {
    statusData: [
      { name: t('available'), value: 120, color: '#4ADE80' },
      { name: t('sold'), value: 85, color: '#10B981' },
      { name: t('pending'), value: 25, color: '#FACC15' },
      { name: t('reserved'), value: 15, color: '#FB923C' },
    ]
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h5" fontWeight="bold" sx={style}>
        {t('dashboard')}
      </Typography>

      <Grid container spacing={2}>
        {/* Admin-only cards */}
        {isAdmin && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard
                title={t('totalDealer')}
                value={summary?.totalDealer || 25}
                change={5}
                iconType="users"
                color="#A78BFA"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard
                title={t('totalUser')}
                value={summary?.totalUser || 150}
                change={8}
                iconType="box"
                color="#FACC15"
              />
            </Grid>
          </>
        )}

        {/* Dealer-only card */}
        {isDealer && (
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title={t('totalVehicle')}
              value={summary?.totalVehicle || 45}
              change={12}
              iconType="car"
              color="#3B82F6"
            />
          </Grid>
        )}

        {/* Common cards for all users */}
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title={t('totalSales')}
            value={summary?.totalSales || 89}
            change={15}
            iconType="sales"
            color="#4ADE80"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title={t('totalEarn')}
            value={`$${summary?.totalEarnings || 12500}`}
            change={22}
            iconType="earnings"
            color="#10B981"
          />
        </Grid>
      </Grid>

      {/* Sales Chart */}
      <Grid container spacing={2} mt={3}>
        <SalesChart data={mockSalesData} loading={summaryLoading} />
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} md={8}>
          <VehicleBrandChart data={mockBrandData} loading={summaryLoading} />
        </Grid>
        <Grid item xs={12} md={4}>
          <VehicleStatusChart data={mockStatusData} loading={summaryLoading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardScreen;

