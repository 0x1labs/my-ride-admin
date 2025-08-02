import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  previousMonthRevenue: number;
  percentageChange: number;
}

const fetchRevenue = async (): Promise<RevenueData> => {
  const { data: serviceRecords, error } = await supabase
    .from('service_records')
    .select('parts, labor_cost, discount, date');

  if (error) {
    console.error('Error fetching service records for revenue:', error);
    throw error;
  }

  if (!serviceRecords || serviceRecords.length === 0) {
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      previousMonthRevenue: 0,
      percentageChange: 0,
    };
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let previousMonthRevenue = 0;

  serviceRecords.forEach((record) => {
    const recordDate = new Date(record.date);
    const partsTotal = Array.isArray(record.parts) 
      ? record.parts.reduce((sum, part: any) => sum + (part.cost || 0), 0) 
      : 0;
    const recordRevenue = (record.labor_cost || 0) + partsTotal - (record.discount || 0);
    
    totalRevenue += recordRevenue;

    // Current month revenue
    if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
      monthlyRevenue += recordRevenue;
    }

    // Previous month revenue
    if (recordDate.getMonth() === previousMonth && recordDate.getFullYear() === previousYear) {
      previousMonthRevenue += recordRevenue;
    }
  });

  const percentageChange = previousMonthRevenue > 0 
    ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
    : monthlyRevenue > 0 ? 100 : 0;

  return {
    totalRevenue,
    monthlyRevenue,
    previousMonthRevenue,
    percentageChange,
  };
};

export const useRevenue = () => {
  return useQuery({
    queryKey: ['revenue'],
    queryFn: fetchRevenue,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};