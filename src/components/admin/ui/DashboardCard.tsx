import { Box, Typography, Stack } from '@mui/material';
import { FaUsers, FaBoxOpen, FaChartLine, FaClock, FaCar, FaDollarSign } from 'react-icons/fa';

interface DashboardCardProps {
  title: string;
  value: string | number;
  change: number;
  iconType: 'users' | 'box' | 'sales' | 'clock' | 'car' | 'earnings';
  color: string;
}

const icons = {
  users: <FaUsers size={24} color="#A78BFA" />,
  box: <FaBoxOpen size={24} color="#FACC15" />,
  sales: <FaChartLine size={24} color="#4ADE80" />,
  clock: <FaClock size={24} color="#FB923C" />,
  car: <FaCar size={24} color="#3B82F6" />,
  earnings: <FaDollarSign size={24} color="#10B981" />,
};

const DashboardCard = ({ title, value, change, iconType, color }: DashboardCardProps) => {
  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        p: 2,
        minWidth: 200,
        flex: 1,
        minHeight: '141px',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography fontSize={13} color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {value}
          </Typography>
        </Box>
        <Box sx={{ background: `${color}20`, borderRadius: '50%', p: 1 }}>
          {icons[iconType]}
        </Box>
      </Stack>

      <Typography fontSize={12} sx={{ mt: 1, color: change > 0 ? '#10B981' : '#EF4444' }}>
        {change > 0 ? '▲' : '▼'} {Math.abs(change)}% {change > 0 ? 'Up' : 'Down'} from
                yesterday
      </Typography>
    </Box>
  );
};

export default DashboardCard;

