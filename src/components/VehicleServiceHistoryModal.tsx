
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vehicle } from "@/services/supabaseService";
import ServiceHistory from "./ServiceHistory";

interface VehicleServiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  vehicles: Vehicle[];
}

const VehicleServiceHistoryModal = ({ isOpen, onClose, vehicle, vehicles }: VehicleServiceHistoryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Service History</DialogTitle>
          <DialogDescription>
            {vehicle ? `Service history for ${vehicle.bikeModel} (${vehicle.owner})` : "Bike service history"}
          </DialogDescription>
        </DialogHeader>
        
        <ServiceHistory selectedVehicle={vehicle} vehicles={vehicles} />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleServiceHistoryModal;
