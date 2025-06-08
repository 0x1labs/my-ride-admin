
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Calendar, Car, Bike, Clock, CheckCircle, User } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";
import { useCallRecords, useUpdateCallRecord } from "@/hooks/useCallRecords";

interface CustomerCallDashboardProps {
  vehicles: Vehicle[];
}

const CustomerCallDashboard = ({ vehicles }: CustomerCallDashboardProps) => {
  const { data: callRecords = [], isLoading } = useCallRecords();
  const updateCallRecord = useUpdateCallRecord();
  const [expandedNotes, setExpandedNotes] = useState<string>("");
  const [noteText, setNoteText] = useState<string>("");

  // Get vehicles that need service calls (due within 7 days or overdue)
  const getVehiclesNeedingCalls = () => {
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return vehicles.filter(vehicle => {
      const nextServiceDate = new Date(vehicle.nextService);
      return vehicle.status === "overdue" || 
             (vehicle.status === "upcoming" && nextServiceDate <= sevenDaysFromNow);
    }).sort((a, b) => {
      // Sort by priority: overdue first, then by next service date
      if (a.status === "overdue" && b.status !== "overdue") return -1;
      if (b.status === "overdue" && a.status !== "overdue") return 1;
      return new Date(a.nextService).getTime() - new Date(b.nextService).getTime();
    });
  };

  const vehiclesNeedingCalls = getVehiclesNeedingCalls();

  const getCallRecord = (vehicleId: string) => {
    return callRecords.find(record => record.vehicleId === vehicleId);
  };

  const updateCallStatus = (vehicleId: string, called: boolean, notes?: string) => {
    updateCallRecord.mutate({ 
      vehicleId, 
      called, 
      notes: notes || noteText || undefined 
    });
    setNoteText("");
    setExpandedNotes("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilService = (nextServiceDate: string) => {
    const today = new Date();
    const serviceDate = new Date(nextServiceDate);
    const diffTime = serviceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyBadge = (vehicle: Vehicle) => {
    if (vehicle.status === "overdue") {
      const daysOverdue = Math.abs(getDaysUntilService(vehicle.nextService));
      return <Badge className="bg-red-100 text-red-800">Overdue ({daysOverdue} days)</Badge>;
    }
    
    const days = getDaysUntilService(vehicle.nextService);
    if (days <= 2) {
      return <Badge className="bg-orange-100 text-orange-800">Urgent ({days} days)</Badge>;
    } else if (days <= 7) {
      return <Badge className="bg-yellow-100 text-yellow-800">Soon ({days} days)</Badge>;
    }
    
    return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
  };

  const calledVehicles = vehiclesNeedingCalls.filter(vehicle => {
    const callRecord = getCallRecord(vehicle.id);
    return callRecord?.called;
  });

  const pendingVehicles = vehiclesNeedingCalls.filter(vehicle => {
    const callRecord = getCallRecord(vehicle.id);
    return !callRecord?.called;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Call Dashboard</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading call records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Call Dashboard</h2>
          <p className="text-gray-600">Track customer calls for upcoming and overdue services</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls Needed</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehiclesNeedingCalls.length}</div>
            <p className="text-xs text-muted-foreground">Customers to contact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{calledVehicles.length}</div>
            <p className="text-xs text-muted-foreground">Successfully contacted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingVehicles.length}</div>
            <p className="text-xs text-muted-foreground">Still need to call</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Rate</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {vehiclesNeedingCalls.length > 0 
                ? Math.round((calledVehicles.length / vehiclesNeedingCalls.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Call List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers to Call</CardTitle>
          <CardDescription>
            Vehicles with services due within 7 days or overdue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vehiclesNeedingCalls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No customers need to be called right now!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vehiclesNeedingCalls.map((vehicle) => {
                const callRecord = getCallRecord(vehicle.id);
                const isCalled = callRecord?.called || false;
                const isExpanded = expandedNotes === vehicle.id;
                
                return (
                  <div key={vehicle.id} className={`border rounded-lg p-4 ${isCalled ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={isCalled}
                          onCheckedChange={(checked) => updateCallStatus(vehicle.id, checked === true)}
                          className="h-5 w-5"
                          disabled={updateCallRecord.isPending}
                        />
                        
                        <div className="flex items-center gap-2">
                          {vehicle.type === "car" ? 
                            <Car className="h-4 w-4 text-blue-600" /> : 
                            <Bike className="h-4 w-4 text-green-600" />
                          }
                          <span className="font-medium">{vehicle.make} {vehicle.model}</span>
                          <span className="text-sm text-gray-500">({vehicle.year})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getUrgencyBadge(vehicle)}
                        {isCalled && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Called
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 ml-9 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Owner:</span>
                          <p className="text-gray-900">{vehicle.owner}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Phone:</span>
                          <p className="text-gray-900">{vehicle.phone}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">VIN:</span>
                          <p className="text-gray-900">{vehicle.id}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">Next Service:</span>
                          <span className="font-medium">{formatDate(vehicle.nextService)}</span>
                        </div>
                        {callRecord?.callDate && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            <span>Called on {formatDate(callRecord.callDate)}</span>
                          </div>
                        )}
                      </div>

                      {/* Notes Section */}
                      {!isCalled && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedNotes(isExpanded ? "" : vehicle.id)}
                          >
                            {isExpanded ? "Cancel" : "Add Notes"}
                          </Button>
                          
                          {isExpanded && (
                            <div className="mt-2 space-y-2">
                              <Textarea
                                placeholder="Add notes about the call..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                rows={2}
                              />
                              <Button
                                size="sm"
                                onClick={() => updateCallStatus(vehicle.id, true, noteText)}
                                disabled={updateCallRecord.isPending}
                              >
                                Mark as Called & Save Notes
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Display existing notes */}
                      {callRecord?.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium text-gray-700">Notes: </span>
                          <span className="text-gray-600">{callRecord.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCallDashboard;
