
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Bike, AlertTriangle, CheckCircle, DollarSign, Calendar, Clock, Wrench } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";

interface ImprovedDashboardStatsProps {
  vehicles: Vehicle[];
}

const ImprovedDashboardStats = ({ vehicles }: ImprovedDashboardStatsProps) => {
  const totalVehicles = vehicles.length;
  const totalCars = vehicles.filter(v => v.type === "car").length;
  const totalBikes = vehicles.filter(v => v.type === "bike").length;
  const overdueServices = vehicles.filter(v => v.status === "overdue").length;
  const activeServices = vehicles.filter(v => v.status === "active").length;
  const upcomingServices = vehicles.filter(v => v.status === "upcoming").length;

  // Get recently serviced vehicles (last 30 days)
  const recentlyServiced = vehicles
    .filter(vehicle => {
      const lastServiceDate = new Date(vehicle.lastService);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return lastServiceDate >= thirtyDaysAgo;
    })
    .sort((a, b) => new Date(b.lastService).getTime() - new Date(a.lastService).getTime())
    .slice(0, 5);

  // Get vehicles due for service soon (next 30 days)
  const upcomingServiceVehicles = vehicles
    .filter(vehicle => {
      const nextServiceDate = new Date(vehicle.nextService);
      const today = new Date();
      const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      return nextServiceDate >= today && nextServiceDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.nextService).getTime() - new Date(b.nextService).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = [
    {
      title: "Total Vehicles",
      value: totalVehicles,
      description: `${totalCars} cars, ${totalBikes} bikes`,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Services",
      value: activeServices,
      description: "Up to date vehicles",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Overdue Services",
      value: overdueServices,
      description: "Requires immediate attention",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Upcoming Services",
      value: upcomingServices,
      description: "Due within 30 days",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Monthly Revenue",
      value: "NPR 12,450",
      description: "+15% from last month",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <CardDescription className="text-xs text-gray-500">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recently Serviced */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-green-600" />
              Recently Serviced
            </CardTitle>
            <CardDescription>
              Vehicles serviced in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentlyServiced.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No recent services</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentlyServiced.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div className="flex items-center gap-2">
                      {vehicle.type === "car" ? 
                        <Car className="h-4 w-4 text-blue-600" /> : 
                        <Bike className="h-4 w-4 text-green-600" />
                      }
                      <div>
                        <p className="font-medium text-sm">{vehicle.make} {vehicle.model}</p>
                        <p className="text-xs text-gray-500">{vehicle.owner}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(vehicle.lastService)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Service Schedule
            </CardTitle>
            <CardDescription>
              Vehicles due for service in the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingServiceVehicles.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No upcoming services</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingServiceVehicles.map((vehicle) => {
                  const daysUntil = getDaysUntil(vehicle.nextService);
                  const isOverdue = daysUntil < 0;
                  const isUrgent = daysUntil <= 7;
                  
                  return (
                    <div key={vehicle.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                      <div className="flex items-center gap-2">
                        {vehicle.type === "car" ? 
                          <Car className="h-4 w-4 text-blue-600" /> : 
                          <Bike className="h-4 w-4 text-green-600" />
                        }
                        <div>
                          <p className="font-medium text-sm">{vehicle.make} {vehicle.model}</p>
                          <p className="text-xs text-gray-500">{vehicle.owner}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={`text-xs ${
                            isOverdue 
                              ? "bg-red-100 text-red-800" 
                              : isUrgent 
                                ? "bg-orange-100 text-orange-800" 
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isOverdue 
                            ? `${Math.abs(daysUntil)} days overdue`
                            : daysUntil === 0 
                              ? "Due today"
                              : `${daysUntil} days`
                          }
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(vehicle.nextService)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImprovedDashboardStats;
