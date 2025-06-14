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
  variant?: string;
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
  variant: row.variant,
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
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }

  console.log('User authenticated:', user.email);
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('id');

  if (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }

  console.log('Raw vehicles data from DB:', data);
  console.log('Vehicles fetched successfully:', data?.length);
  return data?.map(transformVehicle) || [];
};

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  console.log(`Fetching vehicle by id: ${id}`);
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning null');
    return null;
  }
  
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

export const addVehicle = async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
  console.log('Adding new vehicle to Supabase...');
  
  // Generate a new ID
  const newId = `VH${String(Date.now()).slice(-6)}`;
  
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  console.log('Adding vehicle for user:', user.email);
  
  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      id: newId,
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      owner: vehicle.owner,
      phone: vehicle.phone,
      last_service: vehicle.lastService,
      next_service: vehicle.nextService,
      status: vehicle.status,
      last_service_kilometers: vehicle.lastServiceKilometers,
      current_kilometers: vehicle.currentKilometers,
      variant: vehicle.variant,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding vehicle:', error);
    throw error;
  }

  console.log('Vehicle added successfully:', data.id);
  return transformVehicle(data);
};

export const updateVehicle = async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
  console.log(`Updating vehicle ${id} in Supabase...`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const dbUpdates: { [key: string]: any } = { updated_at: new Date().toISOString() };
  if (updates.type !== undefined) dbUpdates.type = updates.type;
  if (updates.make !== undefined) dbUpdates.make = updates.make;
  if (updates.model !== undefined) dbUpdates.model = updates.model;
  if (updates.year !== undefined) dbUpdates.year = updates.year;
  if (updates.owner !== undefined) dbUpdates.owner = updates.owner;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.lastService !== undefined) dbUpdates.last_service = updates.lastService;
  if (updates.nextService !== undefined) dbUpdates.next_service = updates.nextService;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.lastServiceKilometers !== undefined) dbUpdates.last_service_kilometers = updates.lastServiceKilometers;
  if (updates.currentKilometers !== undefined) dbUpdates.current_kilometers = updates.currentKilometers;
  if (updates.variant !== undefined) dbUpdates.variant = updates.variant;


  const { data, error } = await supabase
    .from('vehicles')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }

  console.log('Vehicle updated successfully:', data.id);
  return transformVehicle(data);
};

export const deleteVehicle = async (id: string): Promise<void> => {
  console.log(`Deleting vehicle ${id} from Supabase...`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }

  console.log('Vehicle deleted successfully:', id);
};

export const getServiceRecords = async (): Promise<ServiceRecord[]> => {
  console.log('Fetching all service records from Supabase...');
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }
  
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
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }
  
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
  
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Convert parts array to JSON for database storage
  const partsJson = JSON.stringify(record.parts);
  
  const { data, error } = await supabase
    .from('service_records')
    .insert({
      id: newId,
      vehicle_id: record.vehicleId,
      date: record.date,
      type: record.type,
      parts: partsJson,
      labor_cost: record.laborCost,
      discount: record.discount,
      technician: record.technician,
      notes: record.notes,
      has_coupon: record.hasCoupon,
      coupon_type: record.couponType,
      kilometers: record.kilometers,
      user_id: user.id,
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
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }
  
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
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }
  
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
  
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
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
        user_id: user.id,
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
