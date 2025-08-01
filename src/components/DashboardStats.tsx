import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, AlertTriangle, CheckCircle, DollarSign, Calendar } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";
import { useRevenue } from "@/hooks/useRevenue";

interface DashboardStatsProps {
  vehicles: Vehicle[];
}

const DashboardStats = ({ vehicles }: DashboardStatsProps) => {
  const totalVehicles = vehicles.length;
  
  const totalBikes = vehicles.filter(v => v.type === "bike").length;
  const overdueServices = vehicles.filter(v => v.status === "overdue").length;
  const activeServices = vehicles.filter(v => v.status === "active").length;
  const { data: revenueData, isLoading: revenueLoading } = useRevenue();

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
      description: "Up to date bikes",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Overdue Services",
      value: overdueServices,
      description: "Requires attention",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Monthly Revenue",
      value: revenueLoading ? "Loading..." : `रु ${revenueData?.monthlyRevenue?.toLocaleString('en-IN') || '0'}`,
      description: revenueData && revenueData.percentageChange !== 0 
        ? `${revenueData.percentageChange > 0 ? '+' : ''}${revenueData.percentageChange.toFixed(1)}% from last month`
        : "from last month",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
  );
};

export default DashboardStats;
