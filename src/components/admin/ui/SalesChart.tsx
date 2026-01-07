import { Box, Typography, Select, MenuItem, Paper, CircularProgress } from '@mui/material';
import {
  AreaChart,
  Area,
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

  // Default data structure - all 12 months
  const defaultData = [
    { month: 'Jan', current: 0, previous: 0 },
    { month: 'Feb', current: 0, previous: 0 },
    { month: 'Mar', current: 0, previous: 0 },
    { month: 'Apr', current: 0, previous: 0 },
    { month: 'May', current: 0, previous: 0 },
    { month: 'Jun', current: 0, previous: 0 },
    { month: 'Jul', current: 0, previous: 0 },
    { month: 'Aug', current: 0, previous: 0 },
    { month: 'Sep', current: 0, previous: 0 },
    { month: 'Oct', current: 0, previous: 0 },
    { month: 'Nov', current: 0, previous: 0 },
    { month: 'Dec', current: 0, previous: 0 },
  ];

  const chartData = data?.chartData || defaultData;

  const handleRangeChange = (newRange: string) => {
    setRange(newRange);
    // Here you would typically refetch data based on the new range
    // For now, we'll just update the local state
  };

  if (loading) {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: '12px', 
          bgcolor: '#fff', 
          minWidth: '100%',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" height={350}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: '12px', 
        bgcolor: '#fff', 
        minWidth: '100%',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography 
            variant="h6" 
            fontWeight="600" 
            sx={{ color: '#1E1E1E', mb: 0.5 }}
          >
            {t('salesDetails')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
            Revenue overview by month
          </Typography>
        </Box>
        <Select
          size="small"
          value={range}
          onChange={(e) => handleRangeChange(e.target.value)}
          sx={{ 
            fontSize: '14px',
            minWidth: 140,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0',
            },
          }}
        >
          <MenuItem value="3months">{t('last3Months')}</MenuItem>
          <MenuItem value="6months">{t('last6Months')}</MenuItem>
          <MenuItem value="1year">{t('lastYear')}</MenuItem>
        </Select>
      </Box>

      <ResponsiveContainer width="100%" height={380}>
        <AreaChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {/* Gradient for current period - green */}
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.1}/>
            </linearGradient>
            {/* Gradient for previous period - orange/amber */}
            <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#f0f0f0"
            strokeWidth={1}
          />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 13, fill: '#666', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#666' }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => {
              if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
              return `$${value}`;
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)',
              padding: '12px 16px',
            }}
            formatter={(value: any, name: string) => {
              const formattedValue = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value);
              
              const currentYear = new Date().getFullYear();
              const previousYear = currentYear - 1;
              const label = name === 'current' ? `${currentYear}` : `${previousYear}`;
              return [formattedValue, label];
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px', color: '#1E1E1E' }}
            separator=""
          />
          <Legend 
            wrapperStyle={{ paddingTop: '24px' }}
            iconType="circle"
            iconSize={8}
            formatter={(value) => {
              const currentYear = new Date().getFullYear();
              const previousYear = currentYear - 1;
              return value === 'current' ? `${currentYear}` : `${previousYear}`;
            }}
            style={{ fontSize: '13px' }}
          />
          {/* Current period area (Current Year) - Green */}
          <Area
            type="monotone"
            dataKey="current"
            stroke="#4ADE80"
            strokeWidth={3}
            fill="url(#colorCurrent)"
            fillOpacity={1}
            dot={{ fill: '#fff', strokeWidth: 3, stroke: '#4ADE80', r: 5 }}
            activeDot={{ r: 7, stroke: '#4ADE80', strokeWidth: 2 }}
            name="current"
          />
          {/* Previous period area (Previous Year) - Orange/Amber */}
          <Area
            type="monotone"
            dataKey="previous"
            stroke="#F59E0B"
            strokeWidth={3}
            fill="url(#colorPrevious)"
            fillOpacity={1}
            dot={{ fill: '#fff', strokeWidth: 3, stroke: '#F59E0B', r: 5 }}
            activeDot={{ r: 7, stroke: '#F59E0B', strokeWidth: 2 }}
            name="previous"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SalesChart;

