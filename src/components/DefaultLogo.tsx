import React from 'react';

const DefaultLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="20" className="fill-primary" />
      <path 
        d="M30 35L45 25L60 35L70 30L55 20L45 25L35 20L20 30L30 35Z" 
        className="fill-primary-foreground"
      />
      <path 
        d="M25 40L40 30L55 40L65 35L50 25L40 30L30 25L15 35L25 40Z" 
        className="fill-primary-foreground opacity-80"
      />
      <path 
        d="M35 50L50 40L65 50L75 45L60 35L50 40L40 35L25 45L35 50Z" 
        className="fill-primary-foreground"
      />
      <circle cx="70" cy="65" r="5" className="fill-primary-foreground" />
      <circle cx="30" cy="65" r="5" className="fill-primary-foreground" />
    </svg>
  );
};

export default DefaultLogo;