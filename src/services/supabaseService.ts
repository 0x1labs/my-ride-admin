import { supabase } from "@/integrations/supabase/client";

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
  id: string;
  vehicleId: string;
  called: boolean;
  callDate?: string;
  notes?: string;
}

// Helper function to transform database row to Vehicle interface
const transformVehicle = (row: any): Vehicle => ({
  id: row.id,
  type: row.type,
  make: row.make,
  model: row.model,
  year: row.year,
  owner: row.owner,
  phone: row.phone,
  lastService: row.last_service,
  nextService: row.next_service,
  status: row.status,
  lastServiceKilometers: row.last_service_kilometers,
  currentKilometers: row.current_kilometers,
});

// Helper function to transform database row to ServiceRecord interface
const transformServiceRecord = (row: any): ServiceRecord => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  date: row.date,
  type: row.type,
  parts: row.parts || [],
  laborCost: parseFloat(row.labor_cost || 0),
  discount: parseFloat(row.discount || 0),
  technician: row.technician,
  notes: row.notes || '',
  hasCoupon: row.has_coupon || false,
  couponType: row.coupon_type,
  kilometers: row.kilometers,
});

// Helper function to transform database row to CallRecord interface
const transformCallRecord = (row: any): CallRecord => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  called: row.called,
  callDate: row.call_date,
  notes: row.notes,
});

export const getVehicles = async (): Promise<Vehicle[]> => {
  console.log('Fetching vehicles from Supabase...');
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }

  console.log('Vehicles fetched successfully:', data?.length);
  return data?.map(transformVehicle) || [];
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  console.log(`Fetching vehicle by id: ${id}`);
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching vehicle by id:', error);
    return null;
  }

  return data ? transformVehicle(data) : null;
};

export const getServiceRecords = async (): Promise<ServiceRecord[]> => {
  console.log('Fetching all service records from Supabase...');
  
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching service records:', error);
    throw error;
  }

  console.log('Service records fetched successfully:', data?.length);
  return data?.map(transformServiceRecord) || [];
};

export const getServiceRecordsByVehicleId = async (vehicleId: string): Promise<ServiceRecord[]> => {
  console.log(`Fetching service records for vehicle: ${vehicleId}`);
  
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching service records by vehicle id:', error);
    throw error;
  }

  console.log('Service records fetched successfully for vehicle:', data?.length);
  return data?.map(transformServiceRecord) || [];
};

export const addServiceRecord = async (record: Omit<ServiceRecord, 'id'>): Promise<ServiceRecord> => {
  console.log('Adding new service record to Supabase...');
  
  // Generate a new ID
  const newId = `SRV${String(Date.now()).slice(-6)}`;
  
  const { data, error } = await supabase
    .from('service_records')
    .insert({
      id: newId,
      vehicle_id: record.vehicleId,
      date: record.date,
      type: record.type,
      parts: record.parts,
      labor_cost: record.laborCost,
      discount: record.discount,
      technician: record.technician,
      notes: record.notes,
      has_coupon: record.hasCoupon,
      coupon_type: record.couponType,
      kilometers: record.kilometers,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding service record:', error);
    throw error;
  }

  console.log('Service record added successfully:', data.id);
  return transformServiceRecord(data);
};

export const getCallRecords = async (): Promise<CallRecord[]> => {
  console.log('Fetching call records from Supabase...');
  
  const { data, error } = await supabase
    .from('call_records')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching call records:', error);
    throw error;
  }

  console.log('Call records fetched successfully:', data?.length);
  return data?.map(transformCallRecord) || [];
};

export const getCallRecordsByVehicleId = async (vehicleId: string): Promise<CallRecord[]> => {
  console.log(`Fetching call records for vehicle: ${vehicleId}`);
  
  const { data, error } = await supabase
    .from('call_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching call records by vehicle id:', error);
    throw error;
  }

  return data?.map(transformCallRecord) || [];
};

export const upsertCallRecord = async (vehicleId: string, called: boolean, notes?: string): Promise<CallRecord> => {
  console.log(`Upserting call record for vehicle: ${vehicleId}`);
  
  // First, check if a call record exists for this vehicle
  const { data: existingRecord } = await supabase
    .from('call_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .single();

  if (existingRecord) {
    // Update existing record
    const { data, error } = await supabase
      .from('call_records')
      .update({
        called,
        call_date: called ? new Date().toISOString() : null,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingRecord.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating call record:', error);
      throw error;
    }

    return transformCallRecord(data);
  } else {
    // Create new record
    const { data, error } = await supabase
      .from('call_records')
      .insert({
        vehicle_id: vehicleId,
        called,
        call_date: called ? new Date().toISOString() : null,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating call record:', error);
      throw error;
    }

    return transformCallRecord(data);
  }
};

// Analytics data (keeping this static for now as requested)
export const getAnalyticsData = () => {
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
