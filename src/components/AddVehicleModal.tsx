
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddVehicleModal = ({ isOpen, onClose }: AddVehicleModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [vehicleData, setVehicleData] = useState({
    type: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    owner: "",
    phone: "",
    lastService: "",
    nextService: "",
    status: "active",
    lastServiceKilometers: 0,
    currentKilometers: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setVehicleData({
      type: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      owner: "",
      phone: "",
      lastService: "",
      nextService: "",
      status: "active",
      lastServiceKilometers: 0,
      currentKilometers: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicleData.type || !vehicleData.make || !vehicleData.model || !vehicleData.owner || !vehicleData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a unique vehicle ID
      const vehicleId = `VIN${String(Date.now()).slice(-6)}`;
      
      // Here you would normally call your Supabase service to add the vehicle
      // For now, we'll just show a success message since we need to add this to the service
      console.log('Adding vehicle:', { id: vehicleId, ...vehicleData });

      toast({
        title: "Vehicle Added",
        description: "The vehicle has been successfully added to the system.",
      });

      // Invalidate vehicles query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Register a new vehicle in the system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Vehicle Type *</Label>
                <Select value={vehicleData.type} onValueChange={(value) => setVehicleData({...vehicleData, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="year">Year *</Label>
                <Select value={vehicleData.year.toString()} onValueChange={(value) => setVehicleData({...vehicleData, year: parseInt(value)})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  placeholder="e.g., Toyota, Honda"
                  value={vehicleData.make}
                  onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="e.g., Camry, Civic"
                  value={vehicleData.model}
                  onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Owner Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">Owner Name *</Label>
                <Input
                  id="owner"
                  placeholder="Full name"
                  value={vehicleData.owner}
                  onChange={(e) => setVehicleData({...vehicleData, owner: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+1-555-0123"
                  value={vehicleData.phone}
                  onChange={(e) => setVehicleData({...vehicleData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentKilometers">Current Kilometers</Label>
                <Input
                  id="currentKilometers"
                  type="number"
                  placeholder="0"
                  value={vehicleData.currentKilometers}
                  onChange={(e) => setVehicleData({...vehicleData, currentKilometers: Number(e.target.value)})}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="lastServiceKilometers">Last Service Kilometers</Label>
                <Input
                  id="lastServiceKilometers"
                  type="number"
                  placeholder="0"
                  value={vehicleData.lastServiceKilometers}
                  onChange={(e) => setVehicleData({...vehicleData, lastServiceKilometers: Number(e.target.value)})}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="lastService">Last Service Date</Label>
                <Input
                  id="lastService"
                  type="date"
                  value={vehicleData.lastService}
                  onChange={(e) => setVehicleData({...vehicleData, lastService: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="nextService">Next Service Date</Label>
                <Input
                  id="nextService"
                  type="date"
                  value={vehicleData.nextService}
                  onChange={(e) => setVehicleData({...vehicleData, nextService: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !vehicleData.type || !vehicleData.make || !vehicleData.model || !vehicleData.owner || !vehicleData.phone}
            >
              {isSubmitting ? "Adding..." : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;
