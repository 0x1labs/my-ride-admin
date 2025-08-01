import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  vehicleType: 'bike' | 'car';
  setVehicleType: (type: 'bike' | 'car') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [vehicleType, setVehicleType] = useState<'bike' | 'car'>('bike');

  useEffect(() => {
    // Apply KTM Orange theme when bike is selected
    const root = document.documentElement;
    if (vehicleType === 'bike') {
      root.style.setProperty('--primary', '22 100% 54%'); // KTM Orange
      root.style.setProperty('--primary-foreground', '0 0% 100%');
    } else {
      root.style.setProperty('--primary', '222.2 47.4% 11.2%'); // Default dark
      root.style.setProperty('--primary-foreground', '210 40% 98%');
    }
  }, [vehicleType]);

  return (
    <ThemeContext.Provider value={{ vehicleType, setVehicleType }}>
      {children}
    </ThemeContext.Provider>
  );
};