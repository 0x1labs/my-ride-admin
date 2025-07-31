import { supabase } from "@/integrations/supabase/client";

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const getServiceTypes = async (): Promise<ServiceType[]> => {
  console.log('Fetching service types from Supabase...');
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('User not authenticated, returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('service_types')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching service types:', error);
    throw error;
  }

  console.log('Service types fetched successfully:', data?.length);
  return data || [];
};