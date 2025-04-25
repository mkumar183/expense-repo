
-- 1. Drop all existing policies
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'tenants'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.tenants', pol.policyname);
    END LOOP;
END $$;

-- 2. Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- 3. Create new policies

-- Allow superadmins to view all tenants
CREATE POLICY "superadmins_select_policy" ON public.tenants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'superadmin'
        )
    );

-- Allow tenant admins to view their own tenant
CREATE POLICY "tenant_admins_select_policy" ON public.tenants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'tenant_admin'
            AND tenant_id = tenants.id
        )
    );

-- Allow superadmins to insert/update/delete tenants
CREATE POLICY "superadmins_insert_policy" ON public.tenants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'superadmin'
        )
    );

CREATE POLICY "superadmins_update_policy" ON public.tenants
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'superadmin'
        )
    );

CREATE POLICY "superadmins_delete_policy" ON public.tenants
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid()
            AND role = 'superadmin'
        )
    );

-- 4. Grant necessary permissions
GRANT ALL ON public.tenants TO authenticated;
GRANT ALL ON public.tenants TO service_role;
