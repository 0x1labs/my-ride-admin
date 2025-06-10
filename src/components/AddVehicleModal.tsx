
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useAddVehicle } from "@/hooks/useVehicles";
import { useToast } from "@/hooks/use-toast";

const AddVehicleModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "car" as "car" | "bike",
    make: "",
    model: "",
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
      // Calculate status based on next service date
      const nextServiceDate = new Date(formData.nextService);
      const today = new Date();
      const status = nextServiceDate < today ? "overdue" : nextServiceDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? "upcoming" : "active";

      await addVehicle.mutateAsync({
        ...formData,
        status,
      });

      toast({
        title: "Vehicle Added",
        description: `${formData.make} ${formData.model} has been added successfully.`,
      });

      // Reset form and close modal
      setFormData({
        type: "car",
        make: "",
        model: "",
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
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Register a new vehicle when it's first bought.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Vehicle Type</Label>
            <Select value={formData.type} onValueChange={(value: "car" | "bike") => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="lastService">Last Service Date</Label>
            <Input
              id="lastService"
              type="date"
              value={formData.lastService}
              onChange={(e) => setFormData({ ...formData, lastService: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="nextService">Next Service Date</Label>
            <Input
              id="nextService"
              type="date"
              value={formData.nextService}
              onChange={(e) => setFormData({ ...formData, nextService: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="lastServiceKilometers">Last Service Kilometers</Label>
            <Input
              id="lastServiceKilometers"
              type="number"
              value={formData.lastServiceKilometers}
              onChange={(e) => setFormData({ ...formData, lastServiceKilometers: parseInt(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="currentKilometers">Current Kilometers</Label>
            <Input
              id="currentKilometers"
              type="number"
              value={formData.currentKilometers}
              onChange={(e) => setFormData({ ...formData, currentKilometers: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addVehicle.isPending}>
              {addVehicle.isPending ? "Adding..." : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;
