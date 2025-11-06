import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import colors from '@/components/styles';
import { useTranslation } from 'react-i18next';

interface VehicleBrandChartProps {
  data?: any;
  loading?: boolean;
}

const VehicleBrandChart: React.FC<VehicleBrandChartProps> = ({ data, loading = false }) => {
  const { background } = colors;
  const { t } = useTranslation();

  // Default data structure
  const defaultData = [
    { brand: 'Toyota', vehicles: 0 },
    { brand: 'Honda', vehicles: 0 },
    { brand: 'Hyundai', vehicles: 0 },
    { brand: 'Audi', vehicles: 0 },
    { brand: 'BMW', vehicles: 0 },
    { brand: 'Nissan', vehicles: 0 },
    { brand: 'Mercedes', vehicles: 0 },
    { brand: 'Ford', vehicles: 0 },
    { brand: 'Chevrolet', vehicles: 0 },
    { brand: 'Volkswagen', vehicles: 0 },
  ];

  const chartData = data?.brandData || defaultData;
  const BAR_COLORS = [
    '#8884d8', '#00C49F', '#FFBB28', '#82ca9d', '#8dd1e1', 
    '#a4de6c', '#ffc658', '#ff7c7c', '#87d068', '#ff9f7d'
  ];

  if (loading) {
    return (
      <Card sx={{ borderRadius: 4, background: background }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('vehicleBrands')}
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 4, background: background }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('vehicleBrands')}
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="brand" 
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: any) => [value, t('vehicles')]}
            />
            <Bar 
              dataKey="vehicles" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            >
              {chartData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Summary Stats */}
        <Box mt={2} p={2} sx={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('summary')}
          </Typography>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Typography variant="body2">
              <strong>{t('totalBrands')}:</strong> {chartData.length}
            </Typography>
            <Typography variant="body2">
              <strong>{t('totalVehicles')}:</strong> {chartData.reduce((sum: number, item: any) => sum + item.vehicles, 0)}
            </Typography>
            <Typography variant="body2">
              <strong>{t('topBrand')}:</strong> {chartData.reduce((max: any, item: any) => item.vehicles > max.vehicles ? item : max, chartData[0])?.brand}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleBrandChart;
