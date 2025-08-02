
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";

interface VehicleSearchAndFilterProps {
  vehicles: Vehicle[];
  onFilteredVehiclesChange: (filteredVehicles: Vehicle[]) => void;
}

const VehicleSearchAndFilter = ({ vehicles, onFilteredVehiclesChange }: VehicleSearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const applyFilters = (search: string, status: string, type: string) => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = 
        vehicle.id.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.owner.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.bikeModel.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "all" || vehicle.status === status;
      const matchesType = type === "all" || vehicle.type === type;

      return matchesSearch && matchesStatus && matchesType;
    });

    onFilteredVehiclesChange(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, statusFilter, typeFilter);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchTerm, value, typeFilter);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    applyFilters(searchTerm, statusFilter, value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by VIN, owner, or bike model..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-32">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
};

export default VehicleSearchAndFilter;
