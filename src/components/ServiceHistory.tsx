import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Calendar, DollarSign, FileText, Car, Bike } from "lucide-react";

interface Vehicle {
  id: string;
  type: "car" | "bike";
  make: string;
  model: string;
  owner: string;
}

interface Part {
  name: string;
  cost: number;
}

interface ServiceHistoryProps {
  selectedVehicle?: Vehicle | null;
  vehicles: Vehicle[];
}

const ServiceHistory = ({ selectedVehicle, vehicles }: ServiceHistoryProps) => {
  const [currentVehicle, setCurrentVehicle] = useState(selectedVehicle?.id || "all");

  // Mock service data with individual part costs
  const serviceRecords = [
    {
      id: "SRV001",
      vehicleId: "VIN001",
      date: "2024-05-15",
      type: "Regular Maintenance",
      parts: [
        { name: "Engine Oil", cost: 35.00 },
        { name: "Oil Filter", cost: 15.00 },
        { name: "Air Filter", cost: 25.00 }
      ],
      laborCost: 45.00,
      discount: 10.00,
      technician: "Mike Wilson",
      notes: "Routine maintenance completed. Next service due in 6 months.",
      hasCoupon: true,
      couponType: "Annual Maintenance Contract"
    },
    {
      id: "SRV002",
      vehicleId: "VIN001",
      date: "2024-02-20",
      type: "Brake Service",
      parts: [
        { name: "Brake Pads", cost: 85.00 },
        { name: "Brake Fluid", cost: 20.00 }
      ],
      laborCost: 145.00,
      discount: 0.00,
      technician: "Sarah Johnson",
      notes: "Replaced worn brake pads. Brake system functioning properly.",
      hasCoupon: false,
      couponType: null
    },
    {
      id: "SRV003",
      vehicleId: "VIN002",
      date: "2024-04-20",
      type: "Chain Maintenance",
      parts: [
        { name: "Chain", cost: 45.00 },
        { name: "Chain Oil", cost: 12.00 },
        { name: "Sprockets", cost: 28.00 }
      ],
      laborCost: 40.00,
      discount: 5.00,
      technician: "Tom Brown",
      notes: "Chain and sprockets replaced. Lubrication service completed.",
      hasCoupon: true,
      couponType: "Loyalty Discount"
    }
  ];

  const filteredRecords = currentVehicle !== "all"
    ? serviceRecords.filter(record => record.vehicleId === currentVehicle)
    : serviceRecords;

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
                  {vehicle.type === "car" ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                  {vehicle.make} {vehicle.model} - {vehicle.owner}
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
              {selectedVehicleData.type === "car" ? 
                <Car className="h-5 w-5 text-blue-600" /> : 
                <Bike className="h-5 w-5 text-green-600" />
              }
              <CardTitle>{selectedVehicleData.make} {selectedVehicleData.model}</CardTitle>
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentVehicle === "all" && vehicle && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {vehicle.type === "car" ? <Car className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                      <span>{vehicle.make} {vehicle.model} - {vehicle.owner}</span>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Parts & Services</h4>
                    <div className="space-y-2">
                      {record.parts.map((part, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <Badge variant="secondary">{part.name}</Badge>
                          <span className="text-sm font-medium">${part.cost.toFixed(2)}</span>
                        </div>
                      ))}
                      {record.parts.length > 0 && (
                        <div className="border-t pt-2">
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
                      <p className="text-sm text-gray-600">Parts Cost</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">${totalPartsCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Labor Cost</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">${record.laborCost.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {record.discount > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Discount</p>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">-${record.discount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Final Amount</p>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="font-bold text-blue-600">${finalCost.toFixed(2)}</span>
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
