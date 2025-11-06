import { Card, CardContent, Typography } from '@mui/material';
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

const salesData = [
  { brand: 'Toyota', sales: 0 },
  { brand: 'Honda', sales: 0 },
  { brand: 'Hyundai', sales: 0 },
  { brand: 'Audi', sales: 0 },
  { brand: 'BMW', sales: 0 },
  { brand: 'Nissan', sales: 0 },
];

const BAR_COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#82ca9d', '#8dd1e1', '#a4de6c'];

const BrandSalesChart: React.FC = () => {
  const { background } = colors;
  const { t } = useTranslation();
  return (
    <Card sx={{ borderRadius: 4, background: background }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('brandSales')}
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={salesData} margin={{ top: 20, right: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="brand" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales">
              {salesData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BrandSalesChart;
