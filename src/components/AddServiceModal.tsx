
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Car, Bike, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vehicle {
  id: string;
  type: "car" | "bike";
  make: string;
  model: string;
  owner: string;
}

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
}

const AddServiceModal = ({ isOpen, onClose, vehicles }: AddServiceModalProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [parts, setParts] = useState<string[]>([]);
  const [newPart, setNewPart] = useState("");
  const [cost, setCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [technician, setTechnician] = useState("");
  const [notes, setNotes] = useState("");
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponType, setCouponType] = useState("");
  const { toast } = useToast();

  const addPart = () => {
    if (newPart.trim() && !parts.includes(newPart.trim())) {
      setParts([...parts, newPart.trim()]);
      setNewPart("");
    }
  };

  const removePart = (partToRemove: string) => {
    setParts(parts.filter(part => part !== partToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!selectedVehicle || !serviceType || !technician || !cost) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your API
    console.log("Service record data:", {
      vehicleId: selectedVehicle,
      serviceType,
      parts,
      cost: parseFloat(cost),
      discount: discount ? parseFloat(discount) : 0,
      technician,
      notes,
      hasCoupon,
      couponType,
      date: new Date().toISOString()
    });

    toast({
      title: "Service Record Added",
      description: "The service record has been successfully created.",
    });

    // Reset form
    setSelectedVehicle("");
    setServiceType("");
    setParts([]);
    setCost("");
    setDiscount("");
    setTechnician("");
    setNotes("");
    setHasCoupon(false);
    setCouponType("");
    
    onClose();
  };

  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service Record</DialogTitle>
          <DialogDescription>
            Create a new service record for a vehicle in the system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Selection */}
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle *</Label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    <div className="flex items-center gap-2">
                      {vehicle.type === "car" ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                      {vehicle.make} {vehicle.model} - {vehicle.owner}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVehicleData && (
              <div className="text-sm text-gray-600">
                VIN: {selectedVehicleData.id}
              </div>
            )}
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type *</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular Maintenance">Regular Maintenance</SelectItem>
                <SelectItem value="Oil Change">Oil Change</SelectItem>
                <SelectItem value="Brake Service">Brake Service</SelectItem>
                <SelectItem value="Tire Service">Tire Service</SelectItem>
                <SelectItem value="Engine Repair">Engine Repair</SelectItem>
                <SelectItem value="Transmission Service">Transmission Service</SelectItem>
                <SelectItem value="Chain Maintenance">Chain Maintenance (Bike)</SelectItem>
                <SelectItem value="Battery Service">Battery Service</SelectItem>
                <SelectItem value="Electrical Repair">Electrical Repair</SelectItem>
                <SelectItem value="Body Work">Body Work</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Parts */}
          <div className="space-y-2">
            <Label>Parts & Components</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add part or component"
                value={newPart}
                onChange={(e) => setNewPart(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPart())}
              />
              <Button type="button" onClick={addPart} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {parts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {parts.map((part, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {part}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => removePart(part)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Cost and Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Service Cost ($) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount ($)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>

          {/* Coupon Information */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasCoupon" 
                checked={hasCoupon}
                onCheckedChange={setHasCoupon}
              />
              <Label htmlFor="hasCoupon">Customer has coupon/contract</Label>
            </div>
            {hasCoupon && (
              <Select value={couponType} onValueChange={setCouponType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select coupon type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Maintenance Contract">Annual Maintenance Contract</SelectItem>
                  <SelectItem value="Loyalty Discount">Loyalty Discount</SelectItem>
                  <SelectItem value="First Time Customer">First Time Customer</SelectItem>
                  <SelectItem value="Seasonal Promotion">Seasonal Promotion</SelectItem>
                  <SelectItem value="Referral Discount">Referral Discount</SelectItem>
                  <SelectItem value="Senior Citizen Discount">Senior Citizen Discount</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Technician */}
          <div className="space-y-2">
            <Label htmlFor="technician">Technician *</Label>
            <Input
              id="technician"
              placeholder="Technician name"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Service Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the service..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Total Summary */}
          {cost && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Service Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Service Cost:</span>
                  <span>${parseFloat(cost || "0").toFixed(2)}</span>
                </div>
                {discount && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${parseFloat(discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-lg border-t pt-1">
                  <span>Total:</span>
                  <span>${(parseFloat(cost || "0") - parseFloat(discount || "0")).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Service Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
