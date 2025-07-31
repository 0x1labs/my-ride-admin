
import { Bike } from 'lucide-react';
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Bike className="h-8 w-8 text-primary" />
      <span className="text-2xl font-display font-bold tracking-tight text-primary">KTM Admin</span>
    </div>
  );
};

export default Logo;
