
import appData from '../data/vehicles.json';

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

// In-memory storage for service records (starts with data from JSON)
let serviceRecords: ServiceRecord[] = [...(appData.serviceRecords as ServiceRecord[])];

export const getVehicles = (): Vehicle[] => {
  return appData.vehicles as Vehicle[];
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  return appData.vehicles.find(vehicle => vehicle.id === id) as Vehicle | undefined;
};

export const getServiceRecords = (): ServiceRecord[] => {
  return serviceRecords;
};

export const getServiceRecordsByVehicleId = (vehicleId: string): ServiceRecord[] => {
  return serviceRecords.filter(record => record.vehicleId === vehicleId);
};

export const addServiceRecord = (record: Omit<ServiceRecord, 'id'>): ServiceRecord => {
  const newRecord: ServiceRecord = {
    ...record,
    id: `SRV${String(serviceRecords.length + 1).padStart(3, '0')}`
  };
  serviceRecords.push(newRecord);
  return newRecord;
};

export const getAnalyticsData = (): AnalyticsData => {
  return appData.analytics as AnalyticsData;
};
