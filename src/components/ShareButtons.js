import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Button } from '@mui/material';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';
import { toast } from 'react-toastify';
import ShareGuideModal from './ShareGuideModal';

function ShareButtons({ poll }) {
  const [showGuide, setShowGuide] = useState(false);
  const shareUrl = window.location.href;
  const title = `📊 ${poll.title}`;
  
  // Tạo description với thông tin poll
  const description = poll.description 
    ? `${poll.description.substring(0, 100)}... | Vote now on Real-Time Polling App!` 
    : `Cast your vote on this poll! ${poll.totalVotes} people have already voted. | Real-Time Polling App`;
  
  // Tạo hashtags
  const hashtags = ['polling', 'vote', poll.category];

  const copyToClipboard = () => {
    const shareText = `📊 ${poll.title}\n\n${poll.description || 'Cast your vote!'}\n\n�️ Vote tại: ${shareUrl}\n\n#Polling #Vote #${poll.category}`;
    navigator.clipboard.writeText(shareText);
    toast.success('✅ Copied! Giờ paste vào mạng xã hội để share!', {
      autoClose: 5000,
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Tooltip title="Share on Facebook">
        <div>
          <FacebookShareButton 
            url={shareUrl} 
            quote={`${title}\n\n${description}`}
            hashtag={`#${poll.category}`}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>
      </Tooltip>

      <Tooltip title="Share on Twitter">
        <div>
          <TwitterShareButton 
            url={shareUrl} 
            title={`${title}\n\n${poll.description || 'Cast your vote!'}`}
            hashtags={hashtags}
            related={['polling', 'vote']}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      </Tooltip>

      <Tooltip title="Share on LinkedIn">
        <div>
          <LinkedinShareButton 
            url={shareUrl} 
            title={title}
            summary={description}
            source="Real-Time Polling App"
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </Tooltip>

      <Tooltip title="📋 Copy text để paste lên mạng xã hội">
        <IconButton onClick={copyToClipboard} size="small" color="primary">
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="❓ Hướng dẫn share">
        <IconButton onClick={() => setShowGuide(true)} size="small" color="info">
          <InfoIcon />
        </IconButton>
      </Tooltip>

      <ShareGuideModal 
        open={showGuide}
        onClose={() => setShowGuide(false)}
        poll={poll}
        shareUrl={shareUrl}
      />
    </Box>
  );
}

export default ShareButtons;
