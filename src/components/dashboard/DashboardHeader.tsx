
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Logo from "@/components/Logo";

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
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        {title ? (
          <h1 className="text-3xl font-display font-bold text-gray-900">{title}</h1>
        ) : (
          <Logo />
        )}
        <p className="text-gray-600">
          {subtitle || `Ready to race, ${userEmail?.split('@')[0]}!`}
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
