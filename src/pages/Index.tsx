
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Car, Bike, Calendar, Wrench, DollarSign, TrendingUp, Phone } from "lucide-react";
import ServiceHistory from "@/components/ServiceHistory";
import ImprovedAddServiceModal from "@/components/ImprovedAddServiceModal";
import AddVehicleModal from "@/components/AddVehicleModal";
import VehicleCard from "@/components/VehicleCard";
import ImprovedDashboardStats from "@/components/ImprovedDashboardStats";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import CustomerCallDashboard from "@/components/CustomerCallDashboard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useVehicles, useVehiclesWithFilters } from "@/hooks/useVehicles";

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

  // Get vehicles from Supabase using React Query
  const { data: allVehicles = [], isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();
  const { vehicles: filteredVehicles, totalCount } = useVehiclesWithFilters(
    searchTerm,
    manufacturerFilter,
    serviceFilter,
    sortBy
  );

  // Get unique manufacturers for filter dropdown
  const uniqueManufacturers = Array.from(new Set(allVehicles.map(v => v.make))).sort();

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / vehiclesPerPage);
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

  // Show loading state
  if (vehiclesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (vehiclesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading vehicle data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-2">
              <AddVehicleModal />
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
            <ImprovedDashboardStats vehicles={allVehicles} />
          </TabsContent>

          <TabsContent value="vehicles">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Vehicle Management</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalCount)} of {totalCount} vehicles
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
            <ServiceHistory selectedVehicle={selectedVehicle} vehicles={allVehicles} />
          </TabsContent>

          <TabsContent value="calls">
            <CustomerCallDashboard vehicles={allVehicles} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard vehicles={allVehicles} />
          </TabsContent>
        </Tabs>
      </div>

      <ImprovedAddServiceModal 
        isOpen={isAddServiceOpen} 
        onClose={() => setIsAddServiceOpen(false)}
        vehicles={allVehicles}
      />
    </div>
  );
};

export default Index;
