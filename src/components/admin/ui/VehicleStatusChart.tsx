import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import colors from '@/components/styles';
import { useTranslation } from 'react-i18next';

interface VehicleStatusChartProps {
  data?: any;
  loading?: boolean;
}

const VehicleStatusChart: React.FC<VehicleStatusChartProps> = ({ data, loading = false }) => {
  const { background } = colors;
  const { t } = useTranslation();

  // Default data structure
  const defaultData = [
    { name: t('available'), value: 0, color: '#4ADE80' },
    { name: t('sold'), value: 0, color: '#10B981' },
    { name: t('pending'), value: 0, color: '#FACC15' },
    { name: t('reserved'), value: 0, color: '#FB923C' },
  ];

  const chartData = data?.statusData || defaultData;
  const COLORS = chartData.map((item: any) => item.color);

  if (loading) {
    return (
      <Card sx={{ minWidth: '100%', borderRadius: 4, background: background }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('vehicleStatus')}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const totalVehicles = chartData.reduce((sum: number, item: any) => sum + item.value, 0);

  return (
    <Card sx={{ minWidth: '100%', borderRadius: 4, background: background }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('vehicleStatus')}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value, t('vehicles')]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '40%',
              pl: 2,
            }}
          >
            <Typography variant="h6" gutterBottom color="text.secondary">
              {t('totalVehicles')}: {totalVehicles}
            </Typography>
            {chartData.map((item: any, index: number) => {
              const percentage = totalVehicles > 0 ? ((item.value / totalVehicles) * 100).toFixed(1) : '0';
              return (
                <Box
                  key={item.name}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                    p: 1,
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.color,
                        borderRadius: '50%',
                        mr: 1
                      }}
                    />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body2" fontWeight="bold">
                      {item.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {percentage}%
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleStatusChart;
