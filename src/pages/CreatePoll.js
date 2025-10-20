import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, Box, 
  IconButton, MenuItem, Alert 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
    'general', 'sports', 'entertainment', 'technology', 'politics', 'other'
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Poll
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Poll Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            select
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Options
          </Typography>

          {options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <IconButton
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddOption}
            variant="outlined"
            sx={{ mb: 3 }}
          >
            Add Option
          </Button>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Poll'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreatePoll;
