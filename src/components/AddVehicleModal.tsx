import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddVehicle } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";
import VehicleForm from "./forms/VehicleForm";

const AddVehicleModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    type: "bike" as const,
    bikeModel: "",
    year: new Date().getFullYear(),
    engineCapacity: 0,
    owner: "",
    phone: "",
    lastService: "",
    nextService: "",
    status: "active",
    lastServiceKilometers: 0,
    currentKilometers: 0,
  });

  const addVehicleMutation = useAddVehicle();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addVehicleMutation.mutateAsync(formData);
      
      toast({
        title: "Success",
        description: "Bike added successfully!",
      });

      setFormData({
        id: "",
        type: "bike",
        bikeModel: "",
        year: new Date().getFullYear(),
        engineCapacity: 0,
        owner: "",
        phone: "",
        lastService: "",
        nextService: "",
        status: "active",
        lastServiceKilometers: 0,
        currentKilometers: 0,
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error adding bike:', error);
      toast({
        title: "Error",
        description: "Failed to add bike. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFormChange = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Bike
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Bike</DialogTitle>
          <DialogDescription>
            Enter the bike details below to add it to your fleet.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <VehicleForm formData={formData} onChange={handleFormChange} />
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addVehicleMutation.isPending}>
              {addVehicleMutation.isPending ? "Adding..." : "Add Bike"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;