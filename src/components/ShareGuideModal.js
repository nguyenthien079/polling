import React, { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Stepper, Step, StepLabel,
  Alert, Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

function ShareGuideModal({ open, onClose, poll, shareUrl }) {
  const shareText = `📊 ${poll.title}\n\n${poll.description || 'Cast your vote!'}\n\n🗳️ Vote now: ${shareUrl}\n\n#Polling #Vote #${poll.category}`;
  
  const steps = [
    'Click button "Copy Link"',
    'Paste vào Facebook/Twitter/LinkedIn',
    'Thêm comment của bạn (optional)',
    'Click "Post" để share!'
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    alert('✅ Copied! Giờ paste vào Facebook/Twitter/LinkedIn!');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <InfoIcon color="primary" />
          <Typography variant="h6">Cách Share Poll</Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Lưu ý:</strong> Facebook/Twitter không thể preview link localhost. 
          Hãy copy text và paste để share đầy đủ thông tin!
        </Alert>

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          📝 Text sẽ được copy:
        </Typography>
        
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: '#f5f5f5', 
            borderRadius: 1, 
            mb: 2,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}
        >
          {shareText}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          🎯 Các bước thực hiện:
        </Typography>
        
        <Stepper orientation="vertical" activeStep={-1}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Alert severity="success" sx={{ mt: 2 }}>
          <strong>Tip:</strong> Text đã format sẵn với emoji và hashtags để thu hút attention! 🎉
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button 
          variant="contained" 
          onClick={copyToClipboard}
          color="primary"
        >
          📋 Copy Ngay
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShareGuideModal;
