import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { updateServiceCenterName } from "@/services/profileService";
import { Settings } from "lucide-react";

interface ServiceCenterSettingsProps {
  currentName: string;
  onUpdate: () => void;
}

const ServiceCenterSettings = ({ currentName, onUpdate }: ServiceCenterSettingsProps) => {
  const [serviceCenterName, setServiceCenterName] = useState(currentName);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateName = async () => {
    if (!serviceCenterName.trim()) {
      toast({
        title: "Error",
        description: "Service center name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateServiceCenterName(serviceCenterName.trim());
      toast({
        title: "Success",
        description: "Service center name updated successfully",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating service center name:", error);
      toast({
        title: "Error",
        description: "Failed to update service center name",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Service Center Settings
        </CardTitle>
        <CardDescription>
          Update your service center name and other settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="serviceCenterName">Service Center Name</Label>
          <Input
            id="serviceCenterName"
            value={serviceCenterName}
            onChange={(e) => setServiceCenterName(e.target.value)}
            placeholder="Enter service center name"
          />
        </div>
        <Button 
          onClick={handleUpdateName} 
          disabled={isUpdating || serviceCenterName === currentName}
        >
          {isUpdating ? "Updating..." : "Update Name"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCenterSettings;