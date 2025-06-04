import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, DollarSign, Wrench, Calendar } from "lucide-react";
import { Vehicle } from "@/services/vehicleService";

interface AnalyticsDashboardProps {
  vehicles: Vehicle[];
}

const AnalyticsDashboard = ({ vehicles }: AnalyticsDashboardProps) => {
  // Mock analytics data
  const monthlyRevenue = [
    { month: "Jan", revenue: 8400, services: 24 },
    { month: "Feb", revenue: 9200, services: 28 },
    { month: "Mar", revenue: 11600, services: 32 },
    { month: "Apr", revenue: 10800, services: 30 },
    { month: "May", revenue: 12450, services: 35 },
    { month: "Jun", revenue: 13200, services: 38 }
  ];

  const serviceTypes = [
    { name: "Regular Maintenance", value: 45, color: "#3B82F6" },
    { name: "Brake Service", value: 25, color: "#10B981" },
    { name: "Oil Change", value: 20, color: "#F59E0B" },
    { name: "Tire Service", value: 10, color: "#EF4444" }
  ];

  const vehicleTypes = [
    { name: "Cars", value: vehicles.filter(v => v.type === "car").length, color: "#3B82F6" },
    { name: "Bikes", value: vehicles.filter(v => v.type === "bike").length, color: "#10B981" }
  ];

  const dailyServices = [
    { day: "Mon", services: 5 },
    { day: "Tue", services: 8 },
    { day: "Wed", services: 6 },
    { day: "Thu", services: 9 },
    { day: "Fri", services: 12 },
    { day: "Sat", services: 15 },
    { day: "Sun", services: 4 }
  ];

  const metrics = [
    {
      title: "Average Service Value",
      value: "$285",
      change: "+12%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Services This Month",
      value: "38",
      change: "+8%",
      icon: Wrench,
      color: "text-blue-600"
    },
    {
      title: "Customer Retention",
      value: "92%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Avg. Service Time",
      value: "2.5h",
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
              <BarChart data={monthlyRevenue}>
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
                  data={serviceTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {serviceTypes.map((entry, index) => (
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
              <LineChart data={dailyServices}>
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
