
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('superadmin', 'service_center');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'service_center',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create authorized_emails table for superadmin to manage access
CREATE TABLE public.authorized_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  authorized_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id)
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_emails ENABLE ROW LEVEL SECURITY;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if email is authorized
CREATE OR REPLACE FUNCTION public.is_email_authorized(_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.authorized_emails
    WHERE email = _email
      AND is_active = TRUE
  )
$$;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Superadmins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'superadmin'));

-- RLS policies for authorized_emails
CREATE POLICY "Superadmins can manage authorized emails"
  ON public.authorized_emails
  FOR ALL
  USING (public.has_role(auth.uid(), 'superadmin'));

CREATE POLICY "Anyone can check if their email is authorized"
  ON public.authorized_emails
  FOR SELECT
  USING (email = auth.jwt() ->> 'email');

-- Create trigger function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if email is authorized before creating profile
  IF NOT public.is_email_authorized(NEW.email) THEN
    RAISE EXCEPTION 'Email not authorized to create account';
  END IF;
  
  -- Insert profile for authorized user
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'service_center');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert the first superadmin (you'll need to update this email)
INSERT INTO public.authorized_emails (email, is_active) 
VALUES ('superadmin@example.com', TRUE);
