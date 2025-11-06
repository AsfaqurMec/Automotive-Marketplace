'use client';

import React from 'react';
import { Box, Typography, Avatar, Switch, Grid } from '@mui/material';

const ChatProfile: React.FC = () => {
  return (
    <Box sx={{ width: '100%', p: 2, height: '100vh', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom>
                Profile
      </Typography>
      <Avatar
        alt="Lucas Brown"
        src="https://randomuser.me/api/portraits/men/35.jpg"
        sx={{ width: '100%', height: 200, mb: 2, borderRadius: '0' }}
      />
      <Typography variant="h6">Lucas Brown</Typography>
      <Typography variant="body2" color="textSecondary">
                Last seen recently
      </Typography>

      <Box mt={2}>
        <Typography variant="subtitle2">Bio</Typography>
        <Typography variant="body2">Life is mirror, smile at it 😊</Typography>
      </Box>

      <Box mt={2}>
        <Typography variant="subtitle2">Mobile</Typography>
        <Typography variant="body2">6462662535</Typography>
      </Box>

      <Box mt={2}>
        <Typography variant="body2">Mute Chat</Typography>
        <Switch size="small" />
      </Box>

      <Box mt={1}>
        <Typography variant="body2">Disappearing Messages</Typography>
        <Switch size="small" />
      </Box>

      <Box mt={3}>
        <Typography variant="subtitle2" gutterBottom>
                    Media, Links and Docs
        </Typography>
        <Grid container spacing={1}>
          {[...Array(6)].map((_, idx) => (
            <Grid item xs={4} key={idx}>
              <img
                src={`https://source.unsplash.com/random/100x100?sig=${idx}`}
                alt="media"
                style={{ width: '100%', borderRadius: 4 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ChatProfile;

