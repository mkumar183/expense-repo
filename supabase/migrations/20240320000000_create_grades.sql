-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(tenant_id, level)
);

-- Create RLS policies
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Allow tenant admins full access to their tenant's grades
CREATE POLICY "Tenant admins have full access to grades"
  ON grades
  USING (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'tenant_admin' AND
    auth.jwt() ->> 'tenant_id' = tenant_id::text
  )
  WITH CHECK (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'tenant_admin' AND
    auth.jwt() ->> 'tenant_id' = tenant_id::text
  );

-- Allow any user in the same tenant to view grades
CREATE POLICY "Users can view grades in their tenant"
  ON grades FOR SELECT
  USING (
    auth.jwt() ->> 'tenant_id' = tenant_id::text
  );

-- Allow all users with same tenant_id to select grades
CREATE POLICY "Same tenant users can select grades"
  ON grades FOR SELECT
  USING (
    auth.jwt() ->> 'tenant_id' = tenant_id::text
  ); 