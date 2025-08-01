import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Wrench, Users, UserCheck } from "lucide-react";
import { Vehicle, ServiceRecord } from "@/services/supabaseService";

interface AnalyticsDashboardProps {
  vehicles: Vehicle[];
  serviceRecords: ServiceRecord[];
}

const COLORS = ["#FF6600", "#333333", "#E6E6E6", "#FF9933", "#666666", "#CCCCCC"];

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
    { name: "Cars", value: vehicles.filter(v => v.type === "car").length, color: "#3B82F6" },
    { name: "Bikes", value: vehicles.filter(v => v.type === "bike").length, color: "#FF6600" }
  ], [vehicles]);

  const metricsCards = [
    {
      title: "Average Service Value",
      value: `$${analyticsData.metrics.averageServiceValue}`,
      description: "from all services",
      icon: DollarSign,
      color: "text-ktm-orange"
    },
    {
      title: "Services This Month",
      value: analyticsData.metrics.monthlyServices.toString(),
      description: "in current month",
      icon: Wrench,
      color: "text-ktm-orange"
    },
    {
      title: "Repeat Business",
      value: `${analyticsData.metrics.repeatBusinessRate}%`,
      description: "of serviced motorbikes",
      icon: TrendingUp,
      color: "text-ktm-orange"
    },
    {
      title: "Total Motorbikes",
      value: vehicles.length,
      description: `${vehicleTypes[1].value} bikes`,
      icon: Users,
      color: "text-ktm-orange"
    }
  ];

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-2xl font-bold text-ktm-orange">Analytics Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric, index) => (
          <Card key={index} className="bg-ktm-dark-gray border-ktm-orange-dim">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-ktm-light-gray">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-ktm-light-gray">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue & Services Chart */}
        <Card className="bg-ktm-dark-gray border-ktm-orange-dim">
          <CardHeader>
            <CardTitle>Monthly Revenue & Services</CardTitle>
            <CardDescription className="text-ktm-light-gray">Over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="month" stroke="#E6E6E6" />
                <YAxis yAxisId="left" orientation="left" stroke="#FF6600" />
                <YAxis yAxisId="right" orientation="right" stroke="#FF9933" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'Revenue' ? `NPR ${Intl.NumberFormat('en-US').format(value as number)}` : value,
                    name
                  ]}
                  contentStyle={{ backgroundColor: '#333333', border: '1px solid #FF6600' }}
                />
                <Bar yAxisId="left" dataKey="revenue" fill="#FF6600" name="Revenue" />
                <Bar yAxisId="right" dataKey="services" fill="#FF9933" name="Services" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Types Distribution */}
        <Card className="bg-ktm-dark-gray border-ktm-orange-dim">
          <CardHeader>
            <CardTitle>Service Types Distribution</CardTitle>
            <CardDescription className="text-ktm-light-gray">Breakdown of all recorded service types</CardDescription>
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
                  stroke="#333333"
                >
                  {analyticsData.serviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#333333', border: '1px solid #FF6600' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Motorbike Types */}
        <Card className="bg-ktm-dark-gray border-ktm-orange-dim">
          <CardHeader>
            <CardTitle>Motorbike Types</CardTitle>
            <CardDescription className="text-ktm-light-gray">Distribution of motorbikes in the system</CardDescription>
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
                  stroke="#333333"
                >
                  {vehicleTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#333333', border: '1px solid #FF6600' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Services Trend */}
        <Card className="bg-ktm-dark-gray border-ktm-orange-dim">
          <CardHeader>
            <CardTitle>Weekly Service Trend</CardTitle>
            <CardDescription className="text-ktm-light-gray">Number of services per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.dailyServices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                <XAxis dataKey="day" stroke="#E6E6E6" />
                <YAxis allowDecimals={false} stroke="#E6E6E6" />
                <Tooltip contentStyle={{ backgroundColor: '#333333', border: '1px solid #FF6600' }} />
                <Line 
                  type="monotone" 
                  dataKey="services" 
                  stroke="#FF6600" 
                  strokeWidth={2}
                  dot={{ fill: '#FF6600' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="bg-ktm-dark-gray border-ktm-orange-dim">
          <CardHeader>
            <CardTitle className="text-ktm-orange flex items-center gap-2">
              <UserCheck /> Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white font-semibold text-lg">
              {analyticsData.topPerformer.name}
            </p>
             <p className="text-ktm-light-gray">
              Completed {analyticsData.topPerformer.services} services in total.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;