
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Car, Bike, Calendar, Wrench, DollarSign, TrendingUp, Phone } from "lucide-react";
import ServiceHistory from "@/components/ServiceHistory";
import AddServiceModal from "@/components/AddServiceModal";
import VehicleCard from "@/components/VehicleCard";
import DashboardStats from "@/components/DashboardStats";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import CustomerCallDashboard from "@/components/CustomerCallDashboard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [manufacturerFilter, setManufacturerFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const vehiclesPerPage = 12;

  // Generate 200 mock vehicles
  const generateVehicles = () => {
    const carMakes = ["Honda", "Toyota", "Ford", "Chevrolet", "BMW", "Mercedes", "Audi", "Volkswagen", "Nissan", "Hyundai"];
    const carModels = ["Civic", "Camry", "F-150", "Silverado", "3 Series", "C-Class", "A4", "Jetta", "Altima", "Elantra"];
    const bikeMakes = ["Yamaha", "Honda", "Kawasaki", "Suzuki", "Ducati", "Harley", "BMW", "KTM", "Triumph", "Indian"];
    const bikeModels = ["MT-07", "CBR600", "Ninja", "GSX-R", "Panigale", "Sportster", "R1250", "Duke", "Street Triple", "Scout"];
    
    const firstNames = ["John", "Jane", "Mike", "Sarah", "David", "Lisa", "Chris", "Emma", "Ryan", "Ashley"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
    const statuses = ["active", "overdue", "upcoming"] as const;

    const vehicles = [];
    
    for (let i = 1; i <= 200; i++) {
      const isCarType = Math.random() > 0.4; // 60% cars, 40% bikes
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      const vehicle = {
        id: `VIN${String(i).padStart(3, '0')}`,
        type: isCarType ? "car" as const : "bike" as const,
        make: isCarType ? carMakes[Math.floor(Math.random() * carMakes.length)] : bikeMakes[Math.floor(Math.random() * bikeMakes.length)],
        model: isCarType ? carModels[Math.floor(Math.random() * carModels.length)] : bikeModels[Math.floor(Math.random() * bikeModels.length)],
        year: 2015 + Math.floor(Math.random() * 10), // Years 2015-2024
        owner: `${firstName} ${lastName}`,
        phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        lastService: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextService: new Date(Date.now() + Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: statuses[Math.floor(Math.random() * statuses.length)]
      };
      
      vehicles.push(vehicle);
    }
    
    return vehicles;
  };

  const vehicles = generateVehicles();

  // Get unique manufacturers for filter dropdown
  const uniqueManufacturers = Array.from(new Set(vehicles.map(v => v.make))).sort();

  // Enhanced filtering logic
  const getFilteredAndSortedVehicles = () => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesManufacturer = manufacturerFilter === "all" || vehicle.make === manufacturerFilter;

      let matchesService = true;
      if (serviceFilter === "recent") {
        const lastServiceDate = new Date(vehicle.lastService);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        matchesService = lastServiceDate >= thirtyDaysAgo;
      } else if (serviceFilter === "overdue") {
        matchesService = vehicle.status === "overdue";
      } else if (serviceFilter === "upcoming") {
        matchesService = vehicle.status === "upcoming";
      }

      return matchesSearch && matchesManufacturer && matchesService;
    });

    // Sort vehicles
    if (sortBy === "nextServiceAsc") {
      filtered.sort((a, b) => new Date(a.nextService).getTime() - new Date(b.nextService).getTime());
    } else if (sortBy === "overduePriority") {
      filtered.sort((a, b) => {
        if (a.status === "overdue" && b.status !== "overdue") return -1;
        if (b.status === "overdue" && a.status !== "overdue") return 1;
        if (a.status === "upcoming" && b.status !== "upcoming") return -1;
        if (b.status === "upcoming" && a.status !== "upcoming") return 1;
        return new Date(a.nextService).getTime() - new Date(b.nextService).getTime();
      });
    } else if (sortBy === "lastServiceDesc") {
      filtered.sort((a, b) => new Date(b.lastService).getTime() - new Date(a.lastService).getTime());
    }

    return filtered;
  };

  const filteredVehicles = getFilteredAndSortedVehicles();

  // Calculate pagination
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleFilterChange();
  };

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
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
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
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Customer Calls
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
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
                  </p>
                </div>
              </div>

              {/* Enhanced Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative lg:col-span-2">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search vehicles..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={manufacturerFilter} onValueChange={(value) => { setManufacturerFilter(value); handleFilterChange(); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Manufacturer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Manufacturers</SelectItem>
                      {uniqueManufacturers.map(manufacturer => (
                        <SelectItem key={manufacturer} value={manufacturer}>{manufacturer}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={serviceFilter} onValueChange={(value) => { setServiceFilter(value); handleFilterChange(); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Service Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="recent">Recently Serviced</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value) => { setSortBy(value); handleFilterChange(); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="nextServiceAsc">Next Service Date</SelectItem>
                      <SelectItem value="overduePriority">Priority (Overdue First)</SelectItem>
                      <SelectItem value="lastServiceDesc">Last Service Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedVehicles.map((vehicle) => (
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

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNumber)}
                              isActive={currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="services">
            <ServiceHistory selectedVehicle={selectedVehicle} vehicles={vehicles} />
          </TabsContent>

          <TabsContent value="calls">
            <CustomerCallDashboard vehicles={vehicles} />
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
