import React from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  Typography,
  InputAdornment,
  Checkbox,
} from '@mui/material';
import {
  Search,
  AttachMoney,
  Speed,
  CalendarToday,
  DirectionsCar,
  LocalOffer,
} from '@mui/icons-material';
import colors from '../styles';
import { MdAutoAwesome } from 'react-icons/md';

interface VehicleSearchBarProps {
  text: string;
}

const VehicleSearchBar: React.FC<VehicleSearchBarProps> = ({ text }) => {
  const textBlack = colors.textBlack;
  const primary = colors.primary;
  const formLabelStyles = {
    fontFamily: 'Rubik',
    fontSize: '36px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };
  return (
    <Box sx={{ width: '100%', textAlign: 'center', p: 3, mb: 3 }}>
      <Typography sx={formLabelStyles} mb={2}>
        {text}
      </Typography>

      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <Button
            variant="contained"
            sx={{ bgcolor: '#C8A165', color: '#fff', px: 3, height: '100%' }}
          >
            <Search sx={{ mr: 1 }} /> Search
          </Button>
        </Grid>

        <Grid item>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            px={1.5}
            py={0.5}
            border={`1px solid ${primary}`} // gold outline
            borderRadius="12px"
            sx={{ width: 'fit-content', cursor: 'pointer' }}
          >
            <Checkbox size="small" />
            <MdAutoAwesome size={18} color="#d4af37" />
            <Typography fontWeight="500">Add Ai</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Select defaultValue="SUV" sx={{ width: 120 }}>
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="Sedan">Sedan</MenuItem>
            <MenuItem value="Truck">Truck</MenuItem>
          </Select>
        </Grid>

        <Grid item>
          <TextField
            label="Price"
            variant="outlined"
            defaultValue="$25,000"
            sx={{ width: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            label="Mileage"
            variant="outlined"
            defaultValue="40,000 km"
            sx={{ width: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Speed />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            label="Year"
            variant="outlined"
            defaultValue="2024"
            sx={{ width: 100 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarToday />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            label="Model"
            variant="outlined"
            defaultValue="Yaris Cross"
            sx={{ width: 140 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DirectionsCar />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            label="Brand"
            variant="outlined"
            defaultValue="Toyota"
            sx={{ width: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalOffer />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehicleSearchBar;

