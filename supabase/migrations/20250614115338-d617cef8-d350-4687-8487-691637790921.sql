
-- Clear all service records first (due to foreign key relationships)
DELETE FROM public.service_records;

-- Clear all call records
DELETE FROM public.call_records;

-- Clear all vehicles
DELETE FROM public.vehicles;
