-- Update vehicles table to be bike-specific
-- Remove make, variant columns and add engine_capacity
-- Rename model to bike_model for clarity

ALTER TABLE public.vehicles 
  DROP COLUMN IF EXISTS make,
  DROP COLUMN IF EXISTS variant,
  ADD COLUMN IF NOT EXISTS engine_capacity INTEGER,
  ADD COLUMN IF NOT EXISTS bike_model TEXT;

-- Copy model to bike_model if it doesn't exist
UPDATE public.vehicles 
SET bike_model = model 
WHERE bike_model IS NULL AND model IS NOT NULL;

-- Now we can drop the old model column
ALTER TABLE public.vehicles DROP COLUMN IF EXISTS model;

-- Make bike_model required
ALTER TABLE public.vehicles 
  ALTER COLUMN bike_model SET NOT NULL;

-- Update type column to only allow 'bike'
UPDATE public.vehicles SET type = 'bike' WHERE type = 'car';

-- Add constraint to only allow bike type
ALTER TABLE public.vehicles 
  DROP CONSTRAINT IF EXISTS vehicles_type_check;

ALTER TABLE public.vehicles 
  ADD CONSTRAINT vehicles_type_check CHECK (type = 'bike');