
import { supabase } from "@/integrations/supabase/client";
import { Vehicle } from "@/types/vehicle";

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

export const getVehicles = async (): Promise<Vehicle[]> => {
  console.log('Fetching vehicles from Supabase...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }

  console.log('User authenticated:', user.email);
  
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', user.id)
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

export const addVehicle = async (vehicle: Omit<Vehicle, 'id'> & { id?: string }): Promise<Vehicle> => {
  console.log('Adding new vehicle to Supabase...');
  
  // Use provided ID or generate one if not provided
  const vehicleId = vehicle.id || `VH${String(Date.now()).slice(-6)}`;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  console.log('Adding vehicle for user:', user.email);
  
  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      id: vehicleId,
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
