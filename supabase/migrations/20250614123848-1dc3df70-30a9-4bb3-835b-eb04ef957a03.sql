
-- Drop existing policies if they exist to be re-created with stricter checks
DROP POLICY IF EXISTS "service_centers_own_vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "service_centers_own_service_records" ON public.service_records;
DROP POLICY IF EXISTS "service_centers_own_call_records" ON public.call_records;

-- Create RLS policy for vehicles, ensuring user_id is a service_center
CREATE POLICY "service_centers_own_vehicles" 
  ON public.vehicles 
  FOR ALL 
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (public.has_role(user_id, 'service_center'));

-- Create RLS policy for service_records, ensuring user_id is a service_center
CREATE POLICY "service_centers_own_service_records" 
  ON public.service_records 
  FOR ALL 
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (public.has_role(user_id, 'service_center'));

-- Create RLS policy for call_records, ensuring user_id is a service_center
CREATE POLICY "service_centers_own_call_records" 
  ON public.call_records 
  FOR ALL 
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (public.has_role(user_id, 'service_center'));
