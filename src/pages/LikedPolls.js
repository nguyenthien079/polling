import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, CircularProgress, Fade 
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box className="float" sx={{ mb: 3 }}>
          <FavoriteIcon sx={{ fontSize: 80, color: '#ec4899' }} />
        </Box>
        <CircularProgress size={50} thickness={4} sx={{ color: '#ec4899' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#1e293b', fontWeight: 600 }}>
          Loading liked polls...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
      <Container maxWidth="lg">
        <Fade in timeout={600}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 900,
                mb: 1,
                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ❤️ Liked Polls
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b',
                fontWeight: 400,
              }}
            >
              Your favorite polls in one place
            </Typography>
          </Box>
        </Fade>
        
        <Grid container spacing={3}>
          {polls.map((poll, index) => (
            <Fade in timeout={300 + index * 100} key={poll._id}>
              <Grid item xs={12} sm={6} md={4}>
                <PollCard poll={poll} />
              </Grid>
            </Fade>
          ))}
        </Grid>

        {polls.length === 0 && (
          <Fade in timeout={500}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h4" sx={{ color: '#1e293b', fontWeight: 700, mb: 2 }}>
                💔 No liked polls yet
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Start liking polls to save them here!
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}

export default LikedPolls;
