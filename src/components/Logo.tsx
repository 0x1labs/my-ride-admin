import { Bike } from 'lucide-react';
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Bike className="h-8 w-8 text-ktm-orange" />
      <span className="text-2xl font-bold tracking-tight text-ktm-orange font-roboto-condensed">MyKTM</span>
    </div>
  );
};

export default Logo;