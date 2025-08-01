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
          <h1 className="text-3xl font-bold text-ktm-orange font-roboto-condensed">{title}</h1>
        ) : (
          <Logo />
        )}
        <p className="text-ktm-light-gray font-sora">
          {subtitle || `Welcome back, ${userEmail}`}
        </p>
      </div>
      <Button variant="outline" onClick={onLogout} className="flex items-center gap-2 bg-ktm-dark-gray border-ktm-orange-dim text-white">
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default DashboardHeader;