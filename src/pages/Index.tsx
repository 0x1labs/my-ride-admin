import { useAuth } from "@/contexts/AuthContext";
import DashboardStats from "@/components/DashboardStats";
import VehicleCard from "@/components/VehicleCard";
import VehicleSearchAndFilter from "@/components/VehicleSearchAndFilter";
import VehicleServiceHistoryModal from "@/components/VehicleServiceHistoryModal";
import ServiceHistory from "@/components/ServiceHistory";
import CustomerCallDashboard from "@/components/CustomerCallDashboard";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import SuperAdminPanel from "@/components/auth/SuperAdminPanel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import VehicleActions from "@/components/dashboard/VehicleActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVehicles, useDeleteVehicle } from "@/hooks/useVehicles";
import { useServiceRecords } from "@/hooks/useServiceRecords";
import { useState } from "react";
import { Bike, Phone, BarChart3, History } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import EditVehicleModal from "@/components/EditVehicleModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const { data: vehicles = [], isLoading } = useVehicles();
  const { data: serviceRecords = [] } = useServiceRecords();
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleForHistory, setSelectedVehicleForHistory] = useState<Vehicle | null>(null);
  const [isServiceHistoryModalOpen, setIsServiceHistoryModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [vehicleForNewService, setVehicleForNewService] = useState<Vehicle | null>(null);

  const { mutate: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();

  const handleLogout = async () => {
    await signOut();
  };

  const handleViewServiceHistory = (vehicle: Vehicle) => {
    setSelectedVehicleForHistory(vehicle);
    setIsServiceHistoryModalOpen(true);
  };

  const handleAddServiceRecord = (vehicle: Vehicle) => {
    setVehicleForNewService(vehicle);
    setIsAddServiceModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setIsEditModalOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete.id, {
        onSuccess: () => {
          toast.success(`Motorbike ${vehicleToDelete.make} ${vehicleToDelete.model} deleted.`);
          setIsDeleteAlertOpen(false);
          setVehicleToDelete(null);
        },
        onError: (error) => {
          toast.error(`Failed to delete motorbike: ${error.message}`);
          setIsDeleteAlertOpen(false);
          setVehicleToDelete(null);
        },
      });
    }
  };

  // Show SuperAdmin interface for superadmin users - only user management
  if (profile?.role === 'superadmin') {
    return (
      <div className="min-h-screen bg-ktm-black">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader
            userEmail={user?.email}
            onLogout={handleLogout}
            title="SuperAdmin Dashboard"
          />
          <SuperAdminPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ktm-black text-white">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader userEmail={user?.email} onLogout={handleLogout} />

        <div className="space-y-8">
          <DashboardStats vehicles={vehicles} />
          
          <Tabs defaultValue="vehicles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-ktm-dark-gray">
              <TabsTrigger value="vehicles" className="flex items-center gap-2 text-ktm-orange">
                <Bike className="h-4 w-4" />
                My Garage
              </TabsTrigger>
              <TabsTrigger value="calls" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Rider Calls
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Service History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicles" className="space-y-6">
              <VehicleActions
                vehicles={vehicles}
                isAddServiceModalOpen={isAddServiceModalOpen}
                onAddServiceModalChange={setIsAddServiceModalOpen}
                vehicleForNewService={vehicleForNewService}
                onVehicleForNewServiceChange={setVehicleForNewService}
              />
              
              <VehicleSearchAndFilter 
                vehicles={vehicles} 
                onFilteredVehiclesChange={setFilteredVehicles}
              />
              
              {isLoading ? (
                <div className="text-center py-8">Loading motorbikes...</div>
              ) : (
                <>
                  {(filteredVehicles.length > 0 ? filteredVehicles : vehicles).length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(filteredVehicles.length > 0 ? filteredVehicles : vehicles).map((vehicle) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          onViewHistory={() => handleViewServiceHistory(vehicle)}
                          onAddService={() => handleAddServiceRecord(vehicle)}
                          onEdit={() => handleEditVehicle(vehicle)}
                          onDelete={() => handleDeleteVehicle(vehicle)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-ktm-light-gray">
                      {filteredVehicles.length === 0 && vehicles.length > 0 
                        ? "No motorbikes match your search criteria."
                        : "No motorbikes found. Add your first motorbike to get started."
                      }
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="calls" className="space-y-6">
              <CustomerCallDashboard vehicles={vehicles} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsDashboard vehicles={vehicles} serviceRecords={serviceRecords} />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <ServiceHistory vehicles={vehicles} />
            </TabsContent>
          </Tabs>

          <VehicleServiceHistoryModal
            isOpen={isServiceHistoryModalOpen}
            onClose={() => setIsServiceHistoryModalOpen(false)}
            vehicle={selectedVehicleForHistory}
            vehicles={vehicles}
          />

          <EditVehicleModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setVehicleToEdit(null);
            }}
            vehicle={vehicleToEdit}
          />

          <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent className="bg-ktm-dark-gray text-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-ktm-orange">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-ktm-light-gray">
                  This action cannot be undone. This will permanently delete the
                  motorbike and all associated service and call records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setVehicleToDelete(null)} className="bg-ktm-black text-white">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 text-white">
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Index;