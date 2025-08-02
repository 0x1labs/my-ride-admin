
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Wrench, Users, UserCheck } from "lucide-react";
import { Vehicle, ServiceRecord } from "@/services/supabaseService";

interface AnalyticsDashboardProps {
  vehicles: Vehicle[];
  serviceRecords: ServiceRecord[];
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6366F1"];

const AnalyticsDashboard = ({ vehicles, serviceRecords }: AnalyticsDashboardProps) => {

  const analyticsData = useMemo(() => {
    if (!vehicles.length || !serviceRecords.length) {
      return {
        metrics: {
          averageServiceValue: 0,
          monthlyServices: 0,
          repeatBusinessRate: 0,
        },
        monthlyRevenue: Array(6).fill({ month: 'N/A', revenue: 0, services: 0 }),
        serviceTypes: [],
        dailyServices: Array(7).fill({ day: 'N/A', services: 0 }),
        topPerformer: { name: 'N/A', services: 0 },
      };
    }

    // Metrics
    const totalRevenue = serviceRecords.reduce((acc, record) => {
      const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
      return acc + record.laborCost + partsCost - record.discount;
    }, 0);
    const totalServices = serviceRecords.length;
    const averageServiceValue = totalServices > 0 ? totalRevenue / totalServices : 0;

    const now = new Date();
    const currentMonthServices = serviceRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getFullYear() === now.getFullYear() && recordDate.getMonth() === now.getMonth();
    }).length;

    const serviceCountsByVehicle = serviceRecords.reduce((acc, record) => {
      acc[record.vehicleId] = (acc[record.vehicleId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const servicedVehiclesCount = Object.keys(serviceCountsByVehicle).length;
    const repeatVehiclesCount = Object.values(serviceCountsByVehicle).filter(count => count > 1).length;
    const repeatBusinessRate = servicedVehiclesCount > 0 ? (repeatVehiclesCount / servicedVehiclesCount) * 100 : 0;

    // Monthly Revenue (last 6 months)
    const monthlyRevenueData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      const monthRecords = serviceRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.getFullYear() === year && recordDate.getMonth() === date.getMonth();
      });

      const revenue = monthRecords.reduce((acc, record) => {
        const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
        return acc + record.laborCost + partsCost - record.discount;
      }, 0);

      monthlyRevenueData.push({ month: `${month} ${year.toString().slice(-2)}`, revenue, services: monthRecords.length });
    }

    // Service Types
    const serviceTypesCount = serviceRecords.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const serviceTypesData = Object.entries(serviceTypesCount).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    })).sort((a,b) => b.value - a.value);

    // Daily Services (last 7 days)
    const dailyServicesData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = dayNames[date.getDay()];
      
      const dayRecords = serviceRecords.filter(r => new Date(r.date).toDateString() === date.toDateString()).length;
      dailyServicesData.push({ day, services: dayRecords });
    }
    
    // Top Performer
    const technicianCounts = serviceRecords.reduce((acc, record) => {
        if (record.technician) {
            acc[record.technician] = (acc[record.technician] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const topPerformerData = Object.entries(technicianCounts).reduce(
      (top, [name, services]) => (services > top.services ? { name, services } : top),
      { name: 'N/A', services: 0 }
    );

    return {
      metrics: {
        averageServiceValue: Math.round(averageServiceValue),
        monthlyServices: currentMonthServices,
        repeatBusinessRate: Math.round(repeatBusinessRate),
      },
      monthlyRevenue: monthlyRevenueData,
      serviceTypes: serviceTypesData,
      dailyServices: dailyServicesData,
      topPerformer: topPerformerData,
    };
  }, [vehicles, serviceRecords]);

  const vehicleTypes = useMemo(() => [
    { name: "Bikes", value: vehicles.filter(v => v.type === "bike").length, color: "#10B981" }
  ], [vehicles]);

  const metricsCards = [
    {
      title: "Average Service Value",
      value: `$${analyticsData.metrics.averageServiceValue}`,
      description: "from all services",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Services This Month",
      value: analyticsData.metrics.monthlyServices.toString(),
      description: "in current month",
      icon: Wrench,
      color: "text-blue-600"
    },
    {
      title: "Repeat Business",
      value: `${analyticsData.metrics.repeatBusinessRate}%`,
      description: "of serviced vehicles",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Total Bikes",
      value: vehicles.length,
      description: `${vehicleTypes[0].value} bikes`,
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric, index) => (
          <Card key={index} className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue & Services Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Monthly Revenue & Services</CardTitle>
            <CardDescription>Over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'Revenue' ? `$${Intl.NumberFormat('en-US').format(value as number)}` : value,
                    name
                  ]}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#3B82F6" name="Revenue" />
                <Bar yAxisId="right" dataKey="services" fill="#10B981" name="Services" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Types Distribution */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Service Types Distribution</CardTitle>
            <CardDescription>Breakdown of all recorded service types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.serviceTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analyticsData.serviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Types */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Bike Types</CardTitle>
            <CardDescription>Distribution of bikes in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {vehicleTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Services Trend */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Weekly Service Trend</CardTitle>
            <CardDescription>Number of services per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.dailyServices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="services" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <UserCheck /> Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 font-semibold text-lg">
              {analyticsData.topPerformer.name}
            </p>
             <p className="text-green-600">
              Completed {analyticsData.topPerformer.services} services in total.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
