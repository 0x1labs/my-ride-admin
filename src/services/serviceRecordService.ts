
import { supabase } from "@/integrations/supabase/client";
import { ServiceRecord, Part } from "@/types/serviceRecord";

// Helper function to transform database row to ServiceRecord interface
const transformServiceRecord = (row: any): ServiceRecord => {
  let parsedParts: Part[] = [];
  if (row.parts) {
    if (typeof row.parts === 'string') {
      try {
        const parts = JSON.parse(row.parts);
        if (Array.isArray(parts)) {
          parsedParts = parts;
        }
      } catch (error) {
        console.error("Failed to parse parts JSON string:", row.parts, error);
      }
    } else if (Array.isArray(row.parts)) {
      parsedParts = row.parts;
    }
  }

  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    date: row.date,
    type: row.type,
    parts: parsedParts,
    laborCost: parseFloat(row.labor_cost || 0),
    discount: parseFloat(row.discount || 0),
    technician: row.technician,
    notes: row.notes || '',
    hasCoupon: row.has_coupon || false,
    couponType: row.coupon_type,
    kilometers: row.kilometers,
  };
};

export const getServiceRecords = async (): Promise<ServiceRecord[]> => {
  console.log('Fetching all service records from Supabase...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }
  
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .eq('user_id', user.id)
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
  
  const newId = `SRV${String(Date.now()).slice(-6)}`;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('service_records')
    .insert({
      id: newId,
      vehicle_id: record.vehicleId,
      date: record.date,
      type: record.type,
      parts: record.parts as any,
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
