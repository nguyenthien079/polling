import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { formatDistanceToNow } from 'date-fns';

function PollCard({ poll }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {poll.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {poll.description}
        </Typography>

        <Box sx={{ mt: 2, mb: 1 }}>
          <Chip 
            label={poll.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ mr: 1 }}
          />
          <Chip 
            icon={<HowToVoteIcon />}
            label={`${poll.totalVotes} votes`} 
            size="small" 
            sx={{ mr: 1 }}
          />
          <Chip 
            icon={<ThumbUpIcon />}
            label={poll.likesCount} 
            size="small" 
          />
        </Box>

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          By {poll.creator?.username} • {formatDistanceToNow(new Date(poll.createdAt), { addSuffix: true })}
        </Typography>
      </CardContent>

      <CardActions>
        <Button 
          size="small" 
          variant="contained"
          onClick={() => navigate(`/poll/${poll._id}`)}
          fullWidth
        >
          View & Vote
        </Button>
      </CardActions>
    </Card>
  );
}

export default PollCard;
