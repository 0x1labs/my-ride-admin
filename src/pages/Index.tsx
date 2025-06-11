
import { useAuth } from "@/contexts/AuthContext";
import DashboardStats from "@/components/DashboardStats";
import VehicleCard from "@/components/VehicleCard";
import AddVehicleModal from "@/components/AddVehicleModal";
import AddServiceModal from "@/components/AddServiceModal";
import ServiceHistory from "@/components/ServiceHistory";
import CustomerCallDashboard from "@/components/CustomerCallDashboard";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import SuperAdminPanel from "@/components/auth/SuperAdminPanel";
import { Button } from "@/components/ui/button";
import { useVehicles } from "@/hooks/useVehicles";
import { useState } from "react";
import { LogOut, Settings, Users } from "lucide-react";

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const { data: vehicles = [], isLoading } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'admin'>('dashboard');

  const handleLogout = async () => {
    await signOut();
  };

  // Show SuperAdmin interface for superadmin users
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
            <div className="flex gap-4">
              <div className="flex gap-2">
                <Button
                  variant={currentView === 'dashboard' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Service Dashboard
                </Button>
                <Button
                  variant={currentView === 'admin' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('admin')}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  User Management
                </Button>
              </div>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {currentView === 'admin' ? (
            <SuperAdminPanel />
          ) : (
            // Show the same service dashboard as regular users
            <div className="space-y-8">
              <DashboardStats vehicles={vehicles} />
              
              <div className="grid gap-6">
                <CustomerCallDashboard vehicles={vehicles} />
                <AnalyticsDashboard vehicles={vehicles} />
                
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-gray-900">Vehicles</h2>
                    <Button onClick={() => setIsAddVehicleModalOpen(true)}>
                      Add Vehicle
                    </Button>
                  </div>
                  
                  {isLoading ? (
                    <div className="text-center py-8">Loading vehicles...</div>
                  ) : vehicles && vehicles.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {vehicles.map((vehicle) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          onServiceClick={() => {
                            setSelectedVehicle(vehicle.id);
                            setIsAddServiceModalOpen(true);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No vehicles found. Add your first vehicle to get started.
                    </div>
                  )}
                </div>
                
                <ServiceHistory vehicles={vehicles} />
              </div>

              <AddVehicleModal
                open={isAddVehicleModalOpen}
                onOpenChange={setIsAddVehicleModalOpen}
              />

              <AddServiceModal
                isOpen={isAddServiceModalOpen}
                onClose={() => setIsAddServiceModalOpen(false)}
                vehicles={vehicles}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show regular service center interface
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
          
          <div className="grid gap-6">
            <CustomerCallDashboard vehicles={vehicles} />
            <AnalyticsDashboard vehicles={vehicles} />
            
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">Vehicles</h2>
                <Button onClick={() => setIsAddVehicleModalOpen(true)}>
                  Add Vehicle
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">Loading vehicles...</div>
              ) : vehicles && vehicles.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onServiceClick={() => {
                        setSelectedVehicle(vehicle.id);
                        setIsAddServiceModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No vehicles found. Add your first vehicle to get started.
                </div>
              )}
            </div>
            
            <ServiceHistory vehicles={vehicles} />
          </div>

          <AddVehicleModal
            open={isAddVehicleModalOpen}
            onOpenChange={setIsAddVehicleModalOpen}
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
