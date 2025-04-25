-- Create users table to extend auth.users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('superadmin', 'tenant_admin', 'school_admin', 'teacher', 'staff', 'student', 'parent')),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT fk_tenant
    FOREIGN KEY(tenant_id)
    REFERENCES tenants(id)
    ON DELETE SET NULL,
    
  CONSTRAINT fk_school
    FOREIGN KEY(school_id)
    REFERENCES schools(id)
    ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX users_tenant_id_idx ON public.users(tenant_id);
CREATE INDEX users_school_id_idx ON public.users(school_id);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

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

-- Teachers can see student profiles in their school
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

-- Parents can see their children's profiles
CREATE POLICY "Parents can see their children's profiles" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'parent' AND 
    id IN (
      SELECT student_id FROM public.parent_student_relationships 
      WHERE parent_id = auth.uid()
    )
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

-- Create a trigger to set app_metadata when profile changes
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

-- Create trigger for handling profile updates
CREATE TRIGGER on_user_update
  AFTER INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_user_update();
