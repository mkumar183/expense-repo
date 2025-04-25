
export type Tenant = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  admin_name: string | null;
  admin_email: string | null;
};

export type School = {
  id: string;
  tenant_id: string;
  name: string;
  address: string | null;
  type: string | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  name: string | null;
  role: 'admin' | 'school_admin' | 'teacher' | 'student';
  tenant_id: string | null;
  school_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Class = {
  id: string;
  school_id: string;
  name: string;
  description: string | null;
  subject: string | null;
  grade_level: string | null;
  school_year: string | null;
  teacher_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Enrollment = {
  id: string;
  student_id: string;
  class_id: string;
  status: 'active' | 'completed' | 'dropped';
  enrollment_date: string;
  created_at: string;
  updated_at: string;
};

export type AcademicSession = {
  id: string;
  tenant_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
};

export type Term = {
  id: string;
  academic_session_id: string;
  name: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

export type Holiday = {
  id: string;
  academic_session_id: string;
  name: string;
  date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: Tenant;
        Insert: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Tenant, 'id' | 'created_at' | 'updated_at'>>;
      };
      schools: {
        Row: School;
        Insert: Omit<School, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<School, 'id' | 'created_at' | 'updated_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      classes: {
        Row: Class;
        Insert: Omit<Class, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Class, 'id' | 'created_at' | 'updated_at'>>;
      };
      enrollments: {
        Row: Enrollment;
        Insert: Omit<Enrollment, 'id' | 'created_at' | 'updated_at' | 'enrollment_date'>;
        Update: Partial<Omit<Enrollment, 'id' | 'created_at' | 'updated_at' | 'enrollment_date'>>;
      };
      academic_sessions: {
        Row: AcademicSession;
        Insert: Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AcademicSession, 'id' | 'created_at' | 'updated_at'>>;
      };
      terms: {
        Row: Term;
        Insert: Omit<Term, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Term, 'id' | 'created_at' | 'updated_at'>>;
      };
      holidays: {
        Row: Holiday;
        Insert: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Holiday, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};
