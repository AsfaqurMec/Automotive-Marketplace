import React from 'react';
import { Grid, Typography, Box, Skeleton } from '@mui/material';
import DashboardCard from '@/components/admin/ui/DashboardCard';
import SalesChart from '@/components/admin/ui/SalesChart';
import VehicleBrandChart from '@/components/admin/ui/VehicleBrandChart';
import VehicleStatusChart from '@/components/admin/ui/VehicleStatusChart';
import colors from '@/components/styles';
import { useTranslation } from 'react-i18next';
import { getDashboardSummary } from '@/lib/api/dealer';
import { useQuery } from '@tanstack/react-query';
import useAuth from '@/lib/hooks/useAuth';
import { FaChartLine, FaCar } from 'react-icons/fa';
import { useCurrency } from '@/lib/hooks/CurrencyProvider';

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { text, textBlack, foreground, primary } = colors;
  const { user } = useAuth();
  const { formatFromUSD } = useCurrency();

  const {
    data: summary,
    isLoading: summaryLoading,
  } = useQuery({
    queryKey: ['dashboard-summary', user?._id],
    queryFn: () => getDashboardSummary(user?._id),
    enabled: !!user,
  });
 // console.log(summary);
  const isAdmin = user?.role?.roleId === 'admin' || user?.role?.roleId === 'superAdmin';
  const isDealer = user?.role?.roleId === 'dealer';

  // Transform carBrands object to array format for chart
  const transformBrandData = () => {
    if (!summary?.carBrands) return [];
    
    return Object.entries(summary.carBrands).map(([brand, count]) => {
      // Format brand name: MERCEDES-BENZ -> Mercedes Benz, TOYOTA -> Toyota
      const formattedBrand = brand
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      return {
        brand: formattedBrand,
        vehicles: count as number,
      };
    }).sort((a, b) => b.vehicles - a.vehicles);
  };

  // Transform carStatus object to array format for chart
  const transformStatusData = () => {
    if (!summary?.carStatus) {
      // Return default statuses with 0 if no data
      return [
        { name: t('available'), value: 0, color: '#4ADE80' },
        { name: t('sold'), value: 0, color: '#10B981' },
        { name: t('pending'), value: 0, color: '#FACC15' },
        { name: t('reserved'), value: 0, color: '#FB923C' },
        { name: 'Discontinued', value: 0, color: '#EF4444' },
      ];
    }
    
    const statusColors: Record<string, string> = {
      available: '#4ADE80',
      sold: '#10B981',
      pending: '#FACC15',
      reserved: '#FB923C',
      discontinued: '#EF4444',
    };

    const statusTranslations: Record<string, string> = {
      available: t('available'),
      sold: t('sold'),
      pending: t('pending'),
      reserved: t('reserved'),
      discontinued: 'Discontinued',
    };

    // Define all possible statuses to ensure they're all shown
    const allStatuses = ['available', 'sold', 'pending', 'reserved', 'discontinued'];
    
    return allStatuses.map((status) => ({
      name: statusTranslations[status] || status,
      value: (summary.carStatus[status] as number) || 0,
      color: statusColors[status] || '#94A3B8',
    }));
  };

  // Transform salesDetail array to chart format (showing amounts)
  // Ensures all 12 months are shown with current year and previous year revenue
  const transformSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    
    // Initialize all 12 months with 0 values
    const monthDataMap: Record<string, { current: number; previous: number }> = {};
    months.forEach(month => {
      monthDataMap[month] = { current: 0, previous: 0 };
    });

    // If we have salesDetail data, map it to the correct months and years
    if (summary?.salesDetail && Array.isArray(summary.salesDetail) && summary.salesDetail.length > 0) {
      summary.salesDetail.forEach((item: any) => {
        if (!item || typeof item !== 'object') return;

        // Extract amount
        const amount = item.amount || item.revenue || item.totalAmount || item.totalRevenue || 
                      item.salesAmount || item.salesRevenue || 
                      item.count || item.sales || item.value || 0;

        if (amount === 0) return;

        let monthKey: string;
        let itemYear: number;

        // Parse date to get month and year
        if (item.date) {
          const date = new Date(item.date);
          monthKey = months[date.getMonth()];
          itemYear = date.getFullYear();
        } else if (item.month) {
          // If month is provided but no date, try to extract from month string
          const monthName = item.month.toString().substring(0, 3);
          monthKey = months.find(m => m.toLowerCase() === monthName.toLowerCase()) || months[0];
          // If no year info, assume current year
          itemYear = item.year || currentYear;
        } else {
          // Skip if no date/month info
          return;
        }

        // Determine if this is current year or previous year data
        if (itemYear === currentYear) {
          // Sum amounts for current year
          monthDataMap[monthKey].current += amount;
        } else if (itemYear === previousYear) {
          // Sum amounts for previous year
          monthDataMap[monthKey].previous += amount;
        }
        // If year doesn't match current or previous, we ignore it
      });
    }

    // Convert map to array format for the chart
    return months.map(month => ({
      month,
      current: monthDataMap[month].current,
      previous: monthDataMap[month].previous,
    }));
  };

  // Calculate total vehicles from carStatus
  const calculateTotalVehicles = () => {
    if (!summary?.carStatus) return 0;
    return Object.values(summary.carStatus).reduce((sum: number, count: any) => sum + (count || 0), 0);
  };

  const brandData = {
    brandData: transformBrandData(),
  };

  const statusData = {
    statusData: transformStatusData(),
  };

  const salesData = {
    chartData: transformSalesData(),
  };

  // Format currency using currency context
  const formatCurrency = (amount: number) => {
    return formatFromUSD(amount);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh',
        background: foreground,
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: textBlack,
            fontFamily: 'Rubik',
            fontSize: { xs: '24px', md: '32px' },
            fontWeight: 600,
            mb: 1,
            letterSpacing: '-0.5px',
          }}
        >
          {t('dashboard')}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: text,
            fontSize: '16px',
            opacity: 0.7,
          }}
        >
          {isAdmin 
            ? (
              <>
                Welcome back!{' '}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: '20px',
                    color: textBlack,
                    opacity: 1,
                  }}
                >
                  {user?.fullName}
                </Box>
                {' '}Here's what's happening with your business today.
              </>
            )
            : (
              <>
                Welcome back!{' '}
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: '20px',
                    color: textBlack,
                    opacity: 1,
                  }}
                >
                  {user?.fullName}
                </Box>
                {' '}Here's an overview of your dealership performance.
              </>
            )
          }
        </Typography>
      </Box>

      {/* Statistics Cards Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: textBlack,
            fontFamily: 'Rubik',
            fontSize: '18px',
            fontWeight: 600,
            mb: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FaChartLine size={18} color={primary} />
          {t('summary')}
        </Typography>

        <Grid container spacing={3}>
          {/* Admin-only cards */}
          {isAdmin && (
            <>
              <Grid item xs={12} sm={6} lg={3}>
                {summaryLoading ? (
                  <Skeleton variant="rectangular" height={141} sx={{ borderRadius: '12px' }} />
                ) : (
                  <DashboardCard
                    title={t('totalDealer')}
                    value={summary?.totalDealer || 25}
                    change={5}
                    iconType="users"
                    color="#A78BFA"
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                {summaryLoading ? (
                  <Skeleton variant="rectangular" height={141} sx={{ borderRadius: '12px' }} />
                ) : (
                  <DashboardCard
                    title={t('totalUser')}
                    value={summary?.totalUser || 150}
                    change={8}
                    iconType="box"
                    color="#FACC15"
                  />
                )}
              </Grid>
            </>
          )}

          {/* Dealer-only card */}
          {isDealer && (
            <Grid item xs={12} sm={6} lg={3}>
              {summaryLoading ? (
                <Skeleton variant="rectangular" height={141} sx={{ borderRadius: '12px' }} />
              ) : (
                <DashboardCard
                  title={t('totalVehicle')}
                  value={calculateTotalVehicles() as number}
                  change={12}
                  iconType="car"
                  color="#3B82F6"
                />
              )}
            </Grid>
          )}

          {/* Common cards for all users */}
          <Grid item xs={12} sm={6} lg={3}>
            {summaryLoading ? (
              <Skeleton variant="rectangular" height={141} sx={{ borderRadius: '12px' }} />
            ) : (
              <DashboardCard
                title={t('totalSales')}
                value={summary?.totalSales || 0}
                change={15}
                iconType="sales"
                color="#4ADE80"
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {summaryLoading ? (
              <Skeleton variant="rectangular" height={141} sx={{ borderRadius: '12px' }} />
            ) : (
              <DashboardCard
                title={t('totalEarn')}
                value={formatCurrency(summary?.totalRevenue || 0)}
                change={22}
                iconType="earnings"
                color="#10B981"
              />
            )}
          </Grid>

          {/* Additional metrics for better insights */}
          {summary?.totalPending !== undefined && summary?.totalPending > 0 && (
            <Grid item xs={12} sm={6} lg={3}>
              {summaryLoading ? (
                <Skeleton variant="rectangular" height={141} sx={{ borderRadius: '12px' }} />
              ) : (
                <DashboardCard
                  title={t('totalPending')}
                  value={summary?.totalPending || 0}
                  change={-3}
                  iconType="clock"
                  color="#FB923C"
                />
              )}
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Sales Performance Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: textBlack,
            fontFamily: 'Rubik',
            fontSize: '18px',
            fontWeight: 600,
            mb: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FaChartLine size={18} color={primary} />
          {t('salesDetails')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SalesChart data={salesData} loading={summaryLoading} />
          </Grid>
        </Grid>
      </Box>

      {/* Analytics Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            color: textBlack,
            fontFamily: 'Rubik',
            fontSize: '18px',
            fontWeight: 600,
            mb: 2.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <FaCar size={18} color={primary} />
          {t('vehicleBrands')} & {t('vehicleStatus')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <VehicleBrandChart data={brandData} loading={summaryLoading} />
          </Grid>
          <Grid item xs={12} md={5}>
            <VehicleStatusChart data={statusData} loading={summaryLoading} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardScreen;

