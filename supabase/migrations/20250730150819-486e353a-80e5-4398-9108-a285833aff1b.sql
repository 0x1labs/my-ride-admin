-- Clear all data except account data (profiles, authorized_emails)
DELETE FROM public.call_records;
DELETE FROM public.service_records;
DELETE FROM public.vehicles;

-- Add service_center_name field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN service_center_name TEXT;

-- Update all current accounts with a default service center name
UPDATE public.profiles 
SET service_center_name = 'Service Center ' || SUBSTRING(id::text, 1, 8)
WHERE service_center_name IS NULL;

-- Make service_center_name required for future records
ALTER TABLE public.profiles 
ALTER COLUMN service_center_name SET NOT NULL;

-- Add service_center_name field to service_records to track which service center did the servicing
ALTER TABLE public.service_records 
ADD COLUMN service_center_name TEXT;

-- Update RLS policies to allow cross-service center viewing of vehicles
DROP POLICY IF EXISTS "service_centers_own_vehicles_policy" ON public.vehicles;

-- New policy: All authenticated service centers can view all vehicles
CREATE POLICY "service_centers_view_all_vehicles" 
ON public.vehicles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Service centers can only modify their own vehicles
CREATE POLICY "service_centers_modify_own_vehicles" 
ON public.vehicles 
FOR ALL 
USING ((auth.uid() = user_id) OR is_superadmin())
WITH CHECK ((auth.uid() = user_id) OR is_superadmin());

-- Update service_records RLS to allow viewing all records but only modifying own
DROP POLICY IF EXISTS "service_centers_own_service_records_policy" ON public.service_records;

-- All authenticated users can view all service records
CREATE POLICY "service_centers_view_all_service_records" 
ON public.service_records 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Service centers can only modify their own service records
CREATE POLICY "service_centers_modify_own_service_records" 
ON public.service_records 
FOR ALL 
USING ((auth.uid() = user_id) OR is_superadmin())
WITH CHECK ((auth.uid() = user_id) OR is_superadmin());