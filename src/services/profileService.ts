import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  email: string;
  role: 'superadmin' | 'service_center';
  service_center_name: string;
  created_at: string;
  updated_at: string;
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
    .select('*')
    .order('service_center_name');

  if (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }

  console.log('Profiles fetched successfully:', data?.length);
  return data || [];
};

export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  console.log('Fetching current user profile...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated');
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }

  console.log('Current user profile fetched successfully');
  return data;
};