-- Drop existing policies
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN SELECT policyname 
               FROM pg_policies 
               WHERE schemaname = 'public' 
               AND tablename = 'parent_student_relationships' 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.parent_student_relationships', pol.policyname);
    END LOOP;
END $$;

-- Drop the table if it exists
DROP TABLE IF EXISTS public.parent_student_relationships CASCADE;

-- Drop any existing policies on users table related to parent-child relationships
DROP POLICY IF EXISTS "Parents can see their children's profiles" ON public.users;

-- Create the parent-student relationships table
CREATE TABLE public.parent_student_relationships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL DEFAULT 'parent',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- Enable RLS
ALTER TABLE public.parent_student_relationships ENABLE ROW LEVEL SECURITY;

-- Basic policies
-- Superadmins can do everything
CREATE POLICY "Superadmins have full access" ON public.parent_student_relationships
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'superadmin')
    WITH CHECK (auth.jwt() ->> 'role' = 'superadmin');

-- School admins can manage relationships in their school
CREATE POLICY "School admins can manage relationships in their school" ON public.parent_student_relationships
    FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'school_admin' AND
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = student_id
            AND school_id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID
        )
    )
    WITH CHECK (
        auth.jwt() ->> 'role' = 'school_admin' AND
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = student_id
            AND school_id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID
        )
    );

-- Tenant admins can manage relationships in their tenant
CREATE POLICY "Tenant admins can manage relationships in their tenant" ON public.parent_student_relationships
    FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'tenant_admin' AND
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = student_id
            AND tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
        )
    )
    WITH CHECK (
        auth.jwt() ->> 'role' = 'tenant_admin' AND
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = student_id
            AND tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_parent_student_relationship_updated
    BEFORE UPDATE ON public.parent_student_relationships
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 