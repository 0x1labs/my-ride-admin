-- Phase 1: Critical Database Security Fixes

-- 1. Enable Row Level Security on all tables that don't have it enabled
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_emails ENABLE ROW LEVEL SECURITY;

-- 2. Fix user_id columns to be NOT NULL for data integrity
-- First, ensure all existing records have proper user_id values
-- Update any NULL user_id records (this shouldn't happen, but safety first)
UPDATE public.vehicles SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;
UPDATE public.service_records SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;
UPDATE public.call_records SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Now make user_id columns NOT NULL
ALTER TABLE public.vehicles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.service_records ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.call_records ALTER COLUMN user_id SET NOT NULL;

-- 3. Secure database functions with proper search_path
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'superadmin'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_email_authorized(_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.authorized_emails
    WHERE email = _email
      AND is_active = TRUE
  )
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if email is authorized before creating profile
  IF NOT public.is_email_authorized(NEW.email) THEN
    RAISE EXCEPTION 'Email not authorized to create account';
  END IF;
  
  -- Insert profile for authorized user with default service center name
  INSERT INTO public.profiles (id, email, role, service_center_name)
  VALUES (NEW.id, NEW.email, 'service_center', 'Service Center ' || SUBSTRING(NEW.id::text, 1, 8));
  
  RETURN NEW;
END;
$$;