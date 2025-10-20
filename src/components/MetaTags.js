import { useEffect } from 'react';

function MetaTags({ title, description, url, image }) {
  useEffect(() => {
    // Update document title
    document.title = title || 'Real-Time Polling App';
    
    // Update or create meta tags
    const updateMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                    document.querySelector(`meta[name="${property}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(property.includes('og:') || property.includes('twitter:') ? 'property' : 'name', property);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update all meta tags
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    if (title) {
      updateMetaTag('og:title', title);
      updateMetaTag('twitter:title', title);
    }

    if (url) {
      updateMetaTag('og:url', url);
      updateMetaTag('twitter:url', url);
    }

    if (image) {
      updateMetaTag('og:image', image);
      updateMetaTag('twitter:image', image);
    }

    // Cleanup: reset to default on unmount
    return () => {
      document.title = 'Real-Time Polling App';
    };
  }, [title, description, url, image]);

  return null; // This component doesn't render anything
}

export default MetaTags;
