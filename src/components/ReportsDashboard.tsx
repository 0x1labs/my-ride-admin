import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  Cell
} from "recharts";
import { 
  Download, 
  Calendar, 
  FileText, 
  Printer,
  Filter
} from "lucide-react";
import { Vehicle, ServiceRecord } from "@/services/supabaseService";
import { getSelectableColors, getCurrencySymbol, getAnalyticsChartColors, ANALYTICS_COLORS } from "@/config";
import { format } from "date-fns";

interface ReportsDashboardProps {
  vehicles: Vehicle[];
  serviceRecords: ServiceRecord[];
}


const currencySymbol = getCurrencySymbol();

const ReportsDashboard = ({ vehicles, serviceRecords }: ReportsDashboardProps) => {
  const [reportType, setReportType] = useState<'revenue' | 'services' | 'technicians' | 'customers'>('revenue');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');

  // Filter records based on time range
  const filteredRecords = useMemo(() => {
    if (timeRange === 'all') return serviceRecords;
    
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
    
    return serviceRecords.filter(record => new Date(record.date) >= startDate);
  }, [serviceRecords, timeRange]);

  // Generate report data based on selected type
  const reportData = useMemo(() => {
    switch (reportType) {
      case 'revenue':
        return generateRevenueReport(filteredRecords);
      case 'services':
        return generateServicesReport(filteredRecords);
      case 'technicians':
        return generateTechniciansReport(filteredRecords);
      case 'customers':
        return generateCustomersReport(filteredRecords, vehicles);
      default:
        return [];
    }
  }, [reportType, filteredRecords, vehicles]);

  // Chart data for visualization
  const chartData = useMemo(() => {
    if (reportType === 'revenue') {
      return filteredRecords.reduce((acc, record) => {
        const date = format(new Date(record.date), 'MMM dd');
        const existing = acc.find(item => item.date === date);
        const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
        const serviceValue = record.laborCost + partsCost - record.discount;
        
        if (existing) {
          existing.value += serviceValue;
        } else {
          acc.push({ date, value: serviceValue });
        }
        return acc;
      }, [] as { date: string; value: number }[])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    
    if (reportType === 'services') {
      return filteredRecords.reduce((acc, record) => {
        const serviceName = record.type;
        const existing = acc.find(item => item.name === serviceName);
        
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ name: serviceName, count: 1 });
        }
        return acc;
      }, [] as { name: string; count: number }[]);
    }
    
    if (reportType === 'technicians') {
      return filteredRecords.reduce((acc, record) => {
        if (!record.technician) return acc;
        
        const existing = acc.find(item => item.name === record.technician);
        const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
        const serviceValue = record.laborCost + partsCost - record.discount;
        
        if (existing) {
          existing.services += 1;
          existing.revenue += serviceValue;
        } else {
          acc.push({ 
            name: record.technician, 
            services: 1, 
            revenue: serviceValue 
          });
        }
        return acc;
      }, [] as { name: string; services: number; revenue: number }[]);
    }
    
    return [];
  }, [reportType, filteredRecords]);

  // Generate revenue report
  function generateRevenueReport(records: ServiceRecord[]) {
    return records.map(record => {
      const vehicle = vehicles.find(v => v.id === record.vehicleId);
      const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
      const totalValue = record.laborCost + partsCost - record.discount;
      
      return {
        id: record.id,
        date: format(new Date(record.date), 'MMM dd, yyyy'),
        customer: vehicle?.owner || 'Unknown',
        service: record.type,
        technician: record.technician || 'Unassigned',
        parts: partsCost,
        labor: record.laborCost,
        discount: record.discount,
        total: totalValue
      };
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.total - a.total;
      }
    });
  }

  // Generate services report
  function generateServicesReport(records: ServiceRecord[]) {
    return records.map(record => {
      const vehicle = vehicles.find(v => v.id === record.vehicleId);
      
      return {
        id: record.id,
        date: format(new Date(record.date), 'MMM dd, yyyy'),
        customer: vehicle?.owner || 'Unknown',
        vehicle: vehicle ? `${vehicle.bikeModel || vehicle.carModel} (${vehicle.year})` : 'Unknown',
        service: record.type,
        technician: record.technician || 'Unassigned',
        status: record.kilometers > 0 ? 'Completed' : 'Pending',
        notes: record.notes || 'No notes'
      };
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.customer.localeCompare(b.customer);
      }
    });
  }

  // Generate technicians report
  function generateTechniciansReport(records: ServiceRecord[]) {
    const techStats = records.reduce((acc, record) => {
      if (!record.technician) return acc;
      
      if (!acc[record.technician]) {
        acc[record.technician] = {
          services: 0,
          parts: 0,
          labor: 0,
          discount: 0
        };
      }
      
      acc[record.technician].services += 1;
      acc[record.technician].labor += record.laborCost;
      acc[record.technician].discount += record.discount;
      record.parts.forEach(part => {
        acc[record.technician].parts += part.cost;
      });
      
      return acc;
    }, {} as Record<string, { services: number; parts: number; labor: number; discount: number }>);

    return Object.entries(techStats).map(([technician, stats]) => ({
      technician,
      services: stats.services,
      parts: stats.parts,
      labor: stats.labor,
      discount: stats.discount,
      total: stats.labor + stats.parts - stats.discount
    })).sort((a, b) => b.total - a.total);
  }

  // Generate customers report
  function generateCustomersReport(records: ServiceRecord[], vehicles: Vehicle[]) {
    const customerStats = records.reduce((acc, record) => {
      const vehicle = vehicles.find(v => v.id === record.vehicleId);
      if (!vehicle) return acc;
      
      const customer = vehicle.owner;
      if (!acc[customer]) {
        acc[customer] = {
          services: 0,
          vehicles: new Set(),
          totalSpent: 0,
          lastService: new Date(record.date)
        };
      }
      
      acc[customer].services += 1;
      acc[customer].vehicles.add(vehicle.id);
      
      const partsCost = record.parts.reduce((sum, part) => sum + part.cost, 0);
      acc[customer].totalSpent += record.laborCost + partsCost - record.discount;
      
      const recordDate = new Date(record.date);
      if (recordDate > acc[customer].lastService) {
        acc[customer].lastService = recordDate;
      }
      
      return acc;
    }, {} as Record<string, { 
      services: number; 
      vehicles: Set<string>; 
      totalSpent: number; 
      lastService: Date 
    }>);

    return Object.entries(customerStats).map(([customer, stats]) => ({
      customer,
      services: stats.services,
      vehicles: stats.vehicles.size,
      totalSpent: stats.totalSpent,
      lastService: format(stats.lastService, 'MMM dd, yyyy')
    })).sort((a, b) => b.totalSpent - a.totalSpent);
  }

  // Export data to CSV
  const exportToCSV = () => {
    // In a real implementation, this would generate and download a CSV file
    alert("CSV export functionality would be implemented here");
  };

  // Print report
  const printReport = () => {
    window.print();
  };

  // Get column headers based on report type
  const getColumnHeaders = () => {
    switch (reportType) {
      case 'revenue':
        return ['Date', 'Customer', 'Service', 'Technician', 'Parts', 'Labor', 'Discount', 'Total'];
      case 'services':
        return ['Date', 'Customer', 'Vehicle', 'Service', 'Technician', 'Status', 'Notes'];
      case 'technicians':
        return ['Technician', 'Services', 'Parts Cost', 'Labor Cost', 'Discounts', 'Total Revenue'];
      case 'customers':
        return ['Customer', 'Services', 'Vehicles', 'Total Spent', 'Last Service'];
      default:
        return [];
    }
  };

  // Get table data based on report type
  const getTableData = () => {
    switch (reportType) {
      case 'revenue':
        return reportData.map((item: any) => [
          item.date,
          item.customer,
          item.service,
          item.technician,
          `${currencySymbol}${item.parts.toFixed(2)}`,
          `${currencySymbol}${item.labor.toFixed(2)}`,
          `${currencySymbol}${item.discount.toFixed(2)}`,
          `${currencySymbol}${item.total.toFixed(2)}`
        ]);
      case 'services':
        return reportData.map((item: any) => [
          item.date,
          item.customer,
          item.vehicle,
          item.service,
          item.technician,
          item.status,
          item.notes
        ]);
      case 'technicians':
        return reportData.map((item: any) => [
          item.technician,
          item.services,
          `${currencySymbol}${item.parts.toFixed(2)}`,
          `${currencySymbol}${item.labor.toFixed(2)}`,
          `${currencySymbol}${item.discount.toFixed(2)}`,
          `${currencySymbol}${item.total.toFixed(2)}`
        ]);
      case 'customers':
        return reportData.map((item: any) => [
          item.customer,
          item.services,
          item.vehicles,
          `${currencySymbol}${item.totalSpent.toFixed(2)}`,
          item.lastService
        ]);
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 print:text-xl">Reports Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <Select value={reportType} onValueChange={(v: any) => setReportType(v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue Report</SelectItem>
                <SelectItem value="services">Services Report</SelectItem>
                <SelectItem value="technicians">Technicians Report</SelectItem>
                <SelectItem value="customers">Customers Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
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
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="value">Sort by Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={printReport}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 print:hidden">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="text-2xl">{filteredRecords.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Time Period</CardDescription>
            <CardTitle className="text-2xl">
              {timeRange === '7d' && '7 Days'}
              {timeRange === '30d' && '30 Days'}
              {timeRange === '90d' && '90 Days'}
              {timeRange === '1y' && '1 Year'}
              {timeRange === 'all' && 'All Time'}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Report Type</CardDescription>
            <CardTitle className="text-2xl capitalize">{reportType}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sort Order</CardDescription>
            <CardTitle className="text-2xl capitalize">{sortBy}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Chart Visualization */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle>Report Visualization</CardTitle>
          <CardDescription>Data visualization based on selected report type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {chartData.length > 0 ? (
              reportType === 'services' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ANALYTICS_COLORS[index % ANALYTICS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={reportType === 'technicians' ? 'name' : 'date'} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [
                        reportType === 'revenue' || reportType === 'technicians' 
                          ? `${currencySymbol}${Number(value).toFixed(2)}` 
                          : value,
                        reportType === 'revenue' ? 'Revenue' : 
                        reportType === 'technicians' ? 'Value' : 'Count'
                      ]}
                    />
                    <Bar 
                      dataKey={reportType === 'revenue' ? 'value' : 
                               reportType === 'technicians' ? 'revenue' : 'count'} 
                      fill="#3B82F6" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No data available for visualization
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Report Table */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{reportType} Report</CardTitle>
          <CardDescription>
            Detailed report for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {getColumnHeaders().map((header, index) => (
                    <TableHead key={index}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTableData().length > 0 ? (
                  getTableData().map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={getColumnHeaders().length} className="text-center">
                      No data available for the selected report type and time period
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsDashboard;