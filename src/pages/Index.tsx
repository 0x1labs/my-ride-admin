import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Car, Bike, Calendar, Wrench, DollarSign, TrendingUp } from "lucide-react";
import ServiceHistory from "@/components/ServiceHistory";
import AddServiceModal from "@/components/AddServiceModal";
import VehicleCard from "@/components/VehicleCard";
import DashboardStats from "@/components/DashboardStats";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Mock data for vehicles - fixed type issues
  const vehicles = [
    {
      id: "VIN001",
      type: "car" as const,
      make: "Honda",
      model: "Civic",
      year: 2020,
      owner: "John Doe",
      phone: "+1-555-0123",
      lastService: "2024-05-15",
      nextService: "2024-11-15",
      status: "active" as const
    },
    {
      id: "VIN002",
      type: "bike" as const,
      make: "Yamaha",
      model: "MT-07",
      year: 2021,
      owner: "Jane Smith",
      phone: "+1-555-0124",
      lastService: "2024-04-20",
      nextService: "2024-10-20",
      status: "overdue" as const
    },
    {
      id: "VIN003",
      type: "car" as const,
      make: "Toyota",
      model: "Camry",
      year: 2019,
      owner: "Mike Johnson",
      phone: "+1-555-0125",
      lastService: "2024-06-01",
      nextService: "2024-12-01",
      status: "active" as const
    }
  ];

  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ServiceTracker Pro</h1>
              <p className="text-gray-600">Vehicle Service Management System</p>
            </div>
            <Button 
              onClick={() => setIsAddServiceOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service Record
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Service History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardStats vehicles={vehicles} />
            
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.slice(0, 3).map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vehicles">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search vehicles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle}
                    onViewHistory={() => {
                      setSelectedVehicle(vehicle);
                      setActiveTab("services");
                    }}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services">
            <ServiceHistory selectedVehicle={selectedVehicle} vehicles={vehicles} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard vehicles={vehicles} />
          </TabsContent>
        </Tabs>
      </div>

      <AddServiceModal 
        isOpen={isAddServiceOpen} 
        onClose={() => setIsAddServiceOpen(false)}
        vehicles={vehicles}
      />
    </div>
  );
};

export default Index;
