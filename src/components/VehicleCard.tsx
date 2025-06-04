import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Bike, Calendar, Phone, Eye } from "lucide-react";
import { Vehicle } from "@/services/vehicleService";

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewHistory?: () => void;
}

const VehicleCard = ({ vehicle, onViewHistory }: VehicleCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <Card className="hover:shadow-md transition-shadow duration-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {vehicle.type === "car" ? 
              <Car className="h-5 w-5 text-blue-600" /> : 
              <Bike className="h-5 w-5 text-green-600" />
            }
            <CardTitle className="text-lg">{vehicle.make} {vehicle.model}</CardTitle>
          </div>
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">VIN: {vehicle.id}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900">{vehicle.owner}</h4>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Phone className="h-3 w-3" />
            {vehicle.phone}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Last Service:</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>{formatDate(vehicle.lastService)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next Service:</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              <span>{formatDate(vehicle.nextService)}</span>
            </div>
          </div>
        </div>

        {onViewHistory && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewHistory}
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Service History
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
