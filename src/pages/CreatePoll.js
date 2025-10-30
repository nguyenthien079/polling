import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, Box, 
  IconButton, MenuItem, Alert, Fade, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

function CreatePoll() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [category, setCategory] = useState('general');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const categories = [
    { value: 'general', label: 'General', color: '#6366f1' },
    { value: 'sports', label: 'Sports', color: '#10b981' },
    { value: 'entertainment', label: 'Entertainment', color: '#ec4899' },
    { value: 'technology', label: 'Technology', color: '#8b5cf6' },
    { value: 'politics', label: 'Politics', color: '#f59e0b' },
    { value: 'other', label: 'Other', color: '#64748b' },
  ];

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validOptions = options.filter(opt => opt.trim() !== '');
    
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/polls', {
        title,
        description,
        options: validOptions,
        category
      });

      toast.success('Poll created successfully!');
      navigate(`/poll/${response.data.poll._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pt: 4, pb: 8, background: 'transparent' }}>
      <Container maxWidth="md">
        <Fade in timeout={600}>
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)',
                }}
                className="float"
              >
                <CreateIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Create New Poll
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Share your questions with the world and get instant feedback
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Poll Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
                placeholder="e.g., What's your favorite programming language?"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  },
                }}
              />

              <TextField
                fullWidth
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                multiline
                rows={3}
                placeholder="Add more context to your poll..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Category
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {categories.map((cat) => (
                    <Chip
                      key={cat.value}
                      label={cat.label}
                      onClick={() => setCategory(cat.value)}
                      sx={{
                        background: category === cat.value ? cat.color : '#f1f5f9',
                        color: category === cat.value ? 'white' : '#64748b',
                        fontWeight: 600,
                        border: category === cat.value ? 'none' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        '&:hover': {
                          background: category === cat.value ? cat.color : '#e2e8f0',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Poll Options
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Add at least 2 options for voters to choose from
                </Typography>

                {options.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      required
                      placeholder={`Enter option ${index + 1}`}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <IconButton
                      onClick={() => handleRemoveOption(index)}
                      disabled={options.length <= 2}
                      sx={{
                        ml: 1,
                        color: options.length <= 2 ? '#cbd5e1' : '#ef4444',
                        '&:hover': {
                          background: options.length <= 2 ? 'transparent' : '#fee2e2',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddOption}
                  variant="outlined"
                  sx={{ 
                    mb: 4,
                    borderRadius: 2,
                    borderColor: '#e2e8f0',
                    color: '#6366f1',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#6366f1',
                      background: '#f8fafc',
                    },
                  }}
                >
                  Add Another Option
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 700,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #db2777 0%, #7c3aed 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 30px rgba(236, 72, 153, 0.4)',
                    },
                  }}
                >
                  {loading ? 'Creating...' : '🚀 Create Poll'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/')}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    '&:hover': {
                      borderColor: '#cbd5e1',
                      background: '#f8fafc',
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default CreatePoll;
