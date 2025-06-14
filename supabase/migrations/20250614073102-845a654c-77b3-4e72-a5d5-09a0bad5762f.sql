
-- Add user_id column to vehicles table to associate vehicles with service centers
ALTER TABLE public.vehicles 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to service_records table
ALTER TABLE public.service_records 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to call_records table
ALTER TABLE public.call_records 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on all tables
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vehicles
CREATE POLICY "service_centers_own_vehicles" 
  ON public.vehicles 
  FOR ALL 
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- Create RLS policies for service_records
CREATE POLICY "service_centers_own_service_records" 
  ON public.service_records 
  FOR ALL 
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- Create RLS policies for call_records
CREATE POLICY "service_centers_own_call_records" 
  ON public.call_records 
  FOR ALL 
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- Update existing data to assign to the first user (temporary - you may want to adjust this)
-- This assigns all existing vehicles to the first service center user found
UPDATE public.vehicles 
SET user_id = (
  SELECT id FROM public.profiles 
  WHERE role = 'service_center' 
  ORDER BY created_at ASC 
  LIMIT 1
) 
WHERE user_id IS NULL;

-- Same for service records
UPDATE public.service_records 
SET user_id = (
  SELECT id FROM public.profiles 
  WHERE role = 'service_center' 
  ORDER BY created_at ASC 
  LIMIT 1
) 
WHERE user_id IS NULL;

-- Same for call records
UPDATE public.call_records 
SET user_id = (
  SELECT id FROM public.profiles 
  WHERE role = 'service_center' 
  ORDER BY created_at ASC 
  LIMIT 1
) 
WHERE user_id IS NULL;
