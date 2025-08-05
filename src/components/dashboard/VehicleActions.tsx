
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Vehicle Management</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" onClick={() => onAddServiceModalChange(true)} className="w-full sm:w-auto">
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
