import React from 'react';
import { config, getDistributorName, getDistributorFullName } from '@/config';

interface ConfigurableLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ConfigurableLogo: React.FC<ConfigurableLogoProps> = ({ 
  className = "", 
  showText = true, 
  size = 'md' 
}) => {
  const distributorName = getDistributorName();
  const distributorFullName = getDistributorFullName();
  
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

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {config.distributor.logo_url ? (
        <img 
          src={config.distributor.logo_url} 
          alt={`${distributorName} Logo`}
          className={`${sizeClasses[size]} object-contain`}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-sm`}>
          {distributorName.substring(0, 2).toUpperCase()}
        </div>
      )}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-foreground ${textSizeClasses[size]}`}>
            {distributorName}
          </span>
          <span className="text-xs text-muted-foreground">
            Service Center
          </span>
        </div>
      )}
    </div>
  );
};

export default ConfigurableLogo;