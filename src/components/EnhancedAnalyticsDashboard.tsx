import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Wrench,
  Users,
  UserCheck,
  Calendar,
  Filter,
  Download,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Vehicle, ServiceRecord } from "@/services/supabaseService";
import { getCurrencySymbol, getAnalyticsChartColors, ANALYTICS_COLORS } from "@/config";

interface EnhancedAnalyticsDashboardProps {
  vehicles: Vehicle[];
  serviceRecords: ServiceRecord[];
}

const EnhancedAnalyticsDashboard = ({ vehicles, serviceRecords }: EnhancedAnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('all');
  const currencySymbol = getCurrencySymbol();

  // Get unique technicians for filter
  const technicians = useMemo(() => {
    const uniqueTechs = [...new Set(serviceRecords.map(r => r.technician).filter(Boolean))] as string[];
    return uniqueTechs;
  }, [serviceRecords]);

  // Filter records based on time range and technician
  const filteredRecords = useMemo(() => {
    let filtered = [...serviceRecords];

    // Time range filter
    const now = new Date();
    let startDate = new Date();

    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '90d':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    filtered = filtered.filter(record => new Date(record.date) >= startDate);

    // Technician filter
    if (selectedTechnician !== 'all') {
      filtered = filtered.filter(record => record.technician === selectedTechnician);
    }

    return filtered;
  }, [serviceRecords, timeRange, selectedTechnician]);

  const enhancedAnalyticsData = useMemo(() => {
    if (!vehicles.length || !filteredRecords.length) {
      return {
        metrics: {
          averageServiceValue: 0,
          monthlyServices: 0,
          repeatBusinessRate: 0,
          totalRevenue: 0,
          avgMonthlyGrowth: 0
        },
        monthlyRevenue: Array(6).fill({ month: 'N/A', revenue: 0, services: 0 }),
        serviceTypes: [],
        dailyServices: Array(7).fill({ day: 'N/A', services: 0 }),
        topPerformer: { name: 'N/A', services: 0 },
        revenueTrend: [],
        technicianEarnings: [],
        customerLifetimeValue: 0
      };
    }

    // Metrics
    const totalRevenue = filteredRecords.reduce((acc, record) => {
      const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
      return acc + record.laborCost + partsCost - record.discount;
    }, 0);

    const totalServices = filteredRecords.length;
    const averageServiceValue = totalServices > 0 ? totalRevenue / totalServices : 0;

    const now = new Date();
    const currentMonthServices = filteredRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getFullYear() === now.getFullYear() && recordDate.getMonth() === now.getMonth();
    }).length;

    const serviceCountsByVehicle = filteredRecords.reduce((acc, record) => {
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

      const monthRecords = filteredRecords.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.getFullYear() === year && recordDate.getMonth() === date.getMonth();
      });

      const revenue = monthRecords.reduce((acc, record) => {
        const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
        return acc + record.laborCost + partsCost - record.discount;
      }, 0);

      monthlyRevenueData.push({
        month: `${month} ${year.toString().slice(-2)}`,
        revenue,
        services: monthRecords.length
      });
    }

    // Calculate monthly growth rate
    const monthlyRevenues = monthlyRevenueData.map(d => d.revenue);
    let avgMonthlyGrowth = 0;
    if (monthlyRevenues.length > 1) {
      const growthRates = [];
      for (let i = 1; i < monthlyRevenues.length; i++) {
        if (monthlyRevenues[i - 1] > 0) {
          growthRates.push(((monthlyRevenues[i] - monthlyRevenues[i - 1]) / monthlyRevenues[i - 1]) * 100);
        }
      }
      avgMonthlyGrowth = growthRates.length > 0
        ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
        : 0;
    }

    // Service Types
    const serviceTypesCount = filteredRecords.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const serviceTypesData = Object.entries(serviceTypesCount).map(([name, value], index) => ({
      name,
      value,
      color: ANALYTICS_COLORS[index % ANALYTICS_COLORS.length]
    })).sort((a, b) => b.value - a.value);

    // Daily Services (last 7 days)
    const dailyServicesData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const day = dayNames[date.getDay()];

      const dayRecords = filteredRecords.filter(r => new Date(r.date).toDateString() === date.toDateString()).length;
      dailyServicesData.push({ day, services: dayRecords });
    }

    // Top Performer
    const technicianCounts = filteredRecords.reduce((acc, record) => {
      if (record.technician) {
        acc[record.technician] = (acc[record.technician] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topPerformerData = Object.entries(technicianCounts).reduce(
      (top, [name, services]) => (services > top.services ? { name, services } : top),
      { name: 'N/A', services: 0 }
    );

    // Revenue Trend (for line chart)
    const revenueTrendData = monthlyRevenueData.map(item => ({
      name: item.month,
      revenue: item.revenue,
      services: item.services
    }));

    // Technician total earnings
    const technicianEarnings = filteredRecords.reduce((acc, record) => {
      const technician = record.technician || 'Unassigned';
      if (!acc[technician]) {
        acc[technician] = 0;
      }
      const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
      acc[technician] += record.laborCost + partsCost - record.discount;
      return acc;
    }, {} as Record<string, number>);

    const technicianEarningsData = Object.entries(technicianEarnings)
      .map(([technician, totalEarnings]) => ({
        technician,
        totalEarnings: Math.round(totalEarnings)
      }))
      .sort((a, b) => b.totalEarnings - a.totalEarnings);

    // Customer Lifetime Value
    const customerServiceValues = filteredRecords.reduce((acc, record) => {
      const vehicle = vehicles.find(v => v.id === record.vehicleId);
      if (vehicle) {
        const customerId = vehicle.owner; // Using owner name as customer ID
        if (!acc[customerId]) {
          acc[customerId] = 0;
        }
        const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
        acc[customerId] += record.laborCost + partsCost - record.discount;
      }
      return acc;
    }, {} as Record<string, number>);

    const avgCustomerValue = Object.values(customerServiceValues).reduce((sum, value) => sum + value, 0) /
      Object.keys(customerServiceValues).length || 0;

    return {
      metrics: {
        averageServiceValue: Math.round(averageServiceValue),
        monthlyServices: currentMonthServices,
        repeatBusinessRate: Math.round(repeatBusinessRate),
        totalRevenue: Math.round(totalRevenue),
        avgMonthlyGrowth: Math.round(avgMonthlyGrowth * 100) / 100
      },
      monthlyRevenue: monthlyRevenueData,
      serviceTypes: serviceTypesData,
      dailyServices: dailyServicesData,
      topPerformer: topPerformerData,
      revenueTrend: revenueTrendData,
      technicianEarnings: technicianEarningsData,
      customerLifetimeValue: Math.round(avgCustomerValue)
    };
  }, [vehicles, filteredRecords]);

  const vehicleTypes = useMemo(() => [
    { name: "Bikes", value: vehicles.filter(v => v.type === "bike").length, color: "#10B981" }
  ], [vehicles]);

  const metricsCards = [
    {
      title: "Total Revenue",
      value: `${currencySymbol} ${enhancedAnalyticsData.metrics.totalRevenue.toLocaleString()}`,
      description: `${enhancedAnalyticsData.metrics.avgMonthlyGrowth >= 0 ? '+' : ''}${enhancedAnalyticsData.metrics.avgMonthlyGrowth}% monthly growth`,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Avg. Service Value",
      value: `${currencySymbol} ${enhancedAnalyticsData.metrics.averageServiceValue}`,
      description: "per service",
      icon: Wrench,
      color: "text-blue-600"
    },
    {
      title: "Repeat Business",
      value: `${enhancedAnalyticsData.metrics.repeatBusinessRate}%`,
      description: "of serviced vehicles",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Customer Lifetime Value",
      value: `${currencySymbol} ${enhancedAnalyticsData.customerLifetimeValue}`,
      description: "average per customer",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  // Export data function
  const exportData = () => {
    // In a real implementation, this would generate a CSV or PDF report
    alert("Data export functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Enhanced Analytics Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {technicians.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  {technicians.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

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
        {/* Revenue Trend */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Revenue & Service Trend</CardTitle>
            <CardDescription>Monthly performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={enhancedAnalyticsData.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'revenue' ? `${currencySymbol} ${Intl.NumberFormat('en-US').format(value as number)}` : value,
                    name === 'Revenue' || name === 'Services'
                  ]}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke={ANALYTICS_COLORS[0]}
                  fill={ANALYTICS_COLORS[0]}
                  fillOpacity={0.2}
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="services"
                  stroke={ANALYTICS_COLORS[1]}
                  strokeWidth={2}
                  dot={{ fill: ANALYTICS_COLORS[1] }}
                  name="Services"
                />
              </AreaChart>
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
                  data={enhancedAnalyticsData.serviceTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill={ANALYTICS_COLORS[0]}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {enhancedAnalyticsData.serviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Services']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Technician Total Earnings */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Technician Total Earnings</CardTitle>
            <CardDescription>Total earnings by technician</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enhancedAnalyticsData.technicianEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="technician" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`${currencySymbol} ${value}`, 'Total Earnings']}
                />
                <Bar dataKey="totalEarnings" fill={ANALYTICS_COLORS[2]} name="Total Earnings">
                  <Cell key="cell" fill={ANALYTICS_COLORS[2]} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Services */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Daily Services</CardTitle>
            <CardDescription>Number of services performed each day (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enhancedAnalyticsData.dailyServices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="services" fill={ANALYTICS_COLORS[4]} name="Services">
                  <Cell key="cell" fill={ANALYTICS_COLORS[4]} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <UserCheck /> Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 font-semibold text-lg">
              {enhancedAnalyticsData.topPerformer.name}
            </p>
            <p className="text-green-600">
              Completed {enhancedAnalyticsData.topPerformer.services} services in selected period.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <BarChart3 /> Data Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 font-semibold text-lg">
              {timeRange === '7d' && 'Last 7 Days'}
              {timeRange === '30d' && 'Last 30 Days'}
              {timeRange === '90d' && 'Last 90 Days'}
              {timeRange === '1y' && 'Last Year'}
            </p>
            <p className="text-blue-600">
              {filteredRecords.length} services analyzed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center gap-2">
              <Filter /> Active Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700">
              {selectedTechnician === 'all' ? 'All Technicians' : selectedTechnician}
            </p>
            <p className="text-purple-600 text-sm">
              {technicians.length > 0
                ? `${technicians.length} technicians in system`
                : 'No technicians recorded'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;