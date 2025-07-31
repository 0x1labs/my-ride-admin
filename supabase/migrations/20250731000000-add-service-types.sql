-- Create service_types table
CREATE TABLE public.service_types (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS on service_types table
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view service types
CREATE POLICY "service_types_view_all" 
ON public.service_types 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Only superadmins can modify service types
CREATE POLICY "service_types_modify_superadmin" 
ON public.service_types 
FOR ALL 
USING (is_superadmin())
WITH CHECK (is_superadmin());

-- Insert default service types
INSERT INTO public.service_types (name, description) VALUES
('Regular Servicing', 'Routine maintenance including oil change, air filter replacement, and general inspection'),
('Brake Servicing', 'Brake system maintenance including brake pad replacement, brake fluid change, and brake inspection'),
('Engine Servicing', 'Engine-focused maintenance including engine oil change, spark plug replacement, and engine diagnostics'),
('Transmission Servicing', 'Transmission system maintenance including transmission fluid change and transmission inspection'),
('Tire & Wheel Servicing', 'Tire rotation, balancing, alignment, and wheel inspection'),
('Electrical Servicing', 'Battery check, alternator inspection, and electrical system diagnostics'),
('Air Conditioning Servicing', 'AC system maintenance including refrigerant refill and AC component inspection'),
('Suspension Servicing', 'Suspension system inspection and maintenance including shock absorber and strut services'),
('General Inspection', 'Comprehensive vehicle inspection and safety check'),
('Emergency Repair', 'Unscheduled repairs for breakdowns and urgent issues');