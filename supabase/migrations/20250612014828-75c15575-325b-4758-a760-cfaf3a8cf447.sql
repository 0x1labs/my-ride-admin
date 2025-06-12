
-- First, let's drop ALL existing policies on both tables to start fresh
DROP POLICY IF EXISTS "Superadmins can manage all authorized emails" ON public.authorized_emails;
DROP POLICY IF EXISTS "Superadmins can manage authorized emails" ON public.authorized_emails;
DROP POLICY IF EXISTS "Anyone can check if their email is authorized" ON public.authorized_emails;
DROP POLICY IF EXISTS "Users can check their own email authorization" ON public.authorized_emails;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superadmins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Superadmins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during signup" ON public.profiles;

-- Now create the new policies for authorized_emails
CREATE POLICY "superadmin_manage_emails"
  ON public.authorized_emails
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'superadmin'
    )
  );

-- Allow users to check if their own email is authorized (for signup validation)
CREATE POLICY "check_own_email_auth"
  ON public.authorized_emails
  FOR SELECT
  USING (email = auth.jwt() ->> 'email');

-- Create policies for profiles table
CREATE POLICY "view_own_profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "superadmin_view_profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'superadmin'
    )
  );

CREATE POLICY "superadmin_update_profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'superadmin'
    )
  );

-- Allow profile creation during signup (handled by trigger)
CREATE POLICY "allow_profile_creation"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
