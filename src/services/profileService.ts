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