import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

function DownloadButton({ elementId, filename = 'poll-results' }) {
  const handleDownloadPNG = async () => {
    try {
      const element = document.getElementById(elementId);
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Downloaded as PNG!');
    } catch (error) {
      toast.error('Failed to download');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById(elementId);
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
      toast.success('Downloaded as PDF!');
    } catch (error) {
      toast.error('Failed to download');
    }
  };

  return (
    <>
      <Button 
        startIcon={<DownloadIcon />} 
        onClick={handleDownloadPNG}
        sx={{ mr: 1 }}
      >
        PNG
      </Button>
      <Button 
        startIcon={<DownloadIcon />} 
        onClick={handleDownloadPDF}
      >
        PDF
      </Button>
    </>
  );
}

export default DownloadButton;
