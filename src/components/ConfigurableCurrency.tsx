import React from 'react';
import { getCurrencySymbol } from '@/config';

interface ConfigurableCurrencyProps {
  amount: number;
  className?: string;
}

const ConfigurableCurrency: React.FC<ConfigurableCurrencyProps> = ({ 
  amount, 
  className = '' 
}) => {
  const currencySymbol = getCurrencySymbol();
  
  // Format the amount with commas and two decimal places
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);

  return (
    <span className={className}>
      {currencySymbol} {formattedAmount}
    </span>
  );
};

export default ConfigurableCurrency;