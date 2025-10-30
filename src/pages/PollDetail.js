import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, Box, Button, Radio, 
  RadioGroup, FormControlLabel, CircularProgress, Chip,
  Divider, IconButton, Fade, LinearProgress, Avatar
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import PeopleIcon from '@mui/icons-material/People';
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
    
    socketService.joinPoll(id);

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
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh">
        <Box className="float" sx={{ mb: 3 }}>
          <HowToVoteIcon sx={{ fontSize: 80, color: '#6366f1' }} />
        </Box>
        <CircularProgress size={50} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: '#1e293b', fontWeight: 600 }}>
          Loading poll...
        </Typography>
      </Box>
    );
  }

  if (!poll) return null;

  const isOwner = user && poll.creator._id === user.id;
  const metaTitle = `📊 ${poll.title} - Vote Now!`;
  const metaDescription = poll.description 
    ? `${poll.description.substring(0, 150)}... | ${poll.totalVotes} votes • Created by ${poll.creator?.username}`
    : `Cast your vote on this poll! ${poll.totalVotes} people have already voted. Created by ${poll.creator?.username}`;
  const metaUrl = window.location.href;

  const categoryColors = {
    general: '#6366f1',
    sports: '#10b981',
    entertainment: '#ec4899',
    technology: '#8b5cf6',
    politics: '#f59e0b',
    other: '#64748b',
  };

  const categoryColor = categoryColors[poll.category] || categoryColors.other;

  return (
    <>
      <MetaTags 
        title={metaTitle}
        description={metaDescription}
        url={metaUrl}
      />
      <Box sx={{ minHeight: '100vh', pt: 4, pb: 8 }}>
        <Container maxWidth="lg">
          <Fade in timeout={600}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Chip
                  icon={<HowToVoteIcon />}
                  label={`${poll.totalVotes} Total Votes`}
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
                  icon={<PeopleIcon />}
                  label={poll.category}
                  sx={{
                    background: 'white',
                    color: categoryColor,
                    fontWeight: 700,
                    fontSize: '1rem',
                    py: 2.5,
                    px: 1,
                    border: `2px solid ${categoryColor}`,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </Box>

              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 3, sm: 5 },
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}dd)`,
                    borderRadius: '16px 16px 0 0',
                  },
                }}
                id="poll-detail"
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      flex: 1,
                      pr: 2,
                      lineHeight: 1.2,
                    }}
                  >
                    {poll.title}
                  </Typography>
                  {isOwner && (
                    <IconButton 
                      onClick={handleDelete}
                      sx={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        '&:hover': {
                          background: '#fecaca',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                {poll.description && (
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    paragraph
                    sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}
                  >
                    {poll.description}
                  </Typography>
                )}

                {/* Creator Info */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48,
                      background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
                      fontWeight: 700,
                      fontSize: '1.2rem',
                    }}
                  >
                    {poll.creator?.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {poll.creator?.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip 
                      icon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                      label={poll.likesCount || 0}
                      onClick={handleLike}
                      sx={{
                        background: isLiked ? '#fce7f3' : '#f1f5f9',
                        color: isLiked ? '#ec4899' : '#64748b',
                        fontWeight: 700,
                        cursor: 'pointer',
                        '&:hover': {
                          background: isLiked ? '#fbcfe8' : '#e2e8f0',
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Voting Section */}
                {!hasVoted && isAuthenticated ? (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      🗳️ Cast Your Vote
                    </Typography>
                    <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(Number(e.target.value))}>
                      {poll.options.map((option, index) => (
                        <Paper
                          key={index}
                          elevation={0}
                          sx={{
                            p: 2,
                            mb: 1.5,
                            border: selectedOption === index ? `2px solid ${categoryColor}` : '2px solid #e2e8f0',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            background: selectedOption === index ? `${categoryColor}10` : 'white',
                            '&:hover': {
                              borderColor: categoryColor,
                              transform: 'translateX(4px)',
                            },
                          }}
                          onClick={() => setSelectedOption(index)}
                        >
                          <FormControlLabel
                            value={index}
                            control={<Radio sx={{ color: categoryColor }} />}
                            label={
                              <Typography variant="body1" fontWeight={600}>
                                {option.text}
                              </Typography>
                            }
                            sx={{ margin: 0, width: '100%' }}
                          />
                        </Paper>
                      ))}
                    </RadioGroup>
                    <Button
                      variant="contained"
                      onClick={handleVote}
                      disabled={selectedOption === null}
                      fullWidth
                      size="large"
                      sx={{
                        mt: 3,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                        '&:hover': {
                          background: `linear-gradient(135deg, ${categoryColor}dd 0%, ${categoryColor}bb 100%)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 10px 30px ${categoryColor}40`,
                        },
                      }}
                    >
                      Submit Vote
                    </Button>
                  </Box>
                ) : !isAuthenticated ? (
                  <Box sx={{ mb: 4, textAlign: 'center', py: 3, background: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      🔒 Login Required
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      Please login to vote on this poll
                    </Typography>
                    <Button 
                      variant="contained" 
                      onClick={() => navigate('/login')}
                      sx={{
                        background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                      }}
                    >
                      Login Now
                    </Button>
                  </Box>
                ) : null}

                <Divider sx={{ my: 4 }} />

                {/* Results Section */}
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  📊 Live Results
                </Typography>

                {poll.totalVotes > 0 ? (
                  <>
                    <Box sx={{ mb: 4 }}>
                      {poll.options.map((option, index) => {
                        const percentage = poll.totalVotes > 0 ? ((option.votes / poll.totalVotes) * 100).toFixed(1) : 0;
                        return (
                          <Box key={index} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography fontWeight={600}>{option.text}</Typography>
                              <Typography fontWeight={700} color={categoryColor}>
                                {option.votes} votes ({percentage}%)
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={Number(percentage)}
                              sx={{
                                height: 12,
                                borderRadius: 2,
                                backgroundColor: '#e5e7eb',
                                '& .MuiLinearProgress-bar': {
                                  background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}dd)`,
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>

                    <Box sx={{ mt: 4 }}>
                      <PollChart poll={poll} type="pie" />
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4, background: '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      No votes yet. Be the first to vote! 🎯
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 4 }} />

                {/* Share & Download Section */}
                <Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Share This Poll
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <ShareButtons poll={poll} />
                  </Box>

                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Download Results
                  </Typography>
                  <Box>
                    <DownloadButton elementId="poll-detail" filename={`poll-${poll._id}`} />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
}

export default PollDetail;
