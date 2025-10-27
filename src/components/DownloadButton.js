import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

function DownloadButton({ elementId, filename = 'poll-results' }) {
  // common html2canvas base options
  const baseCanvasOptions = (element) => ({
    // use a higher scale for crisper captures
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: '#ffffff',
    // width/height will be set dynamically based on the cloned node
  });

  // Inline computed styles for clone descendants to ensure the capture doesn't rely on external CSS
  const inlineComputedStyles = (root) => {
    try {
      const props = ['background', 'background-color', 'background-image', 'color', 'font-family', 'font-size', 'font-weight', 'line-height', 'padding', 'margin', 'border', 'box-sizing', 'width', 'height', 'display', 'position', 'top', 'left', 'right', 'bottom', 'box-shadow', 'filter', 'mix-blend-mode', 'opacity', 'transform', 'text-align', 'vertical-align'];
      const nodes = root.querySelectorAll('*');
      nodes.forEach((node) => {
        const cs = window.getComputedStyle(node);
        props.forEach((p) => {
          try {
            const v = cs.getPropertyValue(p);
            if (v) node.style.setProperty(p, v, 'important');
          } catch (e) {
            // ignore property set failures
          }
        });
        // remove blend/filter effects that can darken
        node.style.filter = 'none';
        node.style.mixBlendMode = 'normal';
        node.style.boxShadow = 'none';
      });
      // also apply important styles to the root itself
      const csRoot = window.getComputedStyle(root);
      props.forEach((p) => {
        try {
          const v = csRoot.getPropertyValue(p);
          if (v) root.style.setProperty(p, v, 'important');
        } catch (e) {}
      });
      root.style.background = root.style.background || '#ffffff';
    } catch (e) {
      // ignore
    }
  };

  // Prepare a cloned, isolated node for capture to avoid overlays/backdrops affecting the result
  const createOffscreenClone = (element) => {
    const rect = element.getBoundingClientRect();
    const clone = element.cloneNode(true);

    // Create wrapper that goes offscreen so CSS still applies but no overlays cover it
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-10000px';
    wrapper.style.top = '0px';
    wrapper.style.width = `${Math.ceil(rect.width)}px`;
    wrapper.style.background = '#ffffff';
    wrapper.style.padding = '0';
    wrapper.style.margin = '0';
    wrapper.style.zIndex = '9999';
    wrapper.id = 'html2canvas-offscreen-wrapper';

    // Optionally remove interactive overlay elements inside the clone
    // (Many overlays/backdrops are outside the target element, but this is defensive)
    const unwantedSelectors = ['.MuiBackdrop-root', '.modal-backdrop', '.overlay', '.react-modal-overlay', '.popover', '.tooltip', '.MuiPopover-root'];
    unwantedSelectors.forEach((sel) => {
      const found = clone.querySelectorAll(sel);
      found.forEach((n) => n.remove());
    });

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    
    // Copy canvas contents (Chart.js etc.) from original to clone as images so the drawing is preserved
    try {
      const originalCanvases = Array.from(element.querySelectorAll('canvas'));
      const cloneCanvases = Array.from(clone.querySelectorAll('canvas'));
      originalCanvases.forEach((origCanvas, idx) => {
        try {
          const dataUrl = origCanvas.toDataURL('image/png');
          const target = cloneCanvases[idx];
          if (target && target.parentNode) {
            const img = document.createElement('img');
            img.src = dataUrl;
            // preserve sizing
            img.width = target.width || target.offsetWidth || origCanvas.width;
            img.height = target.height || target.offsetHeight || origCanvas.height;
            img.style.width = (target.style.width || img.width + 'px');
            img.style.height = (target.style.height || img.height + 'px');
            target.parentNode.replaceChild(img, target);
          }
        } catch (e) {
          // if toDataURL is blocked (CORS) fall back silently
          console.warn('Failed to copy canvas for export', e);
        }
      });

      // Convert inline SVGs to images so their rendered appearance is preserved
      const originalSVGs = Array.from(element.querySelectorAll('svg'));
      const cloneSVGs = Array.from(clone.querySelectorAll('svg'));
      originalSVGs.forEach((origSvg, idx) => {
        try {
          const xml = new XMLSerializer().serializeToString(origSvg);
          const svg64 = btoa(unescape(encodeURIComponent(xml)));
          const imgSrc = 'data:image/svg+xml;base64,' + svg64;
          const targetSvg = cloneSVGs[idx];
          if (targetSvg && targetSvg.parentNode) {
            const img = document.createElement('img');
            img.src = imgSrc;
            const rectSvg = targetSvg.getBoundingClientRect();
            img.style.width = rectSvg.width + 'px';
            img.style.height = rectSvg.height + 'px';
            targetSvg.parentNode.replaceChild(img, targetSvg);
          }
        } catch (e) {
          console.warn('Failed to copy svg for export', e);
        }
      });
    } catch (e) {
      // ignore copy failures
    }

    return { wrapper, clone };
  };

  const removeOffscreenClone = (wrapper) => {
    if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
  };

  // Temporarily hide overlays/fixed elements on the page that may bleed into captures
  const hidePageOverlays = () => {
    const selectors = ['.MuiBackdrop-root', '.modal-backdrop', '.overlay', '.react-modal-overlay', '.popover', '.tooltip', '.MuiPopover-root', 'header', 'footer', '.app-header', '.app-footer', '.MuiDrawer-root', '.MuiDialog-root'];
    const saved = [];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        saved.push({ el, style: { display: el.style.display, visibility: el.style.visibility, pointerEvents: el.style.pointerEvents } });
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
      });
    });
    // also set body/background to white to avoid transparent regions
    const body = document.body;
    saved.push({ el: body, style: { background: body.style.background } });
    body.style.background = '#ffffff';
    
    // Additionally detect and hide semi-transparent/backdrop-like elements that may not have predictable classes
    try {
      const all = Array.from(document.body.querySelectorAll('*'));
      all.forEach((el) => {
        try {
          const cs = window.getComputedStyle(el);
          // candidate if fixed/absolute or has zIndex and covers the page or has translucent background
          const pos = cs.position;
          const z = cs.zIndex;
          const opacity = parseFloat(cs.opacity || '1');
          const bg = cs.backgroundColor || '';
          let hide = false;
          if ((pos === 'fixed' || pos === 'absolute') && (z !== 'auto' && parseInt(z || '0') > 0)) hide = true;
          if (opacity < 1) hide = true;
          // parse rgba to find alpha
          if (bg && bg.startsWith('rgba')) {
            const m = bg.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([0-9.]+)\)/);
            if (m) {
              const alpha = parseFloat(m[4]);
              if (alpha > 0.05) hide = true;
            }
          }
          if (hide) {
            saved.push({ el, style: { display: el.style.display, visibility: el.style.visibility, pointerEvents: el.style.pointerEvents } });
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
          }
        } catch (e) {
          // ignore per-element errors
        }
      });
    } catch (e) {
      // ignore
    }
    return saved;
  };

  const restorePageOverlays = (saved) => {
    if (!saved) return;
    saved.forEach(({ el, style }) => {
      try {
        if (style.display !== undefined) el.style.display = style.display;
        if (style.visibility !== undefined) el.style.visibility = style.visibility;
        if (style.pointerEvents !== undefined) el.style.pointerEvents = style.pointerEvents;
        if (style.background !== undefined) el.style.background = style.background;
      } catch (e) {
        // ignore
      }
    });
  };

  const handleDownloadPNG = async () => {
    let wrapper;
    let savedOverlays;
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');
      // hide overlays/fixed elements first (so computed backgrounds and overlays don't interfere)
      savedOverlays = hidePageOverlays();

      const { wrapper: w, clone } = createOffscreenClone(element);
      wrapper = w;

      // inline computed styles to make the clone self-contained
      inlineComputedStyles(clone);

      // use cloned node dimensions
      const opts = baseCanvasOptions(clone);
      opts.width = clone.scrollWidth || clone.offsetWidth || clone.getBoundingClientRect().width;
      opts.height = clone.scrollHeight || clone.offsetHeight || clone.getBoundingClientRect().height;
      opts.scrollY = 0; // capture from top of the cloned node

      const canvas = await html2canvas(clone, opts);
      // restore page overlays right after canvas created
      restorePageOverlays(savedOverlays);
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Downloaded as PNG!');
    } catch (error) {
      console.error('Download PNG error:', error);
      toast.error('Failed to download PNG');
    } finally {
      // ensure overlays are restored even if capture failed
      restorePageOverlays(savedOverlays);
      removeOffscreenClone(wrapper);
    }
  };

  const handleDownloadPDF = async () => {
    let wrapper;
    let savedOverlays;
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      savedOverlays = hidePageOverlays();

      const { wrapper: w, clone } = createOffscreenClone(element);
      wrapper = w;

      // inline computed styles to make the clone self-contained
      inlineComputedStyles(clone);

      const opts = baseCanvasOptions(clone);
      opts.width = clone.scrollWidth || clone.offsetWidth || clone.getBoundingClientRect().width;
      opts.height = clone.scrollHeight || clone.offsetHeight || clone.getBoundingClientRect().height;
      opts.scrollY = 0;

      const canvas = await html2canvas(clone, opts);
      const imgData = canvas.toDataURL('image/png', 1.0);
      restorePageOverlays(savedOverlays);

      // Create PDF in mm (A4)
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // convert canvas px to mm at 96dpi: 1px = 0.264583 mm (approx)
      const pxToMm = (px) => px * 0.264583;

      let imgWidthMm = pxToMm(canvas.width);
      let imgHeightMm = pxToMm(canvas.height);

      // Fit width to PDF width minus small margin
      const margin = 10; // mm
      const availableWidth = pdfWidth - margin * 2;
      if (imgWidthMm > availableWidth) {
        const ratio = availableWidth / imgWidthMm;
        imgWidthMm = imgWidthMm * ratio;
        imgHeightMm = imgHeightMm * ratio;
      }

      // If content longer than one page, scale to fit one page as a fallback
      if (imgHeightMm + margin * 2 > pdfHeight) {
        const scaleRatio = (pdfHeight - margin * 2) / imgHeightMm;
        const scaledWidth = imgWidthMm * scaleRatio;
        const scaledHeight = imgHeightMm * scaleRatio;
        const pdf2 = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        pdf2.addImage(imgData, 'PNG', margin, margin, scaledWidth, scaledHeight);
        pdf2.save(`${filename}.pdf`);
      } else {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidthMm, imgHeightMm);
        pdf.save(`${filename}.pdf`);
      }

      toast.success('Downloaded as PDF!');
    } catch (error) {
      console.error('Download PDF error:', error);
      toast.error('Failed to download PDF');
    } finally {
      removeOffscreenClone(wrapper);
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
