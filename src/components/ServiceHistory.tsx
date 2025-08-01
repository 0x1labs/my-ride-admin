import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Calendar, DollarSign, FileText, Bike } from "lucide-react";
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
        <h2 className="text-2xl font-bold text-white">Service History</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ktm-orange-dim"></div>
          <span className="ml-2 text-ktm-light-gray">Loading service records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Service History</h2>
        <Select value={currentVehicle} onValueChange={setCurrentVehicle}>
          <SelectTrigger className="w-80 bg-ktm-dark-gray border-ktm-orange-dim text-white">
            <SelectValue placeholder="Select a motorbike" />
          </SelectTrigger>
          <SelectContent className="bg-ktm-dark-gray border-ktm-orange-dim text-white">
            <SelectItem value="all">All Motorbikes</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                <div className="flex items-center gap-2">
                  <Bike className="h-4 w-4 text-ktm-orange" />
                  {vehicle.make} {vehicle.model} - {vehicle.owner}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedVehicleData && (
        <Card className="bg-ktm-dark-gray border-ktm-orange-dim">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bike className="h-5 w-5 text-ktm-orange" />
              <CardTitle className="text-ktm-orange">{selectedVehicleData.make} {selectedVehicleData.model}</CardTitle>
            </div>
            <CardDescription className="text-ktm-light-gray">Rider: {selectedVehicleData.owner} | VIN: {selectedVehicleData.id}</CardDescription>
          </CardHeader>
        </Card>
      )}

      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card className="bg-ktm-dark-gray border-ktm-orange-dim">
            <CardContent className="text-center py-12">
              <Wrench className="h-12 w-12 text-ktm-orange mx-auto mb-4" />
              <p className="text-ktm-light-gray">No service records found</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => {
            const vehicle = vehicles.find(v => v.id === record.vehicleId);
            const totalPartsCost = calculateTotalPartsCost(record.parts);
            const finalCost = calculateFinalCost(record.parts, record.laborCost, record.discount);
            
            return (
              <Card key={record.id} className="bg-ktm-dark-gray border-ktm-orange-dim text-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-ktm-orange">{record.type}</CardTitle>
                      <CardDescription className="text-ktm-light-gray">Service ID: {record.id}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-ktm-light-gray">
                        <Calendar className="h-4 w-4" />
                        {formatDate(record.date)}
                      </div>
                      <p className="text-sm text-ktm-light-gray">by {record.technician}</p>
                      {record.serviceCenterName && (
                        <p className="text-xs text-ktm-orange font-medium">{record.serviceCenterName}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentVehicle === "all" && vehicle && (
                    <div className="flex items-center gap-2 text-sm text-ktm-light-gray">
                      <Bike className="h-4 w-4 text-ktm-orange" />
                      <span>{vehicle.make} {vehicle.model} - {vehicle.owner}</span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-white mb-2">Parts & Services</h4>
                    <div className="space-y-2">
                      {record.parts.map((part, index) => (
                        <div key={index} className="flex items-center justify-between bg-ktm-black p-2 rounded">
                          <Badge variant="secondary" className="bg-ktm-orange text-white">{part.name}</Badge>
                          <span className="text-sm font-medium">${part.cost.toFixed(2)}</span>
                        </div>
                      ))}
                      {record.parts.length > 0 && (
                        <div className="border-t pt-2 border-ktm-orange-dim">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Total Parts Cost:</span>
                            <span>${totalPartsCost.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-ktm-light-gray">Parts Cost</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-ktm-orange" />
                        <span className="font-medium">${totalPartsCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-ktm-light-gray">Labor Cost</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-ktm-orange" />
                        <span className="font-medium">${record.laborCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {record.discount > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-ktm-light-gray">Discount</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-green-500">-${record.discount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <p className="text-sm text-ktm-light-gray">Final Amount</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-ktm-orange" />
                        <span className="font-bold text-ktm-orange">NPR ${finalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {record.hasCoupon && (
                    <div className="bg-green-900 border border-green-500 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500 text-white">
                          {record.couponType}
                        </Badge>
                        <span className="text-sm text-green-200">Applied</span>
                      </div>
                    </div>
                  )}

                  {record.notes && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-ktm-orange" />
                        <p className="text-sm font-medium text-white">Service Notes</p>
                      </div>
                      <p className="text-sm text-ktm-light-gray pl-6">{record.notes}</p>
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