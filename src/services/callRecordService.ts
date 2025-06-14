
import { supabase } from "@/integrations/supabase/client";
import { CallRecord } from "@/types/callRecord";

// Helper function to transform database row to CallRecord interface
const transformCallRecord = (row: any): CallRecord => ({
  id: row.id,
  vehicleId: row.vehicle_id,
  called: row.called,
  callDate: row.call_date,
  notes: row.notes,
});

export const getCallRecords = async (): Promise<CallRecord[]> => {
  console.log('Fetching call records from Supabase...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }
  
  const { data, error } = await supabase
    .from('call_records')
    .select('*')
    .eq('user_id', user.id)
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
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data: existingRecord } = await supabase
    .from('call_records')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .single();

  if (existingRecord) {
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
