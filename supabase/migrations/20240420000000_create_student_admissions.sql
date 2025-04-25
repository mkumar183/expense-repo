
-- Create student_admissions table
CREATE TABLE IF NOT EXISTS student_admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  grade_id UUID NOT NULL REFERENCES grades(id) ON DELETE CASCADE,
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')),
  admitted_by UUID NOT NULL REFERENCES users(id),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create RLS policies
ALTER TABLE student_admissions ENABLE ROW LEVEL SECURITY;

-- Allow tenant admins and school admins to view student admissions
CREATE POLICY "Admins can view student admissions"
  ON student_admissions FOR SELECT
  USING (
    (SELECT tenant_id FROM users WHERE id = auth.uid()) IN
    (SELECT tenant_id FROM schools WHERE id = student_admissions.school_id)
  );

-- Allow tenant admins and school admins to insert student admissions
CREATE POLICY "Admins can create student admissions"
  ON student_admissions FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('tenant_admin', 'school_admin')
  );

-- Allow tenant admins and school admins to update student admissions
CREATE POLICY "Admins can update student admissions"
  ON student_admissions FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('tenant_admin', 'school_admin')
  );

-- Create trigger for updated_at
CREATE TRIGGER student_admissions_updated_at
  BEFORE UPDATE ON student_admissions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
