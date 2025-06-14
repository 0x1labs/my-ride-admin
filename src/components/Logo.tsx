
import { Car } from 'lucide-react';
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Car className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold tracking-tight text-primary">MyRide</span>
    </div>
  );
};

export default Logo;
