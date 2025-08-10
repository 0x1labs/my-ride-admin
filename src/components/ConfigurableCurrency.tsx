import React from 'react';
import { getCurrencySymbol } from '@/config';

interface ConfigurableCurrencyProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
}

const ConfigurableCurrency: React.FC<ConfigurableCurrencyProps> = ({ 
  amount, 
  className = "", 
  showSymbol = true 
}) => {
  const currencySymbol = getCurrencySymbol();
  
  const formatAmount = (value: number): string => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <span className={className}>
      {showSymbol && `${currencySymbol} `}{formatAmount(amount)}
    </span>
  );
};

export default ConfigurableCurrency;