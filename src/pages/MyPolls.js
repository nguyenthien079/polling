import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, CircularProgress, Fade 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import api from '../services/api';
import PollCard from '../components/PollCard';

function MyPolls() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPolls();
  }, []);

  const fetchMyPolls = async () => {
    try {
      const response = await api.get('/polls/user/created');
      setPolls(response.data.polls || []);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box className="float" sx={{ mb: 3 }}>
          <DashboardIcon sx={{ fontSize: 80, color: '#6366f1' }} />
        </Box>
        <CircularProgress size={50} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: '#1e293b', fontWeight: 600 }}>
          Loading your polls...
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              📊 My Polls
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b',
                fontWeight: 400,
              }}
            >
              Manage and track your created polls
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
                📝 No polls created yet
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Start creating polls to engage with your audience!
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}

export default MyPolls;
