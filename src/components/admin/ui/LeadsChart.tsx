import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';
import colors from '@/components/styles';
const data = [
  { name: 'United States', value: 0 },
  { name: 'Canada', value: 0 },
  { name: 'Mexico', value: 0 },
  { name: 'Other', value: 0 },
];

const COLORS = ['#C8A457', '#94E9B8', '#C8A457', '#92BFFF'];

const LeadsChart: React.FC = () => {
  const { background } = colors;

  return (
    <Card sx={{ minWidth: '100%', borderRadius: 4, background: background }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
                    Leads
        </Typography>
        <Box display="flex" justifyContent="center">
          <PieChart width={250} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              fill="#C8A457"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '80%',
            }}
          >
            {data.map((data) => {
              return (
                <Box
                  key={data.name}
                  sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography sx={{}}>{data.name}</Typography>
                  <Typography sx={{}}>{data.value}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LeadsChart;

