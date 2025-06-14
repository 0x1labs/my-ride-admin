
-- Add variant field to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN variant text;

-- Make variant nullable for existing records, but you can make it required for new ones if needed
-- If you want to make it required later, you can run: ALTER TABLE public.vehicles ALTER COLUMN variant SET NOT NULL;
