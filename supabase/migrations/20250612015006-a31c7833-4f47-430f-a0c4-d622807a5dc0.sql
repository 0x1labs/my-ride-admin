
-- First, create security definer functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'superadmin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "superadmin_manage_emails" ON public.authorized_emails;
DROP POLICY IF EXISTS "check_own_email_auth" ON public.authorized_emails;
DROP POLICY IF EXISTS "view_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "superadmin_view_profiles" ON public.profiles;
DROP POLICY IF EXISTS "superadmin_update_profiles" ON public.profiles;
DROP POLICY IF EXISTS "allow_profile_creation" ON public.profiles;

-- Create non-recursive policies for profiles table
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policies for authorized_emails using the security definer function
CREATE POLICY "authorized_emails_superadmin_all"
  ON public.authorized_emails
  FOR ALL
  USING (public.is_superadmin())
  WITH CHECK (public.is_superadmin());

CREATE POLICY "authorized_emails_check_own"
  ON public.authorized_emails
  FOR SELECT
  USING (email = auth.jwt() ->> 'email');
