-- Drop the previously created table if it exists
DROP TABLE IF EXISTS public.student_section_enrollments;

-- Step 1: Create the table without the WHERE clause
CREATE TABLE public.student_section_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  section_id UUID NOT NULL REFERENCES sections(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'transferred', 'withdrawn')),
  enrolled_by UUID NOT NULL REFERENCES users(id),
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  notes TEXT
);

-- Step 2: Add a partial unique index for active enrollments
CREATE UNIQUE INDEX unique_active_enrollment
ON public.student_section_enrollments(student_id, section_id)
WHERE status = 'active';

-- Create trigger to update updated_at on row update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON student_section_enrollments
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Create trigger to ensure effective_to is set when status changes from 'active'
CREATE OR REPLACE FUNCTION handle_enrollment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'active' AND NEW.status != 'active' THEN
    NEW.effective_to = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrollment_status_change
BEFORE UPDATE ON student_section_enrollments
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION handle_enrollment_status_change();

-- Add RLS policies
ALTER TABLE public.student_section_enrollments ENABLE ROW LEVEL SECURITY;

-- Policy for viewing section enrollments
CREATE POLICY "Users can view section enrollments" 
ON public.student_section_enrollments 
FOR SELECT 
USING (true);

CREATE POLICY "School admins can enroll students" 
ON public.student_section_enrollments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'school_admin'
    AND u.school_id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID
    AND u.tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
  )
  AND EXISTS (
    SELECT 1
    FROM schools s
    WHERE s.id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID    
    AND s.tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
  )
);


CREATE POLICY "School admins can update enrollments" 
ON public.student_section_enrollments 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1
    FROM users u
    WHERE u.id = auth.uid()
    AND u.role = 'school_admin'
    AND u.school_id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID
    AND u.tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
  )
  AND EXISTS (
    SELECT 1
    FROM schools s
    WHERE s.id = (auth.jwt() -> 'app_metadata' ->> 'school_id')::UUID    
    AND s.tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::UUID
  )
);



-- Create helpful view for current enrollments
CREATE OR REPLACE VIEW current_section_enrollments AS
SELECT 
  se.*,
  u.name as student_name,
  s.name as section_name,
  g.name as grade_name
FROM student_section_enrollments se
JOIN users u ON se.student_id = u.id
JOIN sections s ON se.section_id = s.id
JOIN grades g ON s.grade_id = g.id
WHERE se.status = 'active'
  AND (se.effective_to IS NULL OR se.effective_to >= CURRENT_DATE);

COMMENT ON VIEW current_section_enrollments IS 
  'Shows all active section enrollments with related student and section information';
