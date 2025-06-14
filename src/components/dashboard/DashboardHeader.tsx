
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  userEmail?: string;
  onLogout: () => void;
  title?: string;
  subtitle?: string;
}

const DashboardHeader = ({ 
  userEmail, 
  onLogout, 
  title = "ServiceTracker Pro", 
  subtitle 
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">
          {subtitle || `Welcome back, ${userEmail}`}
        </p>
      </div>
      <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default DashboardHeader;
