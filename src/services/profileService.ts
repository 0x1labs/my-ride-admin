import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  service_center_name: string;
  email: string;
}

export const getProfiles = async (): Promise<Profile[]> => {
  console.log('Fetching profiles from Supabase...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, service_center_name, email')
    .order('service_center_name');

  if (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }

  console.log('Profiles fetched successfully:', data?.length);
  return data || [];
};

export const updateServiceCenterName = async (serviceCenterName: string): Promise<void> => {
  console.log('Updating service center name...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ service_center_name: serviceCenterName })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating service center name:', error);
    throw error;
  }

  console.log('Service center name updated successfully');
};