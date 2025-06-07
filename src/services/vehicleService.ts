
// Legacy service - kept for compatibility with AnalyticsDashboard
// All other functionality has been migrated to supabaseService.ts

export interface Vehicle {
  id: string;
  type: "car" | "bike";
  make: string;
  model: string;
  year: number;
  owner: string;
  phone: string;
  lastService: string;
  nextService: string;
  status: "active" | "overdue" | "upcoming";
  lastServiceKilometers: number;
  currentKilometers: number;
}

export interface Part {
  name: string;
  cost: number;
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: string;
  parts: Array<Part>;
  laborCost: number;
  discount: number;
  technician: string;
  notes: string;
  hasCoupon: boolean;
  couponType: string | null;
  kilometers: number;
}

export interface CallRecord {
  vehicleId: string;
  called: boolean;
  callDate?: string;
}

export interface AnalyticsData {
  monthlyRevenue: Array<{ month: string; revenue: number; services: number }>;
  serviceTypes: Array<{ name: string; value: number; color: string }>;
  dailyServices: Array<{ day: string; services: number }>;
  metrics: {
    averageServiceValue: number;
    monthlyServices: number;
    customerRetention: number;
    averageServiceTime: number;
  };
}

// Re-export analytics data function for backwards compatibility
export const getAnalyticsData = (): AnalyticsData => {
  return {
    monthlyRevenue: [
      { month: "Jan", revenue: 8420, services: 34 },
      { month: "Feb", revenue: 9240, services: 41 },
      { month: "Mar", revenue: 10380, services: 38 },
      { month: "Apr", revenue: 11200, services: 45 },
      { month: "May", revenue: 12450, services: 52 },
      { month: "Jun", revenue: 9800, services: 28 }
    ],
    serviceTypes: [
      { name: "Oil Change", value: 35, color: "#3B82F6" },
      { name: "Brake Service", value: 25, color: "#10B981" },
      { name: "Tire Service", value: 20, color: "#F59E0B" },
      { name: "Engine Repair", value: 15, color: "#EF4444" },
      { name: "Other", value: 5, color: "#6B7280" }
    ],
    dailyServices: [
      { day: "Mon", services: 8 },
      { day: "Tue", services: 12 },
      { day: "Wed", services: 10 },
      { day: "Thu", services: 15 },
      { day: "Fri", services: 18 },
      { day: "Sat", services: 14 },
      { day: "Sun", services: 6 }
    ],
    metrics: {
      averageServiceValue: 240,
      monthlyServices: 52,
      customerRetention: 87,
      averageServiceTime: 2.5
    }
  };
};

// Legacy functions - redirected to throw deprecation warnings
export const getVehicles = (): Vehicle[] => {
  console.warn('getVehicles from vehicleService is deprecated. Use supabaseService instead.');
  return [];
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  console.warn('getVehicleById from vehicleService is deprecated. Use supabaseService instead.');
  return undefined;
};

export const getServiceRecords = (): ServiceRecord[] => {
  console.warn('getServiceRecords from vehicleService is deprecated. Use supabaseService instead.');
  return [];
};

export const getServiceRecordsByVehicleId = (vehicleId: string): ServiceRecord[] => {
  console.warn('getServiceRecordsByVehicleId from vehicleService is deprecated. Use supabaseService instead.');
  return [];
};

export const addServiceRecord = (record: Omit<ServiceRecord, 'id'>): ServiceRecord => {
  console.warn('addServiceRecord from vehicleService is deprecated. Use supabaseService instead.');
  throw new Error('This function is deprecated. Use supabaseService instead.');
};
