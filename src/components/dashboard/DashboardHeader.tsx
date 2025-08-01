
import { Button } from "@/components/ui/button";
import { LogOut, Car, Bike } from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "@/contexts/ThemeContext";

interface DashboardHeaderProps {
  userEmail?: string;
  onLogout: () => void;
  title?: string;
  subtitle?: string;
}

const DashboardHeader = ({ 
  userEmail, 
  onLogout, 
  title, 
  subtitle 
}: DashboardHeaderProps) => {
  const { vehicleType, setVehicleType } = useTheme();

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        {title ? (
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        ) : (
          <Logo />
        )}
        <p className="text-gray-600">
          {subtitle || `Welcome back, ${userEmail}`}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={vehicleType === 'bike' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setVehicleType('bike')}
            className="flex items-center gap-1"
          >
            <Bike className="h-4 w-4" />
            Bike
          </Button>
          <Button
            variant={vehicleType === 'car' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setVehicleType('car')}
            className="flex items-center gap-1"
          >
            <Car className="h-4 w-4" />
            Car
          </Button>
        </div>
        <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
