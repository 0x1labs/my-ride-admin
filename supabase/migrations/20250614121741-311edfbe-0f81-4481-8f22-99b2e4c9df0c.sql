
-- Drop existing foreign key constraints
ALTER TABLE public.service_records DROP CONSTRAINT service_records_vehicle_id_fkey;
ALTER TABLE public.call_records DROP CONSTRAINT call_records_vehicle_id_fkey;

-- Re-create foreign key constraints with ON DELETE CASCADE
ALTER TABLE public.service_records 
ADD CONSTRAINT service_records_vehicle_id_fkey 
FOREIGN KEY (vehicle_id) 
REFERENCES public.vehicles (id) ON DELETE CASCADE;

ALTER TABLE public.call_records 
ADD CONSTRAINT call_records_vehicle_id_fkey 
FOREIGN KEY (vehicle_id) 
REFERENCES public.vehicles (id) ON DELETE CASCADE;
