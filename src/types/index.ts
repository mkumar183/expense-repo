export type Section = {
  id: string;
  name: string;
  school_id: string;
  grade_id: string;
  academic_session_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Grade = {
  id: string;
  name: string;
  level: number;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student';
  schoolId: string;
  schoolName: string;
  grade: string;
  gradeId: string;
  sectionId?: string;
  sectionName?: string;
  dateOfBirth: string;
  admissionStatus: string;
  admittedBy: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  schoolId: string;
  tenantId: string;
  schoolName: string;
  email: string;
  phone?: string;
  subjects?: string[];
}

export type School = {
  id: string;
  name: string;
};

export type StudentAdmission = {
  id: string;
  student_id: string;
  school_id: string;
  grade_id: string;
  admission_date: string;
  status: 'active' | 'inactive' | 'pending';
  admitted_by: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
};
