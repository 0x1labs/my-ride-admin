import React, { useEffect } from 'react';
import { config, getDistributorName, getDistributorFullName } from '@/config';

const EnhancedBranding: React.FC = () => {
  useEffect(() => {
    // Update page title
    document.title = `${getDistributorFullName()} | Vehicle Service Management`;
    
    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', `${getDistributorFullName()} Vehicle Service Management System - Manage your vehicles, service history, and customer communications efficiently.`);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${getDistributorFullName()} | Vehicle Service Management`);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', `${getDistributorFullName()} Vehicle Service Management System - Manage your vehicles, service history, and customer communications efficiently.`);
    }
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', `${getDistributorFullName()} | Vehicle Service Management`);
    }
    
    // Handle favicon
    updateFavicon();
  }, []);
  
  const updateFavicon = () => {
    // Remove existing favicon if any
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }
    
    // Create new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    
    if (config.distributor.logo_url) {
      // Use distributor logo as favicon if available
      link.href = config.distributor.logo_url;
    } else {
      // Generate favicon with distributor initials
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw background
        ctx.fillStyle = config.color_theme.primary;
        ctx.fillRect(0, 0, 32, 32);
        
        // Draw initials
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          getDistributorName().substring(0, 2).toUpperCase(),
          16,
          16
        );
        
        link.href = canvas.toDataURL('image/png');
      } else {
        // Fallback to default
        link.href = '/favicon.ico';
      }
    }
    
    document.head.appendChild(link);
  };
  
  return null; // This component doesn't render anything visible
};

export default EnhancedBranding;