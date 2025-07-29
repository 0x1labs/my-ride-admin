-- Create coupon_types table
CREATE TABLE public.coupon_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  labor_discount_type TEXT NOT NULL CHECK (labor_discount_type IN ('none', 'percentage', 'fixed')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupon_types ENABLE ROW LEVEL SECURITY;

-- Create policy for reading coupon types (public read access for all authenticated users)
CREATE POLICY "Allow authenticated users to read coupon types" 
ON public.coupon_types 
FOR SELECT 
TO authenticated
USING (true);

-- Insert predefined coupon types
INSERT INTO public.coupon_types (name, description, labor_discount_type) VALUES
('AMC', 'Annual Maintenance Contract - Discounted services for contract holders', 'percentage'),
('Free', 'First N services are free - No labor charge applied', 'none'),
('Custom', 'Custom discount coupon - User-specific discount applied', 'fixed');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_coupon_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_coupon_types_updated_at
BEFORE UPDATE ON public.coupon_types
FOR EACH ROW
EXECUTE FUNCTION public.update_coupon_types_updated_at();