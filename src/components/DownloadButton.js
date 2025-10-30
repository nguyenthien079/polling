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
      if (!element) {
        toast.error('Element not found!');
        return;
      }

      toast.info('Đang tạo ảnh...');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('✅ Tải PNG thành công!');
    } catch (error) {
      console.error('Download PNG error:', error);
      toast.error('❌ Lỗi khi tải PNG: ' + error.message);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        toast.error('Element not found!');
        return;
      }

      toast.info('Đang tạo PDF...');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Tạo PDF với kích thước A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Tính toán kích thước ảnh để fit PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${filename}.pdf`);
      
      toast.success('✅ Tải PDF thành công!');
    } catch (error) {
      console.error('Download PDF error:', error);
      toast.error('❌ Lỗi khi tải PDF: ' + error.message);
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
