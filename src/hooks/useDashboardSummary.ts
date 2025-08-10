import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getServiceTypes } from '@/config';

interface DashboardSummary {
  totalVehicles: number;
  totalServiceRecords: number;
  totalCallRecords: number;
  totalRevenue: number;
  monthlyRevenue: number;
  monthlyServices: number;
  technicians: string[];
  serviceTypes: { name: string; count: number }[];
  topPerformingTechnician: { name: string; serviceCount: number } | null;
}

const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get configured service types
  const configuredServiceTypes = getServiceTypes();

  // Fetch vehicles count
  const { count: totalVehicles, error: vehicleError } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (vehicleError) throw vehicleError;

  // Fetch service records
  const { data: serviceRecords, error: serviceError } = await supabase
    .from('service_records')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (serviceError) throw serviceError;

  // Fetch call records
  const { count: totalCallRecords, error: callError } = await supabase
    .from('call_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (callError) throw callError;

  // Calculate revenue data
  let totalRevenue = 0;
  let monthlyRevenue = 0;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const serviceTypesMap: Record<string, number> = {};
  const technicianMap: Record<string, number> = {};

  // Initialize service types map with configured types
  configuredServiceTypes.forEach(type => {
    serviceTypesMap[type] = 0;
  });

  serviceRecords.forEach(record => {
    // Parse parts
    let partsTotal = 0;
    if (record.parts) {
      if (typeof record.parts === 'string') {
        try {
          const parts = JSON.parse(record.parts);
          if (Array.isArray(parts)) {
            partsTotal = parts.reduce((sum, part: any) => sum + (part.cost || 0), 0);
          }
        } catch (e) {
          console.error('Error parsing parts:', e);
        }
      } else if (Array.isArray(record.parts)) {
        partsTotal = record.parts.reduce((sum, part: any) => sum + (part.cost || 0), 0);
      }
    }

    const recordRevenue = (record.labor_cost || 0) + partsTotal - (record.discount || 0);
    totalRevenue += recordRevenue;

    // Check if record is from current month
    const recordDate = new Date(record.date);
    if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
      monthlyRevenue += recordRevenue;
    }

    // Count service types (respecting configured types)
    if (record.type) {
      // Always count the service type that exists in records
      serviceTypesMap[record.type] = (serviceTypesMap[record.type] || 0) + 1;
    }

    // Count technicians
    if (record.technician) {
      technicianMap[record.technician] = (technicianMap[record.technician] || 0) + 1;
    }
  });

  // Convert service types map to array and sort by count
  const serviceTypes = Object.entries(serviceTypesMap)
    .map(([name, count]) => ({ name, count }))
    .filter(item => item.count > 0) // Only show service types that have been used
    .sort((a, b) => b.count - a.count);

  // Convert technician map to array and find top performer
  const technicians = Object.keys(technicianMap);
  let topPerformingTechnician = null;
  if (technicians.length > 0) {
    const topTech = Object.entries(technicianMap)
      .sort((a, b) => b[1] - a[1])[0];
    topPerformingTechnician = {
      name: topTech[0],
      serviceCount: topTech[1]
    };
  }

  return {
    totalVehicles: totalVehicles || 0,
    totalServiceRecords: serviceRecords.length,
    totalCallRecords: totalCallRecords || 0,
    totalRevenue,
    monthlyRevenue,
    monthlyServices: serviceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }).length,
    technicians,
    serviceTypes,
    topPerformingTechnician
  };
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: fetchDashboardSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};