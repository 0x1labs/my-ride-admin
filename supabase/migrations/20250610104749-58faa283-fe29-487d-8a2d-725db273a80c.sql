
-- Disable Row Level Security on all tables since no authentication is implemented
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records DISABLE ROW LEVEL SECURITY; 
ALTER TABLE public.call_records DISABLE ROW LEVEL SECURITY;
