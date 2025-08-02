
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Phone, PhoneCall, MessageSquare, Calendar, Users, AlertCircle } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";
import { useCallRecords, useUpdateCallRecord } from "@/hooks/useCallRecords";
import { useToast } from "@/hooks/use-toast";

interface CustomerCallDashboardProps {
  vehicles: Vehicle[];
}

const CustomerCallDashboard = ({ vehicles }: CustomerCallDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("nextService");
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [showNotesFor, setShowNotesFor] = useState<{ [key: string]: boolean }>({});
  
  const { toast } = useToast();
  const { data: callRecords = [] } = useCallRecords();
  const updateCallRecord = useUpdateCallRecord();

  // Memoized filtered vehicles and stats calculations
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = !searchTerm || 
        vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.bikeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.phone.includes(searchTerm);

      const callRecord = callRecords.find(record => record.vehicleId === vehicle.id);
      const isCalled = callRecord?.called || false;

      const matchesFilter = filterStatus === "all" || 
        (filterStatus === "called" && isCalled) ||
        (filterStatus === "not-called" && !isCalled) ||
        (filterStatus === "overdue" && vehicle.status === "overdue") ||
        (filterStatus === "upcoming" && vehicle.status === "upcoming");

      return matchesSearch && matchesFilter;
    });

    // Sort vehicles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "nextService":
          return new Date(a.nextService).getTime() - new Date(b.nextService).getTime();
        case "lastService":
          return new Date(b.lastService).getTime() - new Date(a.lastService).getTime();
        case "owner":
          return a.owner.localeCompare(b.owner);
        case "priority":
          const priorityOrder = { overdue: 0, upcoming: 1, active: 2 };
          return priorityOrder[a.status as keyof typeof priorityOrder] - priorityOrder[b.status as keyof typeof priorityOrder];
        default:
          return 0;
      }
    });

    return filtered;
  }, [vehicles, callRecords, searchTerm, filterStatus, sortBy]);

  const stats = useMemo(() => {
    const totalVehicles = vehicles.length;
    const calledCount = callRecords.filter(record => record.called).length;
    const overdueCount = vehicles.filter(v => v.status === "overdue").length;
    const upcomingCount = vehicles.filter(v => v.status === "upcoming").length;
    
    const pendingCallVehicles = vehicles.filter(v => 
      (v.status === 'overdue' || v.status === 'upcoming') &&
      !callRecords.some(record => record.vehicleId === v.id && record.called)
    );
    const notCalledCount = pendingCallVehicles.length;

    return {
      totalVehicles,
      calledCount,
      notCalledCount,
      overdueCount,
      upcomingCount,
      callRate: totalVehicles > 0 ? Math.round((calledCount / totalVehicles) * 100) : 0
    };
  }, [vehicles, callRecords]);

  const updateCallStatus = async (vehicleId: string, called: boolean) => {
    try {
      console.log('Updating call status:', { vehicleId, called });
      
      await updateCallRecord.mutateAsync({
        vehicleId,
        called,
        notes: notes[vehicleId] || undefined
      });

      toast({
        title: called ? "Call Marked as Completed" : "Call Status Updated",
        description: `${vehicles.find(v => v.id === vehicleId)?.owner || 'Customer'} call status updated successfully.`,
      });

      // Clear notes after successful update
      if (called && notes[vehicleId]) {
        setNotes(prev => ({ ...prev, [vehicleId]: "" }));
        setShowNotesFor(prev => ({ ...prev, [vehicleId]: false }));
      }
    } catch (error) {
      console.error('Error updating call record:', error);
      toast({
        title: "Error",
        description: "Failed to update call status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateNotes = (vehicleId: string, noteText: string) => {
    setNotes(prev => ({ ...prev, [vehicleId]: noteText }));
  };

  const toggleNotesSection = (vehicleId: string) => {
    setShowNotesFor(prev => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
    // Initialize notes if not already present
    if (!notes[vehicleId]) {
      setNotes(prev => ({ ...prev, [vehicleId]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Customer Call Dashboard</h2>
        <p className="text-gray-600">Track and manage customer service calls</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Made</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.calledCount}</div>
            <p className="text-xs text-muted-foreground">{stats.callRate}% call rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.notCalledCount}</div>
            <p className="text-xs text-muted-foreground">Need to contact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Services</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueCount}</div>
            <p className="text-xs text-muted-foreground">Urgent calls needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter and Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="called">Already Called</SelectItem>
                <SelectItem value="not-called">Not Called</SelectItem>
                <SelectItem value="overdue">Overdue Services</SelectItem>
                <SelectItem value="upcoming">Upcoming Services</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nextService">Next Service Date</SelectItem>
                <SelectItem value="lastService">Last Service Date</SelectItem>
                <SelectItem value="owner">Customer Name</SelectItem>
                <SelectItem value="priority">Priority (Overdue First)</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredVehicles.length} of {stats.totalVehicles} customers
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <div className="grid gap-4">
        {filteredVehicles.map((vehicle) => {
          const callRecord = callRecords.find(record => record.vehicleId === vehicle.id);
          const isCalled = callRecord?.called || false;
          const existingNotes = callRecord?.notes || "";
          const showNotes = showNotesFor[vehicle.id] || false;
          
          return (
            <Card key={vehicle.id} className={`${vehicle.status === 'overdue' ? 'border-red-200 bg-red-50' : vehicle.status === 'upcoming' ? 'border-yellow-200 bg-yellow-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={isCalled}
                          onCheckedChange={(checked) => {
                            console.log('Checkbox clicked:', { vehicleId: vehicle.id, checked });
                            updateCallStatus(vehicle.id, Boolean(checked));
                          }}
                          className="h-5 w-5"
                          disabled={updateCallRecord.isPending}
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{vehicle.owner}</h3>
                          <p className="text-gray-600">{vehicle.phone}</p>
                        </div>
                      </div>
                      
                      <Badge variant={vehicle.status === 'overdue' ? 'destructive' : vehicle.status === 'upcoming' ? 'secondary' : 'default'}>
                        {vehicle.status === 'overdue' ? 'OVERDUE' : vehicle.status === 'upcoming' ? 'UPCOMING' : 'ACTIVE'}
                      </Badge>
                      
                      {isCalled && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          ✓ Called
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Bike</p>
                        <p className="font-medium">{vehicle.bikeModel} ({vehicle.year})</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Service</p>
                        <p className="font-medium">{new Date(vehicle.lastService).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Next Service</p>
                        <p className="font-medium">{new Date(vehicle.nextService).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {existingNotes && (
                      <div className="mb-4">
                        <Label className="text-sm font-medium">Previous Call Notes</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                          <strong>Notes:</strong> {existingNotes}
                          {callRecord?.callDate && (
                            <span className="text-gray-500 ml-2">
                              (Called on {new Date(callRecord.callDate).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {showNotes && (
                      <div className="mb-4">
                        <Label className="text-sm font-medium">Add Call Notes</Label>
                        <Textarea
                          placeholder="Add call notes..."
                          value={notes[vehicle.id] || ""}
                          onChange={(e) => updateNotes(vehicle.id, e.target.value)}
                          className="mt-2"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => updateCallStatus(vehicle.id, true)}
                            disabled={updateCallRecord.isPending}
                          >
                            Save & Mark Called
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleNotesSection(vehicle.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {!showNotes && !isCalled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleNotesSection(vehicle.id)}
                        className="mt-2"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Add Notes
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No customers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerCallDashboard;
