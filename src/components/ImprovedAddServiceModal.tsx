import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Vehicle, Part, addServiceRecord } from "@/services/supabaseService";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import VehicleOwnerSelect from "./VehicleOwnerSelect";
import CouponTypeSelect from "./forms/CouponTypeSelect";
import { CouponType } from "@/types/couponType";
import { useProfiles } from "@/hooks/useProfiles";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ImprovedAddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  vehicle?: Vehicle | null;
}

const ImprovedAddServiceModal = ({ isOpen, onClose, vehicles, vehicle }: ImprovedAddServiceModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: profiles = [] } = useProfiles();

  // Owner and Vehicle Selection
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("");
  const [selectedOwnerName, setSelectedOwnerName] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAddingNewOwner, setIsAddingNewOwner] = useState(false);
  const [newOwnerName, setNewOwnerName] = useState("");

  // Service Details
  const [serviceType, setServiceType] = useState("");
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextServiceDate, setNextServiceDate] = useState("");
  const [technician, setTechnician] = useState("");
  const [kilometers, setKilometers] = useState<number>(0);
  const [laborCost, setLaborCost] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponType, setCouponType] = useState("");
  const [selectedCouponType, setSelectedCouponType] = useState<CouponType | null>(null);
  const [serviceCenterName, setServiceCenterName] = useState("");

  // Parts Management
  const [parts, setParts] = useState<Part[]>([]);
  const [newPartName, setNewPartName] = useState("");
  const [newPartCost, setNewPartCost] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (vehicle) {
        setSelectedOwnerId(vehicle.owner);
        setSelectedOwnerName(vehicle.owner);
        setSelectedVehicleId(vehicle.id);
        setSelectedVehicle(vehicle);
        setKilometers(vehicle.currentKilometers);
      } else {
        resetForm();
      }
    }
  }, [isOpen, vehicle]);

  const handleOwnerChange = (ownerId: string, ownerName: string) => {
    setSelectedOwnerId(ownerId);
    setSelectedOwnerName(ownerName);
  };

  const handleVehicleChange = (vehicleId: string, vehicle: Vehicle | null) => {
    setSelectedVehicleId(vehicleId);
    setSelectedVehicle(vehicle);
    if (vehicle) {
      setKilometers(vehicle.currentKilometers);
    }
  };

  const addPart = () => {
    if (newPartName.trim() && newPartCost > 0) {
      setParts([...parts, { name: newPartName.trim(), cost: newPartCost }]);
      setNewPartName("");
      setNewPartCost(0);
    }
  };

  const removePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setSelectedOwnerId("");
    setSelectedOwnerName("");
    setSelectedVehicleId("");
    setSelectedVehicle(null);
    setIsAddingNewOwner(false);
    setNewOwnerName("");
    setServiceType("");
    setServiceDate(new Date().toISOString().split('T')[0]);
    setNextServiceDate("");
    setTechnician("");
    setKilometers(0);
    setLaborCost(0);
    setDiscount(0);
    setNotes("");
    setHasCoupon(false);
    setCouponType("");
    setSelectedCouponType(null);
    setServiceCenterName("");
    setParts([]);
    setNewPartName("");
    setNewPartCost(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedVehicleId || !serviceType || !technician.trim() || !serviceCenterName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including service center",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addServiceRecord({
        vehicleId: selectedVehicleId,
        date: serviceDate,
        type: serviceType,
        parts,
        laborCost,
        discount,
        technician: technician.trim(),
        notes,
        hasCoupon,
        couponType: hasCoupon ? couponType : null,
        kilometers,
        serviceCenterName: serviceCenterName.trim(),
      });

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['serviceRecords'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });

      toast({
        title: "Service Record Added",
        description: "The service record has been successfully created.",
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding service record:', error);
      toast({
        title: "Error",
        description: "Failed to add service record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const partsTotal = parts.reduce((sum, part) => sum + part.cost, 0);
    return partsTotal + laborCost - discount;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service Record</DialogTitle>
          <DialogDescription>
            Create a new service record for a vehicle
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle and Owner Selection */}
          {vehicle ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="p-4 border rounded-md bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <p><span className="font-medium text-gray-600">Owner:</span> {vehicle.owner}</p>
                <p><span className="font-medium text-gray-600">Bike:</span> {vehicle.bikeModel} ({vehicle.year})</p>
                <p><span className="font-medium text-gray-600">VIN:</span> {vehicle.id}</p>
              </div>
            </div>
          ) : (
            <VehicleOwnerSelect
              vehicles={vehicles}
              selectedOwnerId={selectedOwnerId}
              selectedVehicleId={selectedVehicleId}
              onOwnerChange={handleOwnerChange}
              onVehicleChange={handleVehicleChange}
              isAddingNewOwner={isAddingNewOwner}
              onToggleAddNewOwner={() => setIsAddingNewOwner(!isAddingNewOwner)}
              newOwnerName={newOwnerName}
              onNewOwnerNameChange={setNewOwnerName}
            />
          )}

          {/* Service Details */}
          {selectedVehicle && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Service Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Input
                    id="serviceType"
                    placeholder="e.g., Oil Change, Brake Service"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="serviceDate">Service Date *</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="nextServiceDate">Next Service Date</Label>
                  <Input
                    id="nextServiceDate"
                    type="date"
                    value={nextServiceDate}
                    onChange={(e) => setNextServiceDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="technician">Technician *</Label>
                  <Input
                    id="technician"
                    placeholder="Enter technician name"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="serviceCenterName">Service Center *</Label>
                  <Select value={serviceCenterName} onValueChange={setServiceCenterName} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service center" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.service_center_name}>
                          {profile.service_center_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="kilometers">Current Kilometers</Label>
                  <Input
                    id="kilometers"
                    type="number"
                    value={kilometers}
                    onChange={(e) => setKilometers(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Parts Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Parts Used</h4>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Part name"
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Cost"
                    value={newPartCost}
                    onChange={(e) => setNewPartCost(Number(e.target.value))}
                    className="w-24"
                    min="0"
                    step="0.01"
                  />
                  <Button type="button" onClick={addPart}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {parts.length > 0 && (
                  <div className="space-y-2">
                    {parts.map((part, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <Badge variant="secondary">{part.name}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${part.cost.toFixed(2)}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePart(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cost Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="laborCost">Labor Cost</Label>
                  <Input
                    id="laborCost"
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="flex items-end">
                  <div className="w-full">
                    <Label>Total Amount</Label>
                    <div className="text-2xl font-bold text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasCoupon"
                  checked={hasCoupon}
                  onCheckedChange={(checked) => setHasCoupon(checked === true)}
                />
                <Label htmlFor="hasCoupon">Applied coupon/discount</Label>
              </div>

              {hasCoupon && (
                <CouponTypeSelect
                  value={couponType}
                  onValueChange={setCouponType}
                  onCouponTypeSelect={(couponType) => {
                    setSelectedCouponType(couponType);
                    // Auto-set labor cost to 0 for Free coupons
                    if (couponType?.laborDiscountType === 'none') {
                      setLaborCost(0);
                    }
                  }}
                />
              )}

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Service Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the service..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !selectedVehicleId || !serviceType || !technician.trim() || !serviceCenterName.trim()}
            >
              {isSubmitting ? "Adding..." : "Add Service Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImprovedAddServiceModal;
