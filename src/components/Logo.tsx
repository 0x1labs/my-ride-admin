
import React from 'react';
import ConfigurableLogo from './ConfigurableLogo';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return <ConfigurableLogo className={className} />;
};

export default Logo;
