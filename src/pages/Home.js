import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Box, CircularProgress, 
  Tabs, Tab, TextField, InputAdornment, Fade, Chip 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import api from '../services/api';
import PollCard from '../components/PollCard';
import socketService from '../services/socket';

function Home() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPolls();

    socketService.onNewPoll((newPoll) => {
      setPolls(prev => [newPoll, ...prev]);
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await api.get('/polls');
      setPolls(response.data.polls);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPolls = polls
    .filter(poll => 
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (activeTab === 0) return new Date(b.createdAt) - new Date(a.createdAt); // Recent
      if (activeTab === 1) return b.totalVotes - a.totalVotes; // Popular
      if (activeTab === 2) return (b.likesCount || 0) - (a.likesCount || 0); // Trending
      return 0;
    });

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{ background: 'transparent' }}
      >
        <Box className="float" sx={{ mb: 3 }}>
          <WhatshotIcon sx={{ fontSize: 80, color: '#6366f1' }} />
        </Box>
        <CircularProgress size={50} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: '#1e293b', fontWeight: 600 }}>
          Loading awesome polls...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pt: 4, pb: 8, background: 'transparent' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 900,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              className="fade-in"
            >
              Discover Amazing Polls 🎯
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#64748b',
                maxWidth: 600,
                mx: 'auto',
                mb: 4,
                fontWeight: 400,
              }}
              className="fade-in"
            >
              Vote on trending topics, share your opinion, and see real-time results
            </Typography>

            {/* Search Bar */}
            <Box 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto',
                mb: 3,
              }}
              className="fade-in"
            >
              <TextField
                fullWidth
                placeholder="Search polls by title, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#6366f1' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  background: 'white',
                  borderRadius: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6366f1',
                    },
                  },
                }}
              />
            </Box>

            {/* Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Chip
                icon={<WhatshotIcon />}
                label={`${polls.length} Active Polls`}
                sx={{
                  background: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 2.5,
                  px: 1,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Chip
                icon={<TrendingUpIcon />}
                label={`${polls.reduce((sum, p) => sum + p.totalVotes, 0)} Total Votes`}
                sx={{
                  background: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 2.5,
                  px: 1,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
            </Box>
          </Box>
        </Fade>

        {/* Tabs */}
        <Box 
          sx={{ 
            mb: 4,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              background: 'white',
              borderRadius: 3,
              p: 0.5,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              '& .MuiTab-root': {
                borderRadius: 2,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                minHeight: 48,
                color: '#64748b',
              },
              '& .Mui-selected': {
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white !important',
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            <Tab icon={<AccessTimeIcon />} iconPosition="start" label="Recent" />
            <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Popular" />
            <Tab icon={<WhatshotIcon />} iconPosition="start" label="Trending" />
          </Tabs>
        </Box>

        {/* Polls Grid */}
        <Grid container spacing={3}>
          {filteredPolls.map((poll, index) => (
            <Fade in timeout={300 + index * 100} key={poll._id}>
              <Grid item xs={12} sm={6} md={4}>
                <PollCard poll={poll} />
              </Grid>
            </Fade>
          ))}
        </Grid>

        {filteredPolls.length === 0 && (
          <Fade in timeout={500}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#1e293b',
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                {searchQuery ? '🔍 No polls found' : '📝 No polls available yet'}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#64748b',
                }}
              >
                {searchQuery ? 'Try different keywords' : 'Be the first to create one!'}
              </Typography>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}

export default Home;
