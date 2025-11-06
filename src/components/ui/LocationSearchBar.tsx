import React, { useState } from 'react';
import { TextField, Button, Chip, Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import colors from '../styles';
const LocationSearchBar = ({ text }: { text: string }) => {
  const textBlack = colors.textBlack;

  const formLabelStyles = {
    fontFamily: 'Rubik',
    fontSize: '36px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    color: textBlack,
    mb: 2,
  };
  const [location, setLocation] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleSearch = () => {
    if (location) {
      setSelectedLocation(location);
      setLocation('');
    }
  };

  return (
    <Box textAlign="center" mt={2}>
      <Typography variant="h6" sx={formLabelStyles}>
        {text}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={'center'}
        gap={1}
        sx={{
          backgroundColor: '#f9f9f9',
          padding: 1,
          borderRadius: 3,
          maxWidth: 600,
          margin: 'auto',
        }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: '#caa858', color: 'white', minWidth: 120 }}
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
                    Search
        </Button>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Enter location or vehicle"
          size="small"
          value={location}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLocation(e.target.value)}
        />
        {selectedLocation && (
          <Chip
            label={selectedLocation}
            icon={<LocationOnIcon />}
            sx={{ backgroundColor: '#fffbf0', color: 'black' }}
            onDelete={() => setSelectedLocation(null)}
          />
        )}
      </Box>
    </Box>
  );
};

export default LocationSearchBar;

