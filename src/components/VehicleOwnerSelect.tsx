import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, User, Search } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";

interface VehicleOwnerSelectProps {
  vehicles: Vehicle[];
  selectedOwnerId?: string;
  selectedVehicleId?: string;
  onOwnerChange: (ownerId: string, ownerName: string) => void;
  onVehicleChange: (vehicleId: string, vehicle: Vehicle | null) => void;
  isAddingNewOwner: boolean;
  onToggleAddNewOwner: () => void;
  newOwnerName: string;
  onNewOwnerNameChange: (name: string) => void;
}

const VehicleOwnerSelect = ({
  vehicles,
  selectedOwnerId,
  selectedVehicleId,
  onOwnerChange,
  onVehicleChange,
  isAddingNewOwner,
  onToggleAddNewOwner,
  newOwnerName,
  onNewOwnerNameChange,
}: VehicleOwnerSelectProps) => {
  const [ownerSearchTerm, setOwnerSearchTerm] = useState("");

  // Get unique owners for dropdown
  const uniqueOwners = useMemo(() => {
    const ownerMap = new Map();
    vehicles.forEach(vehicle => {
      if (!ownerMap.has(vehicle.owner)) {
        ownerMap.set(vehicle.owner, {
          id: vehicle.owner,
          name: vehicle.owner,
          phone: vehicle.phone,
          vehicleCount: 1
        });
      } else {
        ownerMap.get(vehicle.owner).vehicleCount++;
      }
    });
    return Array.from(ownerMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [vehicles]);

  // Filter owners based on search term - show all if no search term
  const filteredOwners = uniqueOwners.filter(owner =>
    ownerSearchTerm.trim() === "" || 
    owner.name.toLowerCase().includes(ownerSearchTerm.toLowerCase())
  );

  // Get vehicles for selected owner
  const ownerVehicles = selectedOwnerId ? 
    vehicles.filter(v => v.owner === selectedOwnerId).sort((a, b) => a.make.localeCompare(b.make)) : 
    [];

  const handleOwnerSelect = (ownerId: string) => {
    const owner = uniqueOwners.find(o => o.id === ownerId);
    if (owner) {
      onOwnerChange(ownerId, owner.name);
      onVehicleChange("", null); // Reset vehicle selection
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId) || null;
    onVehicleChange(vehicleId, vehicle);
  };

  return (
    <div className="space-y-6">
      {/* Owner Selection */}
      <Card className="bg-ktm-dark-gray text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-ktm-orange">
            <User className="h-5 w-5" />
            Select Rider
          </CardTitle>
          <CardDescription className="text-ktm-light-gray">
            Choose an existing rider or add a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAddingNewOwner ? (
            <>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-ktm-orange" />
                <Input
                  placeholder="Search riders..."
                  value={ownerSearchTerm}
                  onChange={(e) => setOwnerSearchTerm(e.target.value)}
                  className="pl-10 bg-ktm-black border-ktm-orange"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Rider ({filteredOwners.length} found)</Label>
                <Select value={selectedOwnerId || ""} onValueChange={handleOwnerSelect}>
                  <SelectTrigger className="bg-ktm-black border-ktm-orange">
                    <SelectValue placeholder="Select rider" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-ktm-dark-gray border-ktm-orange text-white">
                    {filteredOwners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">{owner.name}</span>
                            <span className="text-xs text-ktm-light-gray">{owner.phone}</span>
                          </div>
                          <span className="text-xs text-ktm-light-gray ml-4">
                            {owner.vehicleCount} motorbike{owner.vehicleCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={onToggleAddNewOwner}
                className="w-full bg-ktm-black border-ktm-orange"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Rider
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="newOwner">New Rider Name</Label>
              <Input
                id="newOwner"
                placeholder="Enter rider name"
                value={newOwnerName}
                onChange={(e) => onNewOwnerNameChange(e.target.value)}
                className="bg-ktm-black border-ktm-orange"
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={onToggleAddNewOwner}
                  className="flex-1 bg-ktm-black border-ktm-orange"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (newOwnerName.trim()) {
                      onOwnerChange(newOwnerName.trim(), newOwnerName.trim());
                      onToggleAddNewOwner();
                    }
                  }}
                  disabled={!newOwnerName.trim()}
                  className="flex-1 bg-ktm-orange text-white"
                >
                  Use This Rider
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Selection */}
      {(selectedOwnerId || isAddingNewOwner) && (
        <Card className="bg-ktm-dark-gray text-white">
          <CardHeader>
            <CardTitle className="text-ktm-orange">Select Motorbike</CardTitle>
            <CardDescription className="text-ktm-light-gray">
              {isAddingNewOwner 
                ? "Note: For new riders, you'll need to add their motorbike to the system first"
                : `Choose from ${ownerVehicles.length} motorbike${ownerVehicles.length !== 1 ? 's' : ''} owned by ${selectedOwnerId}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isAddingNewOwner ? (
              <Select value={selectedVehicleId || ""} onValueChange={handleVehicleSelect}>
                <SelectTrigger className="bg-ktm-black border-ktm-orange">
                  <SelectValue placeholder="Select motorbike" />
                </SelectTrigger>
                <SelectContent className="bg-ktm-dark-gray border-ktm-orange-dim text-white">
                  {ownerVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {vehicle.make} {vehicle.model}
                        </span>
                        <span className="text-xs text-ktm-light-gray">
                          ({vehicle.year}) - {vehicle.id}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-center py-4 text-ktm-light-gray">
                <p>Please add the motorbike to the system first before creating service records for new riders.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleOwnerSelect;