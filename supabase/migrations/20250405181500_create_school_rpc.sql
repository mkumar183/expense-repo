
-- Create a stored procedure to handle school creation with proper authentication
CREATE OR REPLACE FUNCTION public.create_school(
  name TEXT,
  address TEXT,
  type TEXT,
  tenant_id UUID
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  type TEXT,
  tenant_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_user_role TEXT;
  v_user_tenant_id UUID;
  v_created_school_id UUID;
BEGIN
  -- Get the current user's ID
  v_user_id := auth.uid();
  
  -- Check if user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Get user's role and tenant_id from auth.users metadata
  SELECT 
    (auth.jwt() ->> 'role')::TEXT,
    (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
  INTO v_user_role, v_user_tenant_id;
  
  -- Check the user's role and tenant_id match
  IF v_user_role = 'tenant_admin' AND v_user_tenant_id = tenant_id THEN
    -- Insert the school
    INSERT INTO public.schools (name, address, type, tenant_id)
    VALUES (name, address, type, tenant_id)
    RETURNING id INTO v_created_school_id;
    
    -- Return the created school
    RETURN QUERY
    SELECT s.* FROM public.schools s WHERE s.id = v_created_school_id;
  ELSIF v_user_role = 'superadmin' THEN
    -- Superadmin can create schools for any tenant
    INSERT INTO public.schools (name, address, type, tenant_id)
    VALUES (name, address, type, tenant_id)
    RETURNING id INTO v_created_school_id;
    
    -- Return the created school
    RETURN QUERY
    SELECT s.* FROM public.schools s WHERE s.id = v_created_school_id;
  ELSE
    RAISE EXCEPTION 'Permission denied. Only tenant admins can create schools for their own tenant.';
  END IF;
END;
$$;

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.create_school TO authenticated;
