import { Box, Typography, Select, MenuItem, Paper, CircularProgress } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SalesChartProps {
  data?: any;
  loading?: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, loading = false }) => {
  const [range, setRange] = useState<string>('6months');
  const { t } = useTranslation();

  // Default data structure
  const defaultData = [
    { month: 'Jan', current: 0, previous: 0 },
    { month: 'Feb', current: 0, previous: 0 },
    { month: 'Mar', current: 0, previous: 0 },
    { month: 'Apr', current: 0, previous: 0 },
    { month: 'May', current: 0, previous: 0 },
    { month: 'Jun', current: 0, previous: 0 },
    { month: 'Jul', current: 0, previous: 0 },
  ];

  const chartData = data?.chartData || defaultData;

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    // Here you would typically refetch data based on the new range
    // For now, we'll just update the local state
  };

  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', bgcolor: '#fff', minWidth: '100%' }}>
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', bgcolor: '#fff', minWidth: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography fontWeight="600">{t('salesDetails')}</Typography>
        <Select
          size="small"
          value={range}
          onChange={(e) => handleRangeChange(e.target.value)}
          sx={{ fontSize: '14px' }}
        >
          <MenuItem value="3months">{t('last3Months')}</MenuItem>
          <MenuItem value="6months">{t('last6Months')}</MenuItem>
          <MenuItem value="1year">{t('lastYear')}</MenuItem>
        </Select>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
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
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="current"
            stroke="#4ADE80"
            strokeWidth={3}
            dot={{ fill: '#4ADE80', strokeWidth: 2, r: 4 }}
            name={t('currentPeriod')}
          />
          <Line
            type="monotone"
            dataKey="previous"
            stroke="#FACC15"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#FACC15', strokeWidth: 2, r: 4 }}
            name={t('previousPeriod')}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SalesChart;

