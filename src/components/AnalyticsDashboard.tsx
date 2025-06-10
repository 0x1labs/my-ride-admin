
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Wrench, Calendar } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";

interface AnalyticsDashboardProps {
  vehicles: Vehicle[];
}

const getAnalyticsData = () => {
  return {
    metrics: {
      averageServiceValue: 285,
      monthlyServices: 42,
      customerRetention: 85,
      averageServiceTime: 2.5
    },
    monthlyRevenue: [
      { month: "Jan", revenue: 12400, services: 38 },
      { month: "Feb", revenue: 13200, services: 42 },
      { month: "Mar", revenue: 11800, services: 35 },
      { month: "Apr", revenue: 14500, services: 48 },
      { month: "May", revenue: 13900, services: 45 },
      { month: "Jun", revenue: 15200, services: 52 }
    ],
    serviceTypes: [
      { name: "Oil Change", value: 35, color: "#3B82F6" },
      { name: "Brake Service", value: 25, color: "#10B981" },
      { name: "Tire Replacement", value: 20, color: "#F59E0B" },
      { name: "Engine Tune-up", value: 15, color: "#EF4444" },
      { name: "Other", value: 5, color: "#8B5CF6" }
    ],
    dailyServices: [
      { day: "Mon", services: 8 },
      { day: "Tue", services: 12 },
      { day: "Wed", services: 10 },
      { day: "Thu", services: 15 },
      { day: "Fri", services: 14 },
      { day: "Sat", services: 9 },
      { day: "Sun", services: 4 }
    ]
  };
};

const AnalyticsDashboard = ({ vehicles }: AnalyticsDashboardProps) => {
  // Get analytics data from centralized source
  const analyticsData = getAnalyticsData();

  const vehicleTypes = [
    { name: "Cars", value: vehicles.filter(v => v.type === "car").length, color: "#3B82F6" },
    { name: "Bikes", value: vehicles.filter(v => v.type === "bike").length, color: "#10B981" }
  ];

  const metrics = [
    {
      title: "Average Service Value",
      value: `$${analyticsData.metrics.averageServiceValue}`,
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Services This Month",
      value: analyticsData.metrics.monthlyServices.toString(),
      change: "+8%",
      icon: Wrench,
      color: "text-blue-600"
    },
    {
      title: "Customer Retention",
      value: `${analyticsData.metrics.customerRetention}%`,
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Avg. Service Time",
      value: `${analyticsData.metrics.averageServiceTime}h`,
      change: "-15min",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${metric.color}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue and service count over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${value}` : value,
                    name === 'revenue' ? 'Revenue' : 'Services'
                  ]}
                />
                <Bar dataKey="revenue" fill="#3B82F6" name="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Types Distribution */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Service Types Distribution</CardTitle>
            <CardDescription>Breakdown of service types this month</CardDescription>
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
            <CardTitle>Vehicle Types</CardTitle>
            <CardDescription>Distribution of cars vs bikes in service</CardDescription>
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
                <YAxis />
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
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700">Most services occur between 10 AM - 2 PM on weekdays</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">Mike Wilson completed 15 services this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700">Average rating: 4.8/5 based on 124 reviews</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
