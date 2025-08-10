import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Bike, 
  Wrench, 
  Users, 
  TrendingUp, 
  MapPin, 
  Clock, 
  UserCheck,
  BarChart3
} from "lucide-react";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { config, getDistributorName, getDistributorFullName, getCurrencySymbol } from '@/config';
import ConfigurableLogo from './ConfigurableLogo';

const EnhancedHomeDashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useDashboardSummary();
  const currencySymbol = getCurrencySymbol();
  const distributorName = getDistributorName();
  const distributorFullName = getDistributorFullName();
  const websiteUrl = config.distributor.website;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-primary-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <div className="h-8 bg-primary-foreground/20 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-6 bg-primary-foreground/20 rounded w-1/2 mb-6 animate-pulse"></div>
              <div className="h-10 bg-primary-foreground/20 rounded w-32 animate-pulse"></div>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <div className="h-16 w-16 rounded-full bg-primary-foreground/20 animate-pulse"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-primary-foreground">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {distributorFullName}
              </h1>
              <p className="text-lg mb-6 opacity-90">
                Vehicle Service Management System
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <ConfigurableLogo size="lg" />
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500">Error loading dashboard data: {error.message}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Vehicles",
      value: dashboardData?.totalVehicles || 0,
      description: "in your service center",
      icon: config.vehicle_types.includes('car') ? Car : Bike,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Services Completed",
      value: dashboardData?.totalServiceRecords || 0,
      description: "this month",
      icon: Wrench,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Monthly Revenue",
      value: `${currencySymbol} ${(dashboardData?.monthlyRevenue || 0).toLocaleString()}`,
      description: "from all services",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Customer Calls",
      value: dashboardData?.totalCallRecords || 0,
      description: "tracked this month",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-primary-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to {distributorFullName}
            </h1>
            <p className="text-lg mb-6 opacity-90">
              Your trusted partner for vehicle sales and service in Nepal
            </p>
            {websiteUrl && (
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.open(websiteUrl, '_blank')}
              >
                Visit Our Website
              </Button>
            )}
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <ConfigurableLogo size="lg" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <CardDescription className="text-xs text-gray-500">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Performing Technician */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              <span>Top Performer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.topPerformingTechnician ? (
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {dashboardData.topPerformingTechnician.name}
                </p>
                <p className="text-green-600">
                  Completed {dashboardData.topPerformingTechnician.serviceCount} services
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No technician data available</p>
            )}
          </CardContent>
        </Card>

        {/* Service Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span>Service Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.serviceTypes && dashboardData.serviceTypes.length > 0 ? (
              <div className="space-y-2">
                {dashboardData.serviceTypes.slice(0, 5).map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{type.name}</span>
                    <span className="font-medium">{type.count} services</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No service type data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Technician Count */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Technicians</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">
              {dashboardData?.technicians?.length || 0}
            </p>
            <p className="text-blue-600">
              Active technicians in your center
            </p>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Add New Vehicle
              </Button>
              <Button variant="outline" size="sm">
                Schedule Service
              </Button>
              <Button variant="outline" size="sm">
                Log Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedHomeDashboard;