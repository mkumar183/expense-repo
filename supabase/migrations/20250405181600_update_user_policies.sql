-- Add unique constraints to grades table
ALTER TABLE grades
ADD CONSTRAINT unique_grade_level_per_tenant UNIQUE (tenant_id, level),
ADD CONSTRAINT unique_grade_name_per_tenant UNIQUE (tenant_id, name); 