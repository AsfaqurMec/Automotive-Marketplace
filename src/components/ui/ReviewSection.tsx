import React from 'react';
import { Box, Typography, Button, Avatar, Divider, Rating, Stack } from '@mui/material';
import { FaPen } from 'react-icons/fa';

const reviews = [
  {
    name: 'Kam Sans',
    date: 'June 25, 2024',
    rating: 4.5,
    comment:
            'This car has been the best I have owned so far. Even if you are not looking at a Tesla, EVs in general are so much fun! I’ve had little maintenance in the three years I’ve had this car so far (tire rotations, wiper blades). Every major software update brings either new features or improvements.',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    name: 'Kam Sans',
    date: 'June 25, 2024',
    rating: 4.5,
    comment:
            'This car has been the best I have owned so far. Even if you are not looking at a Tesla, EVs in general are so much fun! I have had little maintenance in the three years I have had this car so far (tire rotations, wiper blades). Every major software update brings either new features or improvements.',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    name: 'Kam Sans',
    date: 'June 25, 2024',
    rating: 4.5,
    comment:
            'This car has been the best I have owned so far. Even if you are not looking at a Tesla, EVs in general are so much fun! I have had little maintenance in the three years I’ve had this car so far (tire rotations, wiper blades). Every major software update brings either new features or improvements.',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
];

const ReviewSection: React.FC = () => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 2,
        fontFamily: 'rubik',
        textAlign: 'end',
        maxWidth: '1200px',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="end" mb={2}>
        <Button
          startIcon={<FaPen />}
          variant="outlined"
          size="small"
          sx={{ borderRadius: 5 }}
        >
                    Write a Review
        </Button>
        <Box textAlign="end">
          <Typography variant="subtitle2" fontWeight={600}>
                        Review & Rating
          </Typography>
          <Typography variant="caption">
                        See what others are saying about the <strong>Mercedes-Benz GLA</strong>
          </Typography>
        </Box>
      </Box>

      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
                    4.8
        </Typography>
        <Rating name="read-only" value={4.8} precision={0.5} readOnly />
        <Typography variant="caption">(27 Reviews)</Typography>
      </Box>

      {reviews.map((review, index) => (
        <Box key={index} mb={3}>
          <Typography fontWeight={600}>
                        This car has been the best I have owned so far.
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={'end'}
            spacing={1}
            mt={1}
          >
            <Box>
              <Rating value={review.rating} precision={0.5} readOnly size="small" />
              <Typography variant="body2">{review.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {review.date}
              </Typography>
            </Box>

            <Avatar
              src={review.avatarUrl}
              alt={review.name}
              sx={{ width: 24, height: 24, borderRadius: '0%' }}
            />
          </Stack>
          <Typography variant="body2" mt={1}>
            {review.comment}
          </Typography>
          {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}

      <Box textAlign="center">
        <Button variant="outlined" sx={{ borderRadius: 5 }}>
                    Show More
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewSection;

