import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { config, getDistributorName, getDistributorFullName, getCurrencySymbol, getServiceTypes } from '@/config';
import { Car, Bike, Wrench, Users, TrendingUp, MapPin } from 'lucide-react';
import ConfigurableLogo from './ConfigurableLogo';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import ConfigurableCurrency from './ConfigurableCurrency';

const DistributorBrandingShowcase: React.FC = () => {
  const distributorName = getDistributorName();
  const distributorFullName = getDistributorFullName();
  const currencySymbol = getCurrencySymbol();
  const configuredServiceTypes = getServiceTypes();
  const { data: dashboardData, isLoading } = useDashboardSummary();

  const vehicleTypes = config.vehicle_types;
  const hasBikes = vehicleTypes.includes('bike');
  const hasCars = vehicleTypes.includes('car');

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-8 text-primary-foreground">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to {distributorFullName}
            </h1>
            <p className="text-lg mb-6 opacity-90">
              Your trusted partner for vehicle sales and service in Nepal
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <ConfigurableLogo size="lg" variant="full" />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vehicles</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : formatNumber(dashboardData?.totalVehicles || 0)}
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Bike className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Services Completed</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : formatNumber(dashboardData?.totalServiceRecords || 0)}
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : (
                    <ConfigurableCurrency amount={dashboardData?.monthlyRevenue || 0} />
                  )}
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Happy Customers</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : formatNumber(dashboardData?.totalVehicles || 0)}
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Services This Month</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : formatNumber(dashboardData?.monthlyServices || 0)}
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Calls</p>
                <p className="text-2xl font-bold">
                  {isLoading ? '...' : formatNumber(dashboardData?.totalCallRecords || 0)}
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Our Vehicle Portfolio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hasBikes && (
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Bike className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Motorcycles</h3>
                  <p className="text-sm text-muted-foreground">
                    Premium bikes from {distributorName}
                  </p>
                </div>
              </div>
            )}
            {hasCars && (
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Car className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Cars</h3>
                  <p className="text-sm text-muted-foreground">
                    Quality vehicles from {distributorName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Performer */}
      {dashboardData?.topPerformingTechnician && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Top Performer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div>
                <h3 className="font-semibold text-green-800">
                  {dashboardData.topPerformingTechnician.name}
                </h3>
                <p className="text-sm text-green-600">
                  {dashboardData.topPerformingTechnician.serviceCount} services completed
                </p>
              </div>
              <div className="bg-green-500 text-white p-3 rounded-full">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Service Types Distribution */}
      {dashboardData && dashboardData.serviceTypes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.serviceTypes.map((serviceType, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{serviceType.name}</span>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {serviceType.count} services
                  </span>
                </div>
              ))}
            </div>
            {dashboardData.serviceTypes.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No services recorded yet. Configured service types: {configuredServiceTypes.join(', ')}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DistributorBrandingShowcase;