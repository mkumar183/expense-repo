-- First, drop ALL existing policies
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN SELECT policyname 
               FROM pg_policies 
               WHERE schemaname = 'public' 
               AND tablename = 'users' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
    END LOOP;
END $$;

-- First, update any existing roles to match the new schema
UPDATE public.users
SET role = 'tenant_admin'
WHERE role = 'school_admin';

-- Drop the trigger and function
DROP TRIGGER IF EXISTS on_user_update ON public.users;
DROP FUNCTION IF EXISTS public.handle_user_update();

-- Alter the role column to include new roles
ALTER TABLE public.users 
  DROP CONSTRAINT IF EXISTS users_role_check;

-- Update any null or invalid roles to a default value
UPDATE public.users
SET role = 'student'
WHERE role IS NULL OR role NOT IN ('superadmin', 'tenant_admin', 'school_admin', 'teacher', 'staff', 'student', 'parent');

-- Now add the constraint
ALTER TABLE public.users 
  ADD CONSTRAINT users_role_check 
  CHECK (role IN ('superadmin', 'tenant_admin', 'school_admin', 'teacher', 'staff', 'student', 'parent'));

-- Recreate policies with new role names
-- Allow profile creation during registration
CREATE POLICY "Allow profile creation during registration" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Users can see their own profile
CREATE POLICY "Users can see their own profile" ON public.users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Superadmins can see all profiles
CREATE POLICY "Superadmins can see all profiles" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'superadmin');

-- Tenant admins can see profiles in their tenant
CREATE POLICY "Tenant admins can see profiles in their tenant" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'tenant_admin' AND 
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
  );

-- School admins can see profiles in their school
CREATE POLICY "School admins can see profiles in their school" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'school_admin' AND 
    school_id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID
  );

-- Teachers can see profiles in their school
CREATE POLICY "Teachers can see profiles in their school" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'teacher' AND 
    school_id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID
  );

-- Staff can see profiles in their school
CREATE POLICY "Staff can see profiles in their school" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'staff' AND 
    school_id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND (role = (SELECT role FROM public.users WHERE id = auth.uid())));

-- Superadmins can update any profile
CREATE POLICY "Superadmins can update any profile" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'superadmin');

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Recreate the trigger function
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's metadata in auth.users
  UPDATE auth.users 
  SET raw_app_meta_data = 
    jsonb_build_object(
      'role', NEW.role,
      'tenant_id', NEW.tenant_id,
      'school_id', NEW.school_id
    )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_user_update
  AFTER INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_user_update(); 