
-- Drop all existing RLS policies to recreate them with stricter rules
DROP POLICY IF EXISTS "service_centers_own_vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "service_centers_can_view_own_vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "service_centers_can_manage_own_vehicles" ON public.vehicles;

DROP POLICY IF EXISTS "service_centers_own_service_records" ON public.service_records;
DROP POLICY IF EXISTS "service_centers_can_view_own_service_records" ON public.service_records;
DROP POLICY IF EXISTS "service_centers_can_manage_own_service_records" ON public.service_records;

DROP POLICY IF EXISTS "service_centers_own_call_records" ON public.call_records;
DROP POLICY IF EXISTS "service_centers_can_view_own_call_records" ON public.call_records;
DROP POLICY IF EXISTS "service_centers_can_manage_own_call_records" ON public.call_records;

-- RLS policy for vehicles table
CREATE POLICY "service_centers_own_vehicles_policy"
  ON public.vehicles
  FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS policy for service_records table
CREATE POLICY "service_centers_own_service_records_policy"
  ON public.service_records
  FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());

-- RLS policy for call_records table
CREATE POLICY "service_centers_own_call_records_policy"
  ON public.call_records
  FOR ALL
  USING (auth.uid() = user_id OR public.is_superadmin())
  WITH CHECK (auth.uid() = user_id OR public.is_superadmin());
