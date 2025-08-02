-- Open up permissions for all tables to allow all authenticated users to read all vehicles
-- Update RLS policies to be more permissive

-- Allow all authenticated users to read all vehicles
DROP POLICY IF EXISTS "service_centers_view_all_vehicles" ON vehicles;
CREATE POLICY "allow_all_authenticated_users_read_vehicles" 
ON vehicles 
FOR SELECT 
TO authenticated
USING (true);

-- Allow all authenticated users to read all service records  
DROP POLICY IF EXISTS "service_centers_view_all_service_records" ON service_records;
CREATE POLICY "allow_all_authenticated_users_read_service_records" 
ON service_records 
FOR SELECT 
TO authenticated
USING (true);

-- Allow all authenticated users to read all call records
DROP POLICY IF EXISTS "Allow public read access on call_records" ON call_records;
CREATE POLICY "allow_all_authenticated_users_read_call_records" 
ON call_records 
FOR SELECT 
TO authenticated
USING (true);