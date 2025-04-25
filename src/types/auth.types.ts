import { Session } from '@supabase/supabase-js';

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'tenant_admin' | 'school_admin' | 'teacher' | 'staff' | 'student' | 'parent';
  tenantId?: string;
  schoolId?: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role?: 'admin' | 'school_admin' | 'teacher' | 'student') => Promise<void>;
  logout: () => Promise<void>;
};
