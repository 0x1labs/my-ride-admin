
import { useAuth } from "@/contexts/AuthContext";
import DashboardStats from "@/components/DashboardStats";
import VehicleCard from "@/components/VehicleCard";
import VehicleSearchAndFilter from "@/components/VehicleSearchAndFilter";
import VehicleServiceHistoryModal from "@/components/VehicleServiceHistoryModal";
import AddVehicleModal from "@/components/AddVehicleModal";
import AddServiceModal from "@/components/AddServiceModal";
import ServiceHistory from "@/components/ServiceHistory";
import CustomerCallDashboard from "@/components/CustomerCallDashboard";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import SuperAdminPanel from "@/components/auth/SuperAdminPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVehicles } from "@/hooks/useVehicles";
import { useState } from "react";
import { LogOut, Car, Phone, BarChart3, History } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const { data: vehicles = [], isLoading } = useVehicles();
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleForHistory, setSelectedVehicleForHistory] = useState<Vehicle | null>(null);
  const [isServiceHistoryModalOpen, setIsServiceHistoryModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const handleViewServiceHistory = (vehicle: Vehicle) => {
    setSelectedVehicleForHistory(vehicle);
    setIsServiceHistoryModalOpen(true);
  };

  // Show SuperAdmin interface for superadmin users - only user management
  if (profile?.role === 'superadmin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* SuperAdmin Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <SuperAdminPanel />
        </div>
      </div>
    );
  }

  // Show regular service center interface with tabs
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Service Center Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ServiceTracker Pro</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="space-y-8">
          <DashboardStats vehicles={vehicles} />
          
          <Tabs defaultValue="vehicles" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vehicles" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="calls" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Customer Calls
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Vehicle Management</h2>
                <AddVehicleModal />
              </div>
              
              <VehicleSearchAndFilter 
                vehicles={vehicles} 
                onFilteredVehiclesChange={setFilteredVehicles}
              />
              
              {isLoading ? (
                <div className="text-center py-8">Loading vehicles...</div>
              ) : (
                <>
                  {(filteredVehicles.length > 0 ? filteredVehicles : vehicles).length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {(filteredVehicles.length > 0 ? filteredVehicles : vehicles).map((vehicle) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          onViewHistory={() => handleViewServiceHistory(vehicle)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {filteredVehicles.length === 0 && vehicles.length > 0 
                        ? "No vehicles match your search criteria."
                        : "No vehicles found. Add your first vehicle to get started."
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
              <AnalyticsDashboard vehicles={vehicles} />
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

          <AddServiceModal
            isOpen={isAddServiceModalOpen}
            onClose={() => setIsAddServiceModalOpen(false)}
            vehicles={vehicles}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
