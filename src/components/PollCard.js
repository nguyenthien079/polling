import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { formatDistanceToNow } from 'date-fns';

function PollCard({ poll }) {
  const navigate = useNavigate();

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
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}dd)`,
          borderRadius: '16px 16px 0 0',
        },
      }}
      className="fade-in"
    >
      <CardContent sx={{ flexGrow: 1, pt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: '1.1rem',
              lineHeight: 1.3,
              flex: 1,
              pr: 1,
            }}
          >
            {poll.title}
          </Typography>
          
          {poll.totalVotes > 50 && (
            <Box
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '8px',
                p: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUpIcon sx={{ fontSize: '1rem', color: 'white' }} />
            </Box>
          )}
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          paragraph
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {poll.description || 'No description provided'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={poll.category} 
            size="small" 
            sx={{
              background: `${categoryColor}15`,
              color: categoryColor,
              fontWeight: 600,
              border: `1px solid ${categoryColor}30`,
            }}
          />
          <Chip 
            icon={<HowToVoteIcon sx={{ fontSize: '1rem' }} />}
            label={`${poll.totalVotes} votes`} 
            size="small" 
            sx={{
              background: '#f1f5f9',
              fontWeight: 600,
            }}
          />
          <Chip 
            icon={<ThumbUpIcon sx={{ fontSize: '0.9rem' }} />}
            label={poll.likesCount || 0} 
            size="small" 
            sx={{
              background: '#fce7f3',
              color: '#ec4899',
              fontWeight: 600,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              fontSize: '0.75rem',
              background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
            }}
          >
            {poll.creator?.username?.[0]?.toUpperCase()}
          </Avatar>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {poll.creator?.username} • {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="medium"
          variant="contained"
          onClick={() => navigate(`/poll/${poll._id}`)}
          fullWidth
          sx={{
            background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
            py: 1.2,
            fontWeight: 700,
            fontSize: '0.9rem',
            '&:hover': {
              background: `linear-gradient(135deg, ${categoryColor}dd 0%, ${categoryColor}bb 100%)`,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 16px ${categoryColor}40`,
            },
          }}
        >
          View & Vote
        </Button>
      </CardActions>
    </Card>
  );
}

export default PollCard;
