import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Calendar, DollarSign, FileText, Car, Bike } from "lucide-react";
import { Vehicle, Part } from "@/services/supabaseService";
import { useServiceRecords, useServiceRecordsByVehicle } from "@/hooks/useServiceRecords";

interface ServiceHistoryProps {
  selectedVehicle?: Vehicle | null;
  vehicles: Vehicle[];
}

const ServiceHistory = ({ selectedVehicle, vehicles }: ServiceHistoryProps) => {
  const [currentVehicle, setCurrentVehicle] = useState(selectedVehicle?.id || "all");

  // Use appropriate hook based on vehicle selection
  const { data: allServiceRecords = [], isLoading: allLoading } = useServiceRecords();
  const { data: vehicleServiceRecords = [], isLoading: vehicleLoading } = useServiceRecordsByVehicle(
    currentVehicle !== "all" ? currentVehicle : undefined
  );

  const filteredRecords = currentVehicle !== "all" ? vehicleServiceRecords : allServiceRecords;
  const isLoading = currentVehicle !== "all" ? vehicleLoading : allLoading;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotalPartsCost = (parts: Part[]) => {
    return parts.reduce((total, part) => total + part.cost, 0);
  };

  const calculateTotalCost = (parts: Part[], laborCost: number) => {
    return calculateTotalPartsCost(parts) + laborCost;
  };

  const calculateFinalCost = (parts: Part[], laborCost: number, discount: number) => {
    return calculateTotalCost(parts, laborCost) - discount;
  };

  const selectedVehicleData = vehicles.find(v => v.id === currentVehicle);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading service records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
        <Select value={currentVehicle} onValueChange={setCurrentVehicle}>
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Select a vehicle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4" />
                  {vehicle.bikeModel} - {vehicle.owner}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedVehicleData && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-orange-600" />
              <CardTitle>{selectedVehicleData.bikeModel}</CardTitle>
            </div>
            <CardDescription>Owner: {selectedVehicleData.owner} | VIN: {selectedVehicleData.id}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No service records found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => {
            const vehicle = vehicles.find(v => v.id === record.vehicleId);
            const totalPartsCost = calculateTotalPartsCost(record.parts);
            const totalCost = calculateTotalCost(record.parts, record.laborCost);
            const finalCost = calculateFinalCost(record.parts, record.laborCost, record.discount);
            
            return (
              <Card key={record.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{record.type}</CardTitle>
                      <CardDescription>Service ID: {record.id}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {formatDate(record.date)}
                      </div>
                      <p className="text-sm text-gray-600">by {record.technician}</p>
                      {record.serviceCenterName && (
                        <p className="text-xs text-blue-600 font-medium">{record.serviceCenterName}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentVehicle === "all" && vehicle && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Bike className="h-4 w-4" />
                      <span>{vehicle.bikeModel} - {vehicle.owner}</span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Parts & Services</h4>
                    <div className="space-y-2">
                      {record.parts.map((part, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <Badge variant="secondary">{part.name}</Badge>
                          <span className="text-sm font-medium">Nrs {part.cost.toFixed(2)}</span>
                        </div>
                      ))}
                      {record.parts.length > 0 && (
                        <div className="border-t pt-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Total Parts Cost:</span>
                            <span>Nrs {totalPartsCost.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Parts Cost</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Nrs {totalPartsCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Labor Cost</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">Nrs {record.laborCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {record.discount > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Discount</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">-Nrs {record.discount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Final Amount</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="font-bold text-blue-600">Nrs {finalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {record.hasCoupon && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">
                          {record.couponType}
                        </Badge>
                        <span className="text-sm text-green-700">Applied</span>
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">Service Notes</p>
                      </div>
                      <p className="text-sm text-gray-600 pl-6">{record.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ServiceHistory;
