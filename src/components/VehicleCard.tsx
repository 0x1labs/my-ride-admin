import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bike, Calendar, Phone, Eye, MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewHistory?: () => void;
  onAddService: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const VehicleCard = ({ vehicle, onViewHistory, onAddService, onEdit, onDelete }: VehicleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white";
      case "overdue":
        return "bg-red-500 text-white";
      case "upcoming":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="bg-ktm-dark-gray text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="h-5 w-5 text-ktm-orange" />
            <CardTitle className="text-lg text-ktm-orange">
              {vehicle.make} {vehicle.model}
              {vehicle.variant && <span className="text-sm font-normal text-ktm-light-gray"> ({vehicle.variant})</span>}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Badge className={getStatusColor(vehicle.status)}>
              {vehicle.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-ktm-orange">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-ktm-dark-gray border-ktm-orange-dim text-white">
                <DropdownMenuItem onClick={onEdit} className="hover:bg-ktm-orange">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-red-500 hover:bg-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-ktm-light-gray">VIN: {vehicle.id}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-white">{vehicle.owner}</h4>
          <div className="flex items-center gap-1 text-sm text-ktm-light-gray">
            <Phone className="h-3 w-3" />
            {vehicle.phone}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ktm-light-gray">Last Service:</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-ktm-orange" />
              <span>{formatDate(vehicle.lastService)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ktm-light-gray">Next Service:</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-ktm-orange" />
              <span>{formatDate(vehicle.nextService)}</span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 pt-2">
          {onViewHistory && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onViewHistory}
              className="w-full bg-ktm-black text-white border-ktm-orange-dim"
            >
              <Eye className="h-4 w-4 mr-2" />
              View History
            </Button>
          )}
          <Button 
            size="sm" 
            onClick={onAddService}
            className="w-full bg-ktm-orange text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;