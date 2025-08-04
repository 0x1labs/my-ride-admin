
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Bike, AlertTriangle, CheckCircle, DollarSign, Calendar, Clock, Wrench, PieChart } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ImprovedDashboardStatsProps {
  vehicles: Vehicle[];
}

const ImprovedDashboardStats = ({ vehicles }: ImprovedDashboardStatsProps) => {
  const totalVehicles = vehicles.length;
  
  const totalBikes = vehicles.filter(v => v.type === "bike").length;
  const overdueServices = vehicles.filter(v => v.status === "overdue").length;
  const activeServices = vehicles.filter(v => v.status === "active").length;
  const upcomingServices = vehicles.filter(v => v.status === "upcoming").length;

  // Get bike types data for chart - extract actual model names
  const bikeTypeMap = vehicles.reduce((acc, vehicle) => {
    // Extract bike model name, prioritize specific models
    let bikeType = vehicle.bikeModel;
    
    // Handle specific model extraction
    if (vehicle.bikeModel.toLowerCase().includes('duke')) {
      bikeType = 'Duke';
    } else if (vehicle.bikeModel.toLowerCase().includes('adventure')) {
      bikeType = 'Adventure';
    } else if (vehicle.bikeModel.toLowerCase().includes('ninja')) {
      bikeType = 'Ninja';
    } else if (vehicle.bikeModel.toLowerCase().includes('royal enfield')) {
      bikeType = 'Royal Enfield';
    } else {
      // For other bikes, try to extract the main model name (first part before space or dash)
      const modelParts = vehicle.bikeModel.split(/[\s-]/);
      bikeType = modelParts[0] || vehicle.bikeModel;
    }
    
    acc[bikeType] = (acc[bikeType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bikeTypesData = Object.entries(bikeTypeMap).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'];

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
      title: "Total Bikes",
      value: totalVehicles,
      description: `${totalBikes} bikes`,
      icon: Bike,
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
      value: "$12,450",
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

      {/* Bike Types Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            Bike Types Distribution
          </CardTitle>
          <CardDescription>
            Distribution of different bike types in your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={bikeTypesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {bikeTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
                      <Bike className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="font-medium text-sm">{vehicle.bikeModel}</p>
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
                        <Bike className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="font-medium text-sm">{vehicle.bikeModel}</p>
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
