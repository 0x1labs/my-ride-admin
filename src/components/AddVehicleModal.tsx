import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddVehicle } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";
import VehicleForm from "@/components/forms/VehicleForm";

const AddVehicleModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    type: "car" as "car" | "bike",
    make: "",
    model: "",
    variant: "",
    year: new Date().getFullYear(),
    owner: "",
    phone: "",
    lastService: "",
    nextService: "",
    lastServiceKilometers: 0,
    currentKilometers: 0,
  });

  const addVehicle = useAddVehicle();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const nextServiceDate = new Date(formData.nextService);
      const today = new Date();
      const status = nextServiceDate < today ? "overdue" : nextServiceDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? "upcoming" : "active";

      await addVehicle.mutateAsync({
        ...formData,
        status,
      });

      toast({
        title: "Motorbike Added",
        description: `${formData.make} ${formData.model} ${formData.variant ? `(${formData.variant})` : ''} has been added successfully.`,
      });

      setFormData({
        id: "",
        type: "bike",
        make: "",
        model: "",
        variant: "",
        year: new Date().getFullYear(),
        owner: "",
        phone: "",
        lastService: "",
        nextService: "",
        lastServiceKilometers: 0,
        currentKilometers: 0,
      });
      setOpen(false);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to add motorbike. Please try again.",
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
        <Button className="bg-ktm-orange text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Motorbike
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-ktm-dark-gray">
        <DialogHeader>
          <DialogTitle className="text-ktm-orange">Add New Motorbike</DialogTitle>
          <DialogDescription className="text-ktm-light-gray">
            Register a new motorbike when it's first bought.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <VehicleForm formData={formData} onChange={handleFormChange} />
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-ktm-black text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={addVehicle.isPending} className="bg-ktm-orange text-white">
              {addVehicle.isPending ? "Adding..." : "Add Motorbike"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;