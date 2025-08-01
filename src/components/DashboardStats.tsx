import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { Vehicle } from "@/services/supabaseService";

interface DashboardStatsProps {
  vehicles: Vehicle[];
}

const DashboardStats = ({ vehicles }: DashboardStatsProps) => {
  const totalVehicles = vehicles.length;
  const totalBikes = vehicles.filter(v => v.type === "bike").length;
  const overdueServices = vehicles.filter(v => v.status === "overdue").length;
  const activeServices = vehicles.filter(v => v.status === "active").length;

  const stats = [
    {
      title: "Total Motorbikes",
      value: totalVehicles,
      description: `${totalBikes} bikes`,
      icon: Bike,
      color: "text-ktm-orange",
      bgColor: "bg-ktm-black"
    },
    {
      title: "Active Services",
      value: activeServices,
      description: "Up to date motorbikes",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-ktm-black"
    },
    {
      title: "Overdue Services",
      value: overdueServices,
      description: "Requires attention",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-ktm-black"
    },
    {
      title: "Monthly Revenue",
      value: "NPR 12,450",
      description: "+15% from last month",
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-ktm-black"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-ktm-dark-gray border-ktm-orange-dim text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-ktm-light-gray">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <CardDescription className="text-xs text-ktm-light-gray">
              {stat.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;