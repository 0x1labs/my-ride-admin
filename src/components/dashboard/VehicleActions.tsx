import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddVehicleModal from "@/components/AddVehicleModal";
import ImprovedAddServiceModal from "@/components/ImprovedAddServiceModal";
import { Vehicle } from "@/types/vehicle";

interface VehicleActionsProps {
  vehicles: Vehicle[];
  isAddServiceModalOpen: boolean;
  onAddServiceModalChange: (open: boolean) => void;
  vehicleForNewService: Vehicle | null;
  onVehicleForNewServiceChange: (vehicle: Vehicle | null) => void;
}

const VehicleActions = ({ 
  vehicles, 
  isAddServiceModalOpen, 
  onAddServiceModalChange,
  vehicleForNewService,
  onVehicleForNewServiceChange
}: VehicleActionsProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white font-roboto-condensed">Motorbike Management</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onAddServiceModalChange(true)} className="bg-ktm-dark-gray border-ktm-orange-dim text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
          <AddVehicleModal />
        </div>
      </div>

      <ImprovedAddServiceModal
        isOpen={isAddServiceModalOpen}
        onClose={() => {
          onAddServiceModalChange(false);
          onVehicleForNewServiceChange(null);
        }}
        vehicles={vehicles}
        vehicle={vehicleForNewService}
      />
    </>
  );
};

export default VehicleActions;