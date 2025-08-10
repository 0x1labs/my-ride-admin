import React from 'react';
import { config, getDistributorName, getDistributorFullName } from '@/config';
import DefaultLogo from './DefaultLogo';

interface ConfigurableLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'full';
  linkToWebsite?: boolean;
}

const ConfigurableLogo: React.FC<ConfigurableLogoProps> = ({ 
  className = "", 
  showText = true, 
  size = 'md',
  variant = 'default',
  linkToWebsite = false
}) => {
  const distributorName = getDistributorName();
  const distributorFullName = getDistributorFullName();
  const websiteUrl = config.distributor.website;
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  const renderLogoContent = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      {config.distributor.logo_url ? (
        <img 
          src={config.distributor.logo_url} 
          alt={`${distributorName} Logo`}
          className={`${sizeClasses[size]} object-contain rounded-sm`}
        />
      ) : (
        <DefaultLogo className={sizeClasses[size].replace('h-', '').replace('w-', '')} />
      )}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-foreground ${textSizeClasses[size]}`}>
            {variant === 'full' ? distributorFullName : distributorName}
          </span>
          {variant !== 'compact' && (
            <span className="text-xs text-muted-foreground">
              {variant === 'full' ? 'Authorized Dealer' : 'Service Center'}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkToWebsite && websiteUrl) {
    return (
      <a 
        href={websiteUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
      >
        {renderLogoContent()}
      </a>
    );
  }

  return renderLogoContent();
};

export default ConfigurableLogo;