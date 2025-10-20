import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import api from '../services/api';
import PollCard from '../components/PollCard';

function LikedPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedPolls();
  }, []);

  const fetchLikedPolls = async () => {
    try {
      const response = await api.get('/polls/user/liked');
      setPolls(response.data.polls || []);
    } catch (error) {
      console.error('Error fetching liked polls:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Liked Polls
      </Typography>
      
      <Grid container spacing={3}>
        {polls.map((poll) => (
          <Grid item xs={12} sm={6} md={4} key={poll._id}>
            <PollCard poll={poll} />
          </Grid>
        ))}
      </Grid>

      {polls.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          You haven't liked any polls yet.
        </Typography>
      )}
    </Container>
  );
}

export default LikedPolls;
