-- Create schools table
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  CONSTRAINT fk_tenant
    FOREIGN KEY(tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX schools_tenant_id_idx ON public.schools(tenant_id);

-- Enable RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Superadmins can see all schools
CREATE POLICY "Superadmins can see all schools" ON public.schools
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'superadmin');

-- Tenant admins can see schools in their tenant
CREATE POLICY "Tenant admins can see schools in their tenant" ON public.schools
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'tenant_admin' AND 
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
  );

-- School admins, teachers, staff, and students can see their own schools
CREATE POLICY "Users can see schools in their tenant" ON public.schools
  FOR SELECT
  TO authenticated
  USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID);

-- Only superadmins, tenant admins, and school admins can insert/update/delete schools
CREATE POLICY "Admins can insert schools" ON public.schools
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' = 'superadmin' OR 
    auth.jwt() ->> 'role' = 'tenant_admin' OR
    (auth.jwt() ->> 'role' = 'school_admin' AND tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID)
  );

CREATE POLICY "Admins can update schools" ON public.schools
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'superadmin' OR 
    auth.jwt() ->> 'role' = 'tenant_admin' OR
    (auth.jwt() ->> 'role' = 'school_admin' AND tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID)
  );

CREATE POLICY "Admins can delete schools" ON public.schools
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'superadmin' OR 
    auth.jwt() ->> 'role' = 'tenant_admin' OR
    (auth.jwt() ->> 'role' = 'school_admin' AND tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID)
  );
