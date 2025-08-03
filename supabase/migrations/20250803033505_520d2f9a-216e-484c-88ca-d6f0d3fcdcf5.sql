-- Update vehicles table policies to allow authenticated users to insert
DROP POLICY IF EXISTS "service_centers_modify_own_vehicles" ON vehicles;

-- Create separate policies for better control
CREATE POLICY "vehicles_select_all" ON vehicles 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "vehicles_insert_own" ON vehicles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vehicles_update_own" ON vehicles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id OR is_superadmin())
WITH CHECK (auth.uid() = user_id OR is_superadmin());

CREATE POLICY "vehicles_delete_own" ON vehicles 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id OR is_superadmin());