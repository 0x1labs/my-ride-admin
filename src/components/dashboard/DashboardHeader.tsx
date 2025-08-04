
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Logo from "@/components/Logo";
import ServiceCenterSettings from "@/components/ServiceCenterSettings";
import { supabase } from "@/integrations/supabase/client";

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
  const [serviceCenterName, setServiceCenterName] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const fetchServiceCenterName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('service_center_name')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setServiceCenterName(data.service_center_name);
        }
      }
    };

    fetchServiceCenterName();
  }, []);

  const handleSettingsUpdate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('service_center_name')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setServiceCenterName(data.service_center_name);
      }
    }
    setShowSettings(false);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        {title ? (
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        ) : (
          <Logo />
        )}
        <p className="text-gray-600">
          {subtitle || `Welcome back, ${serviceCenterName || userEmail}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <ServiceCenterSettings 
              currentName={serviceCenterName} 
              onUpdate={handleSettingsUpdate}
            />
          </DialogContent>
        </Dialog>
        <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
