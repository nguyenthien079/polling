import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, Box, Button, Radio, 
  RadioGroup, FormControlLabel, CircularProgress, Chip,
  Divider, IconButton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import socketService from '../services/socket';
import PollChart from '../components/PollChart';
import ShareButtons from '../components/ShareButtons';
import DownloadButton from '../components/DownloadButton';
import MetaTags from '../components/MetaTags';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoll();
    
    // Join poll room for real-time updates
    socketService.joinPoll(id);

    // Listen for vote updates
    socketService.onVoteUpdate((data) => {
      if (data.pollId === id) {
        setPoll(data.poll);
      }
    });

    return () => {
      socketService.leavePoll(id);
      socketService.removeAllListeners();
    };
  }, [id]);

  const fetchPoll = async () => {
    try {
      const response = await api.get(`/polls/${id}`);
      setPoll(response.data.poll);
      
      // Check if user has liked this poll
      if (user && response.data.poll.likes.includes(user.id)) {
        setIsLiked(true);
      }
    } catch (error) {
      toast.error('Failed to load poll');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (selectedOption === null) {
      toast.error('Please select an option');
      return;
    }

    try {
      await api.post(`/polls/${id}/vote`, { optionIndex: selectedOption });
      setHasVoted(true);
      toast.success('Vote recorded!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like polls');
      return;
    }

    try {
      const response = await api.post(`/polls/${id}/like`);
      setIsLiked(response.data.liked);
      setPoll(prev => ({
        ...prev,
        likesCount: response.data.likesCount
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Failed to like poll');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await api.delete(`/polls/${id}`);
        toast.success('Poll deleted successfully');
        navigate('/my-polls');
      } catch (error) {
        toast.error('Failed to delete poll');
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!poll) return null;

  const isOwner = user && poll.creator._id === user.id;

  // Prepare meta information for social sharing
  const metaTitle = `📊 ${poll.title} - Vote Now!`;
  const metaDescription = poll.description 
    ? `${poll.description.substring(0, 150)}... | ${poll.totalVotes} votes • Created by ${poll.creator?.username}`
    : `Cast your vote on this poll! ${poll.totalVotes} people have already voted. Created by ${poll.creator?.username}`;
  const metaUrl = window.location.href;

  return (
    <>
      <MetaTags 
        title={metaTitle}
        description={metaDescription}
        url={metaUrl}
      />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }} id="poll-detail">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              {poll.title}
            </Typography>
          {isOwner && (
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          {poll.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={poll.category} color="primary" variant="outlined" />
          <Chip label={`${poll.totalVotes} votes`} />
          <Chip 
            icon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
            label={poll.likesCount}
            onClick={handleLike}
            color={isLiked ? 'primary' : 'default'}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>
          Created by {poll.creator?.username} • {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {!hasVoted && isAuthenticated ? (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Cast Your Vote
            </Typography>
            <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(Number(e.target.value))}>
              {poll.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              onClick={handleVote}
              sx={{ mt: 2 }}
              disabled={selectedOption === null}
            >
              Submit Vote
            </Button>
          </Box>
        ) : (
          <>
            {!isAuthenticated && (
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Please login to vote
              </Typography>
            )}
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Results
        </Typography>

        {poll.totalVotes > 0 ? (
          <>
            <Box sx={{ mb: 3 }}>
              {poll.options.map((option, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{option.text}</Typography>
                    <Typography>
                      {option.votes} votes 
                      ({poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(1) : 0}%)
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    width: '100%', 
                    height: 8, 
                    bgcolor: 'grey.300', 
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      width: `${poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0}%`,
                      height: '100%',
                      bgcolor: 'primary.main',
                      transition: 'width 0.3s ease'
                    }} />
                  </Box>
                </Box>
              ))}
            </Box>

            <PollChart poll={poll} type="pie" />
          </>
        ) : (
          <Typography color="text.secondary">
            No votes yet. Be the first to vote!
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Share this poll:
            </Typography>
            <ShareButtons poll={poll} />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Download results:
            </Typography>
            <DownloadButton elementId="poll-detail" filename={`poll-${poll._id}`} />
          </Box>
        </Box>
      </Paper>
    </Container>
    </>
  );
}

export default PollDetail;
